import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { getPasswordResetRedirectUrl, getResetRequestErrorMessage } from "@/lib/passwordReset";

const emailSchema = z.string().email("Please enter a valid email address");

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    setErrorMessage("");
    try {
      emailSchema.parse(email);
    } catch (error: unknown) {
      const message = error instanceof z.ZodError ? error.errors[0]?.message : "Please enter a valid email";
      setErrorMessage(message || "Please enter a valid email");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getPasswordResetRedirectUrl(),
      });
      if (error) throw error;
      setSent(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      setErrorMessage(getResetRequestErrorMessage(message));
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
        onelink
      </button>

      <div className="max-w-md w-full">
        <div className="bg-card rounded-3xl shadow-apple-lg p-8 border border-border animate-scale-in">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-foreground">
                {sent ? <CheckCircle2 className="h-7 w-7" /> : <Mail className="h-7 w-7" />}
              </div>
              <h1 className="text-3xl font-bold">
                {sent ? "Check your inbox" : "Reset your password"}
              </h1>
              <p className="text-muted-foreground">
                {sent
                  ? "If an Onelink account exists for that email, a secure reset link has been sent."
                  : "Enter your email and we’ll send a secure link to reset it."}
              </p>
            </div>

            {!sent && (
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  autoComplete="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage("");
                  }}
                  className={`py-5 rounded-xl ${errorMessage ? "border-destructive/60 animate-shake" : ""}`}
                  onKeyDown={(e) => e.key === "Enter" && handleReset()}
                />
                {errorMessage && (
                  <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive animate-slide-down">
                    {errorMessage}
                  </p>
                )}
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

            {sent && (
              <div className="space-y-3 rounded-2xl bg-secondary p-4 text-sm text-muted-foreground">
                <p>Check inbox and spam. The link expires soon and can only be used once.</p>
                <button
                  onClick={() => {
                    setSent(false);
                    setErrorMessage("");
                  }}
                  className="font-medium text-foreground hover:opacity-70 transition-opacity"
                >
                  Send another link
                </button>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => navigate("/auth")}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
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