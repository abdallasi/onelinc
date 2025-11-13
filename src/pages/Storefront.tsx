import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Share2, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProductModal from "@/components/ProductModal";

const Storefront = () => {
  const { slug } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchStore(slug);
    }
  }, [slug]);

  const fetchStore = async (slug: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("slug", slug)
        .single();

      if (profileError) throw profileError;
      if (!profileData) {
        setIsLoading(false);
        return;
      }

      setProfile(profileData);

      const { data: productsData, error: productsError } = await supabase
        .from("cards")
        .select("*")
        .eq("profile_id", profileData.id)
        .order("order_index");

      if (productsError) throw productsError;

      setProducts(productsData || []);
    } catch (error: any) {
      toast({
        title: "Error loading store",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile.name,
          text: profile.bio || `Check out ${profile.name}`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Share this link with your customers",
      });
    }
  };

  const handleWhatsApp = (product?: any) => {
    if (!profile.phone_number) {
      toast({
        title: "WhatsApp not configured",
        description: "Store owner hasn't added their WhatsApp number yet",
        variant: "destructive",
      });
      return;
    }

    const message = product
      ? `Hello, I want to order ${product.title}.`
      : `Hello, I'm interested in your products.`;

    const whatsappUrl = `https://wa.me/${profile.phone_number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading store...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Store not found</h1>
          <p className="text-muted-foreground">This store doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Onlink</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="rounded-full"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Store Profile */}
        <div className="text-center space-y-4 mb-12 animate-fade-in">
          <div className="w-24 h-24 bg-secondary rounded-full mx-auto flex items-center justify-center text-4xl overflow-hidden">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              "🛍️"
            )}
          </div>
          <div>
            <h2 className="text-3xl font-bold">{profile.name}</h2>
            {profile.bio && (
              <p className="text-muted-foreground mt-2">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products available yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="bg-card rounded-3xl overflow-hidden shadow-apple-lg border border-border cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedProduct(product)}
              >
                {product.image_url && (
                  <div className="w-full aspect-square overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{product.title}</h3>
                    {product.price && (
                      <p className="text-xl font-bold">{product.price}</p>
                    )}
                  </div>
                  {product.description && (
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <Button
                    className="w-full rounded-full bg-whatsapp hover:bg-whatsapp/90 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWhatsApp(product);
                    }}
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    DM to order on WhatsApp
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating WhatsApp Button */}
      {profile.phone_number && (
        <div className="fixed bottom-6 right-6">
          <Button
            size="lg"
            className="rounded-full shadow-apple-lg bg-whatsapp hover:bg-whatsapp/90 text-white h-14 w-14 p-0"
            onClick={() => handleWhatsApp()}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onWhatsApp={() => handleWhatsApp(selectedProduct)}
        />
      )}
    </div>
  );
};

export default Storefront;