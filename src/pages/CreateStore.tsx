import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

const CreateStore = () => {
  const [shopName, setShopName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [showShake, setShowShake] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Debounced name availability check
  const checkAvailability = useCallback(async (name: string) => {
    if (!name.trim() || name.length < 2) {
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);
    const slug = generateSlug(name);

    try {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("slug")
        .eq("slug", slug)
        .single();

      if (existingProfile) {
        setIsAvailable(false);
        setShowShake(true);
        setTimeout(() => setShowShake(false), 500);
      } else {
        setIsAvailable(true);
      }
    } catch {
      // No match found = available
      setIsAvailable(true);
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      checkAvailability(shopName);
    }, 400);

    return () => clearTimeout(timer);
  }, [shopName, checkAvailability]);

  const handleCreateStore = async () => {
    if (!shopName.trim()) {
      toast({
        title: "Please enter a shop name",
        variant: "destructive",
      });
      return;
    }

    if (isAvailable === false) {
      setShowShake(true);
      setTimeout(() => setShowShake(false), 500);
      return;
    }

    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        localStorage.setItem("pendingShopName", shopName);
        navigate("/auth");
        return;
      }

      const slug = generateSlug(shopName);

      const { error } = await supabase
        .from("profiles")
        .insert({
          name: shopName,
          slug: slug,
          user_id: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Store created!",
        description: "Let's add your first products",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error creating store",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-8 animate-scale-in">
        <div className="text-center">
          <button 
            onClick={() => navigate("/")}
            className="text-2xl font-semibold hover:opacity-70 transition-opacity"
          >
            onelinc
          </button>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold">
            Name your shop
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose something memorable
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="My Amazing Store"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className={`text-lg py-6 text-center rounded-2xl border-2 transition-all pr-12 ${
                showShake ? "animate-shake" : ""
              } ${
                isAvailable === false 
                  ? "border-destructive focus:border-destructive" 
                  : isAvailable === true 
                    ? "border-green-500 focus:border-green-500" 
                    : "focus:border-primary"
              }`}
              onKeyPress={(e) => e.key === "Enter" && handleCreateStore()}
              autoFocus
            />
            
            {/* Status indicator */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {isChecking && (
                <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
              )}
              {!isChecking && isAvailable === true && shopName.length >= 2 && (
                <Check className="w-5 h-5 text-green-500 animate-scale-in" />
              )}
            </div>
          </div>

          {/* Inline error message */}
          {isAvailable === false && (
            <p className="text-sm text-destructive text-center animate-fade-in">
              Name already taken
            </p>
          )}

          <Button
            size="lg"
            className="w-full text-lg py-6 rounded-full shadow-apple-lg hover:scale-[1.02] transition-transform"
            onClick={handleCreateStore}
            disabled={isLoading || isChecking || isAvailable === false}
          >
            {isLoading ? "Creating..." : "Generate Store"}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          You can change this later
        </p>
      </div>
    </div>
  );
};

export default CreateStore;