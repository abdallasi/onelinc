import { Button } from "@/components/ui/button";
import { Edit, Trash2, Check, MessageCircle } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: any;
  onEdit?: (product: any) => void;
  onDelete?: (productId: string) => void;
  onSelect?: (product: any) => void;
  onWhatsApp?: (product: any) => void;
  isSelected?: boolean;
  showActions?: boolean;
  onClick?: () => void;
}

const ProductCard = ({ 
  product, 
  onEdit, 
  onDelete, 
  onSelect,
  onWhatsApp,
  isSelected = false,
  showActions = false,
  onClick
}: ProductCardProps) => {
  const images = product.image_urls || [];
  const hasImage = images.length > 0;

  return (
    <div 
      className="relative bg-card rounded-3xl overflow-hidden shadow-apple hover:shadow-apple-lg transition-all cursor-pointer group"
      onClick={onClick}
    >
      {/* Hero Image */}
      <div className="relative w-full aspect-square bg-secondary">
        {hasImage ? (
          <img
            src={images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            📦
          </div>
        )}
        
        {/* Select Button - Top Right */}
        {onSelect && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
              isSelected 
                ? "bg-primary text-primary-foreground scale-110" 
                : "bg-background/95 backdrop-blur-sm text-foreground hover:scale-110"
            }`}
          >
            {isSelected ? <Check className="h-5 w-5" /> : <span className="text-sm font-medium">+</span>}
          </button>
        )}

        {/* Edit/Delete Actions - Show on Dashboard only */}
        {showActions && (
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(product);
              }}
              className="rounded-full h-9 w-9 bg-background/95 backdrop-blur-sm hover:bg-background"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Delete this product?")) {
                  onDelete?.(product.id);
                }
              }}
              className="rounded-full h-9 w-9 bg-background/95 backdrop-blur-sm hover:bg-background text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Floating Bottom Bar - Apple Glass Effect */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-background/95 backdrop-blur-xl rounded-full px-5 py-3 shadow-lg border border-border/50 flex items-center justify-between">
          <div className="flex-1 min-w-0 mr-3">
            <h3 className="font-semibold text-base truncate">{product.title}</h3>
            {product.price && (
              <p className="text-sm font-medium text-muted-foreground">{product.price}</p>
            )}
          </div>
          
          {/* WhatsApp Icon */}
          {onWhatsApp && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWhatsApp(product);
              }}
              className="w-10 h-10 rounded-full bg-whatsapp hover:bg-whatsapp/90 flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 shadow-md"
            >
              <MessageCircle className="h-5 w-5 text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;