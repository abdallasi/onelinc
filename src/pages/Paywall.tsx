import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const Paywall = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile) {
        setProfileId(profile.id);
        setUserEmail(user.email || null);
      }
    };

    loadProfile();
  }, []);

  const handleUpgrade = async () => {
    if (!profileId || !userEmail) {
      toast({
        title: "Error",
        description: "Please log in to upgrade",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("initialize-subscription", {
        body: { profileId, email: userEmail },
      });

      if (error) throw error;

      if (data?.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8 animate-scale-in">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-accent/10 rounded-full mx-auto flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-accent" />
          </div>
          <h1 className="text-4xl font-bold">
            Unlock Unlimited Products
          </h1>
          <p className="text-xl text-muted-foreground">
            Add your 4th product and grow without limits.
          </p>
        </div>

        <div className="bg-card rounded-3xl border border-border p-8 shadow-apple-lg">
          <div className="space-y-6">
            <div>
              <p className="text-5xl font-bold">₦3,000</p>
              <p className="text-muted-foreground">per month</p>
            </div>

            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-accent" />
                </div>
                <p>Unlimited products</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-accent" />
                </div>
                <p>Custom branding</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-accent" />
                </div>
                <p>Priority support</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-accent" />
                </div>
                <p>Analytics dashboard</p>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full py-6 rounded-full shadow-apple text-lg"
              onClick={handleUpgrade}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                "Upgrade Now"
              )}
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/dashboard")}
            >
              Maybe later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paywall;