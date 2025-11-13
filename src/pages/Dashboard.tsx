import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, LogOut, User, ExternalLink } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductForm from "@/components/ProductForm";
import ProfileSettings from "@/components/ProfileSettings";

const Dashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    fetchProfile(session.user.id);
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      if (!data) {
        // No profile yet, check if there's a pending shop name
        const pendingName = localStorage.getItem("pendingShopName");
        if (pendingName) {
          // Create profile with pending name
          await createProfileFromPending(userId, pendingName);
        } else {
          navigate("/create");
        }
        return;
      }

      setProfile(data);
      fetchProducts(data.id);
    } catch (error: any) {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createProfileFromPending = async (userId: string, shopName: string) => {
    try {
      const slug = shopName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const { data, error } = await supabase
        .from("profiles")
        .insert({
          name: shopName,
          slug: slug,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;

      localStorage.removeItem("pendingShopName");
      setProfile(data);
      fetchProducts(data.id);
    } catch (error: any) {
      toast({
        title: "Error creating profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchProducts = async (profileId: string) => {
    try {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("profile_id", profileId)
        .order("order_index");

      if (error) throw error;

      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading products",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    if (products.length >= 3) {
      navigate("/paywall");
      return;
    }
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from("cards")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== productId));
      toast({
        title: "Product deleted",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (showProductForm) {
    return (
      <ProductForm
        profile={profile}
        product={editingProduct}
        onClose={() => {
          setShowProductForm(false);
          setEditingProduct(null);
        }}
        onSave={() => {
          setShowProductForm(false);
          setEditingProduct(null);
          fetchProducts(profile.id);
        }}
      />
    );
  }

  if (showProfileSettings) {
    return (
      <ProfileSettings
        profile={profile}
        onClose={() => setShowProfileSettings(false)}
        onSave={(updatedProfile) => {
          setProfile(updatedProfile);
          setShowProfileSettings(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(`/shop/${profile.slug}`, "_blank")}
              title="View store"
            >
              <ExternalLink className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowProfileSettings(true)}
              title="Profile settings"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Store Header */}
        <div className="mb-8 text-center space-y-2">
          <div className="w-24 h-24 bg-secondary rounded-full mx-auto flex items-center justify-center text-4xl">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              "🛍️"
            )}
          </div>
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          {profile.bio && (
            <p className="text-muted-foreground">{profile.bio}</p>
          )}
          <p className="text-sm text-muted-foreground">
            onlink.app/shop/{profile.slug}
          </p>
        </div>

        {/* Products Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Products ({products.length}/3)
            </h3>
            <Button onClick={handleAddProduct} className="rounded-full">
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </Button>
          </div>

          {products.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <p className="text-muted-foreground mb-4">No products yet</p>
              <Button onClick={handleAddProduct} variant="outline" className="rounded-full">
                <Plus className="h-5 w-5 mr-2" />
                Add your first product
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;