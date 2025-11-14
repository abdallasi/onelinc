import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, MessageCircle } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductModalProps {
  product: any;
  onClose: () => void;
  onWhatsApp: () => void;
}

const ProductModal = ({ product, onClose, onWhatsApp }: ProductModalProps) => {
  const images = product.image_urls || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-slide-up shadow-apple-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4 flex justify-between items-center">
          <h3 className="font-semibold text-lg">Product Details</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {images.length > 0 && (
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((image: string, index: number) => (
                    <CarouselItem key={index}>
                      <div className="w-full aspect-square rounded-2xl overflow-hidden bg-secondary">
                        <img
                          src={image}
                          alt={`${product.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </>
                )}
              </Carousel>
              {images.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {images.map((_: any, index: number) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === currentIndex 
                          ? "w-6 bg-primary" 
                          : "w-2 bg-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold">{product.title}</h2>
              {product.price && (
                <p className="text-2xl font-bold">{product.price}</p>
              )}
            </div>

            {product.description && (
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            <Button
              size="lg"
              className="w-full py-6 rounded-full bg-whatsapp hover:bg-whatsapp/90 text-white shadow-apple"
              onClick={onWhatsApp}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              DM on WhatsApp to order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;