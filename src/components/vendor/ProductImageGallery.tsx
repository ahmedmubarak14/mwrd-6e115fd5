import { useState } from 'react';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { VendorProduct } from '@/hooks/useVendorProducts';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  product?: VendorProduct;
}

export const ProductImageGallery = ({ product }: ProductImageGalleryProps) => {
  const { isRTL } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product || !product.images || product.images.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Camera className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No images available for this product</p>
        </CardContent>
      </Card>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative">
        <img
          src={product.images[currentImageIndex]}
          alt={`${product.name} - Image ${currentImageIndex + 1}`}
          className="w-full h-96 object-contain bg-muted rounded-lg"
        />
        
        {product.images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "absolute top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm",
                isRTL ? "right-2" : "left-2"
              )}
              onClick={prevImage}
            >
              {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "absolute top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm",
                isRTL ? "left-2" : "right-2"
              )}
              onClick={nextImage}
            >
              {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </>
        )}
        
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-sm text-muted-foreground">
              {currentImageIndex + 1} / {product.images.length}
            </span>
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      {product.images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                "aspect-square rounded-lg border-2 overflow-hidden transition-all hover:border-primary",
                currentImageIndex === index ? "border-primary" : "border-muted"
              )}
            >
              <img
                src={image}
                alt={`${product.name} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{product.name}</h3>
        {product.description && (
          <p className="text-muted-foreground">{product.description}</p>
        )}
        <div className={cn("flex gap-4 text-sm", isRTL && "flex-row-reverse")}>
          <span><strong>Category:</strong> {product.category}</span>
          <span><strong>Price:</strong> {product.price} {product.currency}</span>
          <span><strong>Stock:</strong> {product.stock_quantity}</span>
        </div>
      </div>
    </div>
  );
};