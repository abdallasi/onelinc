import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, LogOut, User, ExternalLink } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductForm from "@/components/ProductForm";
import ProfileSettings from "@/components/ProfileSettings";
import { PhoneNumberModal } from "@/components/PhoneNumberModal";
import { ShareSuccessModal } from "@/components/ShareSuccessModal";

const Dashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
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
        .maybeSingle();

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
      
      // Check if phone number is missing
      if (!data.phone_number) {
        setShowPhoneModal(true);
      }
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
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/shop/${profile.slug}`;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: profile.name,
            text: `Check out my store: ${profile.name}`,
            url: url,
          });
          // Show modal after successful share
          setShowShareModal(true);
        } catch (error) {
          // User cancelled share
        }
      } else {
        // Fallback to copying
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "Share your store link with customers",
        });
        setShowShareModal(true);
      }
    } catch (error: any) {
      toast({
        title: "Error sharing",
        description: "Failed to share your store",
        variant: "destructive",
      });
    }
  };

  const handlePhoneModalComplete = () => {
    setShowPhoneModal(false);
    if (profile) {
      setProfile({ ...profile, phone_number: "updated" });
    }
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
          <button 
            onClick={() => navigate("/")}
            className="text-xl font-semibold hover:opacity-70 transition-opacity"
          >
            onelinc
          </button>
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
            onelinc.app/shop/{profile.slug}
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
            <>
              {products.length === 1 && (
                <div className="bg-secondary/30 rounded-2xl border border-border/50 p-6 text-center mb-4">
                  <p className="text-sm font-medium mb-2">🎉 Great start!</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your store is live. Ready to share it with customers?
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/shop/${profile.slug}`);
                      toast({
                        title: "Link copied!",
                        description: "Share your store with customers",
                      });
                    }}
                    className="rounded-full"
                  >
                    Copy store link
                  </Button>
                </div>
              )}
              <div className="grid gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                    showActions={true}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Floating Share Button - Apple-style redesign */}
      {products.length > 0 && (
        <button
          onClick={handleShare}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-primary/90 backdrop-blur-xl text-primary-foreground rounded-full px-8 py-4 shadow-apple-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] z-50 font-semibold text-[15px] flex items-center gap-2 border border-primary-foreground/10"
        >
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none" className="text-primary-foreground">
            <path d="M8 0L8 12M8 12L4 8M8 12L12 8M1 14L1 16C1 17.1 1.9 18 3 18L13 18C14.1 18 15 17.1 15 16L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Show your store
        </button>
      )}

      {/* Viral Prompt - after products added */}
      {products.length >= 2 && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 max-w-sm w-[calc(100%-2rem)] z-40 animate-slide-down">
          <div className="bg-card/95 backdrop-blur-xl rounded-[20px] border border-border/50 shadow-apple-lg p-4">
            <p className="text-[13px] text-muted-foreground text-center">
              💡 Stores that share weekly get <span className="font-semibold text-foreground">3× more orders</span>
            </p>
          </div>
        </div>
      )}

      {/* Phone Number Modal */}
      <PhoneNumberModal
        open={showPhoneModal}
        onComplete={handlePhoneModalComplete}
        profileId={profile?.id}
      />

      {/* Share Success Modal */}
      <ShareSuccessModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShareAgain={handleShare}
        storeUrl={`${window.location.origin}/shop/${profile?.slug}`}
      />
    </div>
  );
};

export default Dashboard;