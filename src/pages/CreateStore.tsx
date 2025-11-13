import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CreateStore = () => {
  const [shopName, setShopName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold">
            Name your shop
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose something memorable
          </p>
        </div>

        <div className="space-y-4">
          <Input
            type="text"
            placeholder="My Amazing Store"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className="text-lg py-6 text-center rounded-2xl border-2 focus:border-primary"
            onKeyPress={(e) => e.key === "Enter" && handleCreateStore()}
            autoFocus
          />

          <Button
            size="lg"
            className="w-full text-lg py-6 rounded-full shadow-apple-lg"
            onClick={handleCreateStore}
            disabled={isLoading}
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