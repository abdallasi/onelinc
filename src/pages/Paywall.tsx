import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";

const Paywall = () => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    // This would integrate with payment processing
    // For now, just show a toast
    alert("Payment integration coming soon! This would charge ₦2,000/month.");
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
              <p className="text-5xl font-bold">₦2,000</p>
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
            >
              Upgrade Now
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