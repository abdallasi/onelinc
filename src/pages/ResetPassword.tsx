import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Supabase puts the recovery session in the URL hash and signs the user in
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleUpdate = async () => {
    try {
      passwordSchema.parse(password);
    } catch (error: any) {
      toast({
        title: "Invalid password",
        description: error.errors?.[0]?.message,
        variant: "destructive",
      });
      return;
    }
    if (password !== confirm) {
      toast({
        title: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Password updated" });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Update failed",
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
              <h1 className="text-3xl font-bold">Set new password</h1>
              <p className="text-muted-foreground">
                {ready ? "Choose a new password for your account" : "Verifying reset link..."}
              </p>
            </div>

            {ready && (
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="py-5 rounded-xl"
                />
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="py-5 rounded-xl"
                  onKeyPress={(e) => e.key === "Enter" && handleUpdate()}
                />
                <Button
                  size="lg"
                  className="w-full py-6 rounded-full shadow-apple hover:scale-[1.01] active:scale-[0.99] transition-transform"
                  onClick={handleUpdate}
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update password"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;