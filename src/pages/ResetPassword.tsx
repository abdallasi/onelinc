import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, KeyRound, Loader2, Mail } from "lucide-react";
import { getPasswordResetRedirectUrl, getResetLinkErrorMessage, getResetRequestErrorMessage } from "@/lib/passwordReset";

const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

type ResetState = "checking" | "ready" | "invalid" | "done";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resetState, setResetState] = useState<ResetState>("checking");
  const [errorMessage, setErrorMessage] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const markInvalid = (message?: string) => {
      if (!mounted) return;
      setResetState("invalid");
      setErrorMessage(getResetLinkErrorMessage(message));
    };

    const verifyResetLink = async () => {
      const params = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const code = params.get("code");
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const urlError = params.get("error_description") || hashParams.get("error_description") || params.get("error") || hashParams.get("error");

      if (urlError) {
        markInvalid(urlError);
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!mounted) return;
        if (error) {
          markInvalid(error.message);
          return;
        }
        window.history.replaceState({}, document.title, "/reset-password");
        setResetState("ready");
        return;
      }

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!mounted) return;
        if (error) {
          markInvalid(error.message);
          return;
        }
        window.history.replaceState({}, document.title, "/reset-password");
        setResetState("ready");
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;

      if (session) {
        setResetState("ready");
      } else {
        markInvalid();
      }
    };

    verifyResetLink();

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (mounted && event === "PASSWORD_RECOVERY") {
        setResetState("ready");
        setErrorMessage("");
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleUpdate = async () => {
    setErrorMessage("");
    try {
      passwordSchema.parse(password);
    } catch (error: unknown) {
      const message = error instanceof z.ZodError ? error.errors[0]?.message : "Password must be at least 6 characters";
      setErrorMessage(message || "Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setErrorMessage("Passwords don’t match");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      await supabase.auth.signOut();
      setResetState("done");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      setErrorMessage(message || "We could not update your password. Please request a fresh link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setErrorMessage("");
    setResendMessage("");
    try {
      z.string().email("Please enter a valid email address").parse(resendEmail);
    } catch (error: unknown) {
      const message = error instanceof z.ZodError ? error.errors[0]?.message : "Please enter a valid email";
      setErrorMessage(message || "Please enter a valid email");
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resendEmail, {
        redirectTo: getPasswordResetRedirectUrl(),
      });
      if (error) throw error;
      setResendMessage("If an Onelink account exists for that email, a fresh reset link has been sent.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      setErrorMessage(getResetRequestErrorMessage(message));
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    if (resetState === "checking") {
      return (
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-foreground">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Verifying reset link</h1>
            <p className="text-muted-foreground">This should only take a moment.</p>
          </div>
        </div>
      );
    }

    if (resetState === "done") {
      return (
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-foreground">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Password updated</h1>
            <p className="text-muted-foreground">Sign in with your new password to continue.</p>
          </div>
          <Button size="lg" className="w-full py-6 rounded-full shadow-apple" onClick={() => navigate("/auth")}>Sign in</Button>
        </div>
      );
    }

    if (resetState === "invalid") {
      return (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-foreground">
              <Mail className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold">Reset link expired</h1>
            <p className="text-muted-foreground">Request a fresh link and use the newest email from Onelink.</p>
          </div>
          {errorMessage && <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive animate-slide-down">{errorMessage}</p>}
          {resendMessage && <p className="rounded-2xl bg-secondary px-4 py-3 text-sm text-foreground animate-slide-down">{resendMessage}</p>}
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={resendEmail}
              autoComplete="email"
              onChange={(e) => {
                setResendEmail(e.target.value);
                setErrorMessage("");
              }}
              className={`py-5 rounded-xl ${errorMessage && !resendMessage ? "border-destructive/60 animate-shake" : ""}`}
              onKeyDown={(e) => e.key === "Enter" && handleResend()}
            />
            <Button size="lg" className="w-full py-6 rounded-full shadow-apple" onClick={handleResend} disabled={isResending}>
              {isResending ? "Sending..." : "Send fresh link"}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-foreground">
            <KeyRound className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold">Set new password</h1>
          <p className="text-muted-foreground">Choose a new password for your Onelink account.</p>
        </div>

        <div className="space-y-4">
          <Input
            type="password"
            placeholder="New password"
            value={password}
            autoComplete="new-password"
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage("");
            }}
            className={`py-5 rounded-xl ${errorMessage ? "border-destructive/60" : ""}`}
          />
          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            autoComplete="new-password"
            onChange={(e) => {
              setConfirm(e.target.value);
              setErrorMessage("");
            }}
            className={`py-5 rounded-xl ${errorMessage ? "border-destructive/60 animate-shake" : ""}`}
            onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
          />
          {errorMessage && <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive animate-slide-down">{errorMessage}</p>}
          <Button size="lg" className="w-full py-6 rounded-full shadow-apple hover:scale-[1.01] active:scale-[0.99] transition-transform" onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update password"}
          </Button>
        </div>
      </div>
    );
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
            {renderContent()}
            {resetState !== "done" && (
              <div className="text-center">
                <button
                  onClick={() => navigate("/auth")}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to sign in
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;