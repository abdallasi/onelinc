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
      style={{ height: '110%' }}
    >
      {/* Hero Image */}
      <div className="relative w-full h-full bg-secondary">
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
        
        {/* Apple-style Select Button - Top Right */}
        {onSelect && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-apple transition-all ${
              isSelected 
                ? "bg-primary border-2 border-primary" 
                : "bg-background/90 backdrop-blur-sm border-2 border-border hover:border-primary"
            }`}
          >
            {isSelected && <Check className="h-4 w-4 text-primary-foreground" />}
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
        <div className="bg-background/60 backdrop-blur-xl rounded-full px-5 py-3 shadow-apple border border-border/30 flex items-center justify-between">
          <div className="flex-1 min-w-0 mr-3">
            <p className="text-xs font-normal text-muted-foreground truncate">{product.title}</p>
            {product.price && (
              <h3 className="text-base font-semibold text-foreground">{product.price}</h3>
            )}
          </div>
          
          {/* WhatsApp Text Button */}
          {onWhatsApp && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWhatsApp(product);
              }}
              className="px-4 py-2 rounded-full bg-foreground hover:bg-foreground/90 text-background text-xs font-medium flex-shrink-0 transition-all hover:scale-105 shadow-apple"
            >
              dm on whatsapp
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;