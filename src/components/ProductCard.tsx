import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface ProductCardProps {
  product: any;
  onEdit: (product: any) => void;
  onDelete: (productId: string) => void;
}

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  const images = product.image_urls || [];
  const hasMultipleImages = images.length > 1;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-apple hover:shadow-apple-lg transition-all">
      <div className="flex gap-4 p-4">
        {images.length > 0 && (
          <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
            <img
              src={images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {hasMultipleImages && (
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                +{images.length - 1}
              </div>
            )}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{product.title}</h3>
          {product.price && (
            <p className="text-muted-foreground font-medium">{product.price}</p>
          )}
          {product.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(product)}
            className="rounded-full h-9 w-9"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (confirm("Delete this product?")) {
                onDelete(product.id);
              }
            }}
            className="rounded-full h-9 w-9 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;