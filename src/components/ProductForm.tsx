import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, ImagePlus, Trash2 } from "lucide-react";
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(product?.image_urls || []);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const totalImages = imagePreviews.length + files.length;
    if (totalImages > 5) {
      toast({
        title: "Maximum 5 images allowed",
        variant: "destructive",
      });
      return;
    }

    setImageFiles([...imageFiles, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) return product?.image_urls || [];

    const uploadPromises = imageFiles.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${profile.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('card-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('card-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    });

    const newUrls = await Promise.all(uploadPromises);
    const existingUrls = product?.image_urls || [];
    
    return [...existingUrls.slice(0, imagePreviews.length - imageFiles.length), ...newUrls];
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
      const imageUrls = await uploadImages();

      if (product) {
        const { error } = await supabase
          .from("cards")
          .update({
            title,
            price,
            description,
            image_urls: imageUrls,
            cta_type: "link",
          })
          .eq("id", product.id);

        if (error) throw error;

        toast({
          title: "Product updated!",
        });
      } else {
        const { error } = await supabase
          .from("cards")
          .insert({
            profile_id: profile.id,
            title,
            price,
            description,
            image_urls: imageUrls,
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
            <label className="text-sm font-medium">Product Images (up to 5)</label>
            <div className="grid grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-secondary">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={() => removeImage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {imagePreviews.length < 5 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                </label>
              )}
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