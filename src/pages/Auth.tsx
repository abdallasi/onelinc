import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { PhoneNumberModal } from "@/components/PhoneNumberModal";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(() => {
    // Default to signup if coming from create store flow
    return !!localStorage.getItem("pendingShopName");
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [newProfileId, setNewProfileId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  const handleAuth = async () => {
    // Validation
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (error: any) {
      toast({
        title: "Invalid input",
        description: error.errors?.[0]?.message || "Please check your inputs",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const redirectUrl = `${window.location.origin}/dashboard`;
        const pendingShopName = localStorage.getItem("pendingShopName");
        
        // First, check if slug is available
        if (pendingShopName) {
          const slug = pendingShopName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

          const { data: existingProfile } = await supabase
            .from("profiles")
            .select("slug")
            .eq("slug", slug)
            .maybeSingle();

          if (existingProfile) {
            toast({
              title: "Username taken",
              description: "This store name is already in use. Please choose a different one.",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }
        }
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });

        if (error) {
          // Provide specific error messages
          if (error.message.includes("already registered")) {
            throw new Error("This email is already registered. Please sign in instead.");
          }
          throw error;
        }

        // If session is created immediately (email confirmation disabled), show phone modal
        if (data.session) {
          // Fetch the profile ID for the new user
          const { data: profileData } = await supabase
            .from("profiles")
            .select("id")
            .eq("user_id", data.user.id)
            .single();

          if (profileData) {
            setNewProfileId(profileData.id);
            setShowPhoneModal(true);
          } else {
            // No profile yet, just redirect
            toast({
              title: "Account created!",
            });
            navigate("/dashboard");
          }
        } else {
          toast({
            title: "Check your email",
            description: "We've sent you a confirmation link",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Provide specific error messages for sign in
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Incorrect email or password. Please try again.");
          }
          if (error.message.includes("Email not confirmed")) {
            throw new Error("Please verify your email address before signing in.");
          }
          throw error;
        }

        toast({
          title: "Welcome back!",
        });

        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: isSignUp ? "Sign up failed" : "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneModalComplete = () => {
    setShowPhoneModal(false);
    toast({
      title: "Account created!",
    });
    navigate("/dashboard");
  };

  return (
    <>
      <PhoneNumberModal
        open={showPhoneModal}
        onComplete={handlePhoneModalComplete}
        profileId={newProfileId || ""}
      />
      
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-card rounded-3xl shadow-apple-lg p-8 border border-border animate-scale-in">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">
                {isSignUp ? "Create account" : "Welcome back"}
              </h1>
              <p className="text-muted-foreground">
                {isSignUp ? "Start your store journey" : "Sign in to your account"}
              </p>
            </div>

            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="py-5 rounded-xl"
              />

              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-5 rounded-xl"
                onKeyPress={(e) => e.key === "Enter" && handleAuth()}
              />

              <Button
                size="lg"
                className="w-full py-6 rounded-full shadow-apple"
                onClick={handleAuth}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : isSignUp ? "Sign up" : "Sign in"}
              </Button>
            </div>

            <div className="text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Auth;