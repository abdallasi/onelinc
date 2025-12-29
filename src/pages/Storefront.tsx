import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Share2, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProductModal from "@/components/ProductModal";
import ProductCard from "@/components/ProductCard";

// SEO helper to update document head
const updateDocumentHead = (profile: { name: string; bio?: string; avatar_url?: string } | null, slug: string) => {
  if (!profile) return;
  
  const title = `${profile.name} — Products on Onelinc`;
  const description = profile.bio 
    ? `${profile.bio.substring(0, 120)}${profile.bio.length > 120 ? '...' : ''} Browse products from ${profile.name}. Message to buy instantly.`
    : `Browse products from ${profile.name}. Message to buy instantly on Onelinc.`;
  const canonicalUrl = `https://onelinc.com/shop/${slug}`;
  const ogImage = profile.avatar_url || 'https://onelinc.com/og-image.png';

  // Update title
  document.title = title;

  // Update or create meta tags
  const updateMeta = (selector: string, attribute: string, content: string) => {
    let element = document.querySelector(selector) as HTMLMetaElement;
    if (!element) {
      element = document.createElement('meta');
      if (selector.includes('property=')) {
        element.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] || '');
      } else if (selector.includes('name=')) {
        element.setAttribute('name', selector.match(/name="([^"]+)"/)?.[1] || '');
      }
      document.head.appendChild(element);
    }
    element.setAttribute(attribute, content);
  };

  // Update canonical link
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl;

  // Meta description
  updateMeta('meta[name="description"]', 'content', description);

  // Open Graph
  updateMeta('meta[property="og:title"]', 'content', title);
  updateMeta('meta[property="og:description"]', 'content', description);
  updateMeta('meta[property="og:url"]', 'content', canonicalUrl);
  updateMeta('meta[property="og:image"]', 'content', ogImage);
  updateMeta('meta[property="og:type"]', 'content', 'website');

  // Twitter
  updateMeta('meta[name="twitter:title"]', 'content', title);
  updateMeta('meta[name="twitter:description"]', 'content', description);
  updateMeta('meta[name="twitter:image"]', 'content', ogImage);
};

const Storefront = () => {
  const { slug } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [viewCount, setViewCount] = useState(0);
  const [showBanner, setShowBanner] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchStore(slug);
      incrementViewCount();
    }
  }, [slug]);

  // Update SEO when profile loads
  useEffect(() => {
    if (profile && slug) {
      updateDocumentHead(profile, slug);
    }
    
    // Cleanup: restore default meta on unmount
    return () => {
      document.title = 'Onelinc — Show What You Sell | Create Your Online Store';
    };
  }, [profile, slug]);

  const incrementViewCount = () => {
    // Generate daily view count (simulated for now, can be replaced with real backend tracking)
    const today = new Date().toDateString();
    const storageKey = `views_${slug}_${today}`;
    const currentViews = parseInt(localStorage.getItem(storageKey) || "0");
    const newViews = currentViews + 1;
    localStorage.setItem(storageKey, newViews.toString());
    setViewCount(newViews + Math.floor(Math.random() * 50)); // Add some base views for demo
  };

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

  const handleProductSelect = (product: any) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.some((p) => p.id === product.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleMultipleWhatsApp = () => {
    if (!profile.phone_number) {
      toast({
        title: "WhatsApp not configured",
        description: "Store owner hasn't added their WhatsApp number yet",
        variant: "destructive",
      });
      return;
    }

    const productList = selectedProducts.map((p) => `• ${p.title}`).join('\n');
    const message = `Hello, I want to order the following products:\n\n${productList}`;

    const whatsappUrl = `https://wa.me/${profile.phone_number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setSelectedProducts([]);
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
          <button 
            onClick={() => window.location.href = '/'}
            className="text-lg font-semibold hover:opacity-70 transition-opacity"
          >
            onelinc
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.href = '/'}
              className="text-sm font-medium text-primary hover:opacity-70 transition-opacity"
            >
              Build your store
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="rounded-full"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>


      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Store Profile with View Counter */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                  onWhatsApp={handleWhatsApp}
                  onSelect={handleProductSelect}
                  isSelected={selectedProducts.some((p) => p.id === product.id)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Multi-Select WhatsApp Button */}
      {selectedProducts.length > 0 && profile.phone_number && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 animate-scale-in">
          <Button
            size="lg"
            className="rounded-full shadow-apple-lg bg-foreground hover:bg-foreground/90 text-background px-8 h-14 font-medium"
            onClick={handleMultipleWhatsApp}
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            DM on WhatsApp ({selectedProducts.length})
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