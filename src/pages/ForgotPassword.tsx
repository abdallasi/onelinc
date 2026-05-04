import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleReset = async () => {
    try {
      emailSchema.parse(email);
    } catch (error: any) {
      toast({
        title: "Invalid email",
        description: error.errors?.[0]?.message || "Please enter a valid email",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-xl font-semibold hover:opacity-70 transition-opacity"
      >
        onelinc
      </button>

      <div className="max-w-md w-full">
        <div className="bg-card rounded-3xl shadow-apple-lg p-8 border border-border animate-scale-in">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">
                {sent ? "Check your email" : "Reset password"}
              </h1>
              <p className="text-muted-foreground">
                {sent
                  ? `We sent a reset link to ${email}`
                  : "Enter your email and we'll send you a link"}
              </p>
            </div>

            {!sent && (
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="py-5 rounded-xl"
                  onKeyPress={(e) => e.key === "Enter" && handleReset()}
                />
                <Button
                  size="lg"
                  className="w-full py-6 rounded-full shadow-apple hover:scale-[1.01] active:scale-[0.99] transition-transform"
                  onClick={handleReset}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => navigate("/auth")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;