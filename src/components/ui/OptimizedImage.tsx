import React, { useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc = '/placeholder.svg',
  loading = 'lazy',
  className,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    
    // Try fallback if not already using it
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    
    onError?.();
  }, [currentSrc, fallbackSrc, onError]);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    setCurrentSrc(src);
  }, [src]);

  if (hasError && currentSrc === fallbackSrc) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground text-sm",
          "border border-border rounded",
          className
        )}
        onClick={handleRetry}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleRetry()}
      >
        <div className="text-center p-4">
          <p className="mb-2">Failed to load image</p>
          <button 
            className="text-xs underline hover:no-underline"
            onClick={handleRetry}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-muted",
          "border border-border rounded animate-pulse"
        )}>
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoading && "opacity-0",
          !isLoading && "opacity-100",
          className
        )}
        {...props}
      />
    </div>
  );
};