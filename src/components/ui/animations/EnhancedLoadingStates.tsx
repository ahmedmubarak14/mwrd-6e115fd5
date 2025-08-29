import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  animation?: 'pulse' | 'wave' | 'shimmer';
}

export const SkeletonLoader = ({
  className,
  count = 1,
  variant = 'rectangular',
  animation = 'shimmer'
}: SkeletonLoaderProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 w-full rounded';
      case 'circular':
        return 'h-12 w-12 rounded-full';
      case 'rectangular':
        return 'h-32 w-full rounded-lg';
      case 'card':
        return 'h-64 w-full rounded-xl';
      default:
        return 'h-4 w-full rounded';
    }
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse';
      case 'wave':
        return 'animate-pulse-glow';
      case 'shimmer':
        return 'shimmer';
      default:
        return 'animate-pulse';
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            getVariantClasses(),
            getAnimationClasses(),
            "bg-muted"
          )}
        />
      ))}
    </div>
  );
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'bars' | 'pulse';
  className?: string;
}

export const EnhancedLoadingSpinner = ({
  size = 'md',
  variant = 'spinner',
  className
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  if (variant === 'spinner') {
    return (
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-muted border-t-primary",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "bg-primary rounded-full animate-bounce",
              size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
            )}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '0.6s'
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "bg-primary animate-pulse",
              size === 'sm' ? 'w-1 h-4' : size === 'md' ? 'w-1.5 h-6' : 'w-2 h-8'
            )}
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: '1.2s'
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div
        className={cn(
          "bg-primary rounded-full animate-pulse-glow",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return null;
};

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

export const ProgressiveImage = ({
  src,
  alt,
  className,
  placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiIvPgo8L3N2Zz4="
}: ProgressiveImageProps) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Placeholder/Loading state */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted animate-shimmer">
          <EnhancedLoadingSpinner size="md" variant="spinner" />
        </div>
      )}
      
      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <span className="text-sm">Failed to load image</span>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
      />
      
      {/* Blur placeholder while loading */}
      {!isLoaded && !isError && (
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
        />
      )}
    </div>
  );
};

interface ContentLoaderProps {
  rows?: number;
  className?: string;
  variant?: 'article' | 'card' | 'list' | 'profile';
}

export const ContentLoader = ({
  rows = 3,
  className,
  variant = 'article'
}: ContentLoaderProps) => {
  if (variant === 'article') {
    return (
      <div className={cn("space-y-4", className)}>
        <SkeletonLoader variant="text" className="w-3/4 h-8" />
        <SkeletonLoader variant="text" className="w-1/2 h-4" />
        <SkeletonLoader variant="rectangular" className="h-48" />
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonLoader key={i} variant="text" />
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn("space-y-4 p-4 border rounded-lg", className)}>
        <div className="flex items-center space-x-4">
          <SkeletonLoader variant="circular" />
          <div className="flex-1">
            <SkeletonLoader variant="text" className="w-3/4" />
            <SkeletonLoader variant="text" className="w-1/2 h-3 mt-2" />
          </div>
        </div>
        <SkeletonLoader variant="rectangular" className="h-32" />
        <SkeletonLoader variant="text" className="w-full" />
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <SkeletonLoader variant="circular" className="w-8 h-8" />
            <div className="flex-1 space-y-1">
              <SkeletonLoader variant="text" className="w-3/4 h-4" />
              <SkeletonLoader variant="text" className="w-1/2 h-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'profile') {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex flex-col items-center space-y-4">
          <SkeletonLoader variant="circular" className="w-24 h-24" />
          <div className="text-center space-y-2">
            <SkeletonLoader variant="text" className="w-32 h-6" />
            <SkeletonLoader variant="text" className="w-24 h-4" />
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <SkeletonLoader variant="text" className="w-20 h-4" />
              <SkeletonLoader variant="text" className="w-32 h-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};