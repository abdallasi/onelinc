import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";

const CreateStore = () => {
  const [shopName, setShopName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<"available" | "taken" | null>(null);
  const [showShake, setShowShake] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Real-time availability check with debounce
  useEffect(() => {
    if (!shopName.trim()) {
      setAvailability(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsChecking(true);
      const slug = generateSlug(shopName);
      
      try {
        const { data } = await supabase
          .from("profiles")
          .select("slug")
          .eq("slug", slug)
          .maybeSingle();

        if (data) {
          setAvailability("taken");
          setShowShake(true);
          setTimeout(() => setShowShake(false), 500);
        } else {
          setAvailability("available");
        }
      } catch (error) {
        console.error("Error checking availability:", error);
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [shopName]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleCreateStore = async () => {
    if (!shopName.trim()) {
      toast({
        title: "Please enter a shop name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Store the shop name in localStorage and redirect to auth
        localStorage.setItem("pendingShopName", shopName);
        navigate("/auth");
        return;
      }

      const slug = generateSlug(shopName);
      
      // Check if slug already exists
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("slug")
        .eq("slug", slug)
        .single();

      if (existingProfile) {
        toast({
          title: "Shop name already taken",
          description: "Please choose a different name",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
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
        {/* Logo - clickable to home */}
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
              className={`text-lg py-6 text-center rounded-2xl border-2 transition-all ${
                availability === "taken" 
                  ? "border-destructive focus:border-destructive" 
                  : availability === "available"
                  ? "border-green-500 focus:border-green-500"
                  : "focus:border-primary"
              } ${showShake ? "animate-shake" : ""}`}
              onKeyPress={(e) => e.key === "Enter" && handleCreateStore()}
              autoFocus
            />
            
            {/* Real-time validation feedback */}
            {shopName.trim() && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {isChecking ? (
                  <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
                ) : availability === "taken" ? (
                  <div className="flex items-center gap-2 animate-fade-in">
                    <X className="h-5 w-5 text-destructive" />
                  </div>
                ) : availability === "available" ? (
                  <div className="animate-scale-in">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Inline error message */}
          {availability === "taken" && (
            <p className="text-sm text-destructive text-center animate-fade-in">
              Name already taken.
            </p>
          )}

          <Button
            size="lg"
            className="w-full text-lg py-6 rounded-full shadow-apple-lg hover:scale-[1.02] transition-transform"
            onClick={handleCreateStore}
            disabled={isLoading || availability === "taken"}
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