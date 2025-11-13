import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProductFormProps {
  profile: any;
  product?: any;
  onClose: () => void;
  onSave: () => void;
}

const ProductForm = ({ profile, product, onClose, onSave }: ProductFormProps) => {
  const [title, setTitle] = useState(product?.title || "");
  const [price, setPrice] = useState(product?.price || "");
  const [description, setDescription] = useState(product?.description || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(product?.image_url || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return product?.image_url || null;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${profile.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('card-images')
      .upload(filePath, imageFile);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('card-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({
        title: "Please add a product name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const imageUrl = await uploadImage();

      if (product) {
        // Update existing product
        const { error } = await supabase
          .from("cards")
          .update({
            title,
            price,
            description,
            image_url: imageUrl,
            cta_type: "link",
          })
          .eq("id", product.id);

        if (error) throw error;

        toast({
          title: "Product updated!",
        });
      } else {
        // Create new product
        const { error } = await supabase
          .from("cards")
          .insert({
            profile_id: profile.id,
            title,
            price,
            description,
            image_url: imageUrl,
            cta_type: "link",
            order_index: 0,
          });

        if (error) throw error;

        toast({
          title: "Product added!",
        });
      }

      onSave();
    } catch (error: any) {
      toast({
        title: "Error saving product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {product ? "Edit Product" : "Add Product"}
          </h1>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Name *</label>
            <Input
              placeholder="Amazing Product"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="py-5 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Price</label>
            <Input
              placeholder="₦5,000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="py-5 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Tell customers about this product..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Product Image</label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground">Tap to change image</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-4xl">📸</div>
                    <p className="text-sm font-medium">Tap to upload image</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              size="lg"
              className="flex-1 py-6 rounded-full shadow-apple"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Product"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductForm;