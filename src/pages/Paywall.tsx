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
      <div className="max-w-lg w-full text-center space-y-8 animate-scale-in">
        {/* Logo - clickable */}
        <button 
          onClick={() => navigate("/")}
          className="text-2xl font-semibold hover:opacity-70 transition-opacity mx-auto block"
        >
          onelinc
        </button>

        <div className="space-y-4">
          <div className="w-20 h-20 bg-primary/5 rounded-full mx-auto flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-[44px] font-bold leading-tight tracking-tight">
            Unlock Unlimited
          </h1>
          <p className="text-[17px] text-muted-foreground leading-snug">
            Add your 4th product and grow without limits.
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl rounded-[28px] border border-border/50 p-8 shadow-apple-lg">
          <div className="space-y-8">
            <div>
              <p className="text-[56px] font-semibold tracking-tight">₦3,000</p>
              <p className="text-[15px] text-muted-foreground">per month</p>
            </div>

            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-[15px]">Unlimited products</p>
                  <p className="text-[13px] text-muted-foreground">No restrictions on your catalog</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-[15px]">Custom branding</p>
                  <p className="text-[13px] text-muted-foreground">Make it truly yours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-[15px]">Priority support</p>
                  <p className="text-[13px] text-muted-foreground">Get help when you need it</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-[15px]">Analytics dashboard</p>
                  <p className="text-[13px] text-muted-foreground">Track your success</p>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full h-[52px] rounded-[14px] shadow-sm text-[15px] font-semibold hover:scale-[1.01] active:scale-[0.99] transition-transform"
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
              className="w-full h-[44px] text-[15px]"
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