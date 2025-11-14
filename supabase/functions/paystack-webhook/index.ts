import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      throw new Error("Paystack secret key not configured");
    }

    // Verify webhook signature
    const signature = req.headers.get("x-paystack-signature");
    const body = await req.text();
    
    const encoder = new TextEncoder();
    const keyData = encoder.encode(paystackSecretKey);
    const bodyData = encoder.encode(body);
    
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign"]
    );
    
    const signatureData = await crypto.subtle.sign("HMAC", key, bodyData);
    const hash = Array.from(new Uint8Array(signatureData))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    if (hash !== signature) {
      console.error("Invalid signature");
      return new Response("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(body);
    console.log("Paystack webhook event:", event.event);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle different event types
    switch (event.event) {
      case "charge.success":
      case "subscription.create": {
        const { customer, subscription, metadata } = event.data;
        
        if (!metadata?.profile_id) {
          console.error("No profile_id in metadata");
          break;
        }

        const { error } = await supabase
          .from("subscriptions")
          .upsert({
            profile_id: metadata.profile_id,
            customer_code: customer.customer_code,
            subscription_code: subscription?.subscription_code,
            plan_code: "PLN_kdq1b5mhyl6bnrb",
            status: "active",
            next_payment_date: subscription?.next_payment_date || null,
          }, {
            onConflict: "profile_id"
          });

        if (error) {
          console.error("Error updating subscription:", error);
        } else {
          console.log("Subscription activated for profile:", metadata.profile_id);
        }
        break;
      }

      case "subscription.disable":
      case "subscription.not_renew": {
        const { customer } = event.data;
        
        const { error } = await supabase
          .from("subscriptions")
          .update({ status: "cancelled" })
          .eq("customer_code", customer.customer_code);

        if (error) {
          console.error("Error cancelling subscription:", error);
        } else {
          console.log("Subscription cancelled for customer:", customer.customer_code);
        }
        break;
      }

      default:
        console.log("Unhandled event type:", event.event);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in paystack-webhook:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
