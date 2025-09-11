import React from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'dots' | 'pulse' | 'fade';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  overlay?: boolean;
}

// Enhanced loading component with multiple variants
export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'spinner',
  size = 'md',
  text,
  className,
  overlay = false
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const spinnerSizes = {
    sm: 'sm' as const,
    md: 'default' as const,
    lg: 'lg' as const
  };

  const content = (() => {
    switch (type) {
      case 'dots':
        return (
          <div className="flex items-center gap-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            </div>
            {text && (
              <span className={cn("text-muted-foreground animate-pulse", sizeClasses[size])}>
                {text}
              </span>
            )}
          </div>
        );
        
      case 'pulse':
        return (
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
            {text && (
              <span className={cn("text-muted-foreground animate-pulse", sizeClasses[size])}>
                {text}
              </span>
            )}
          </div>
        );
        
      case 'fade':
        return (
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 border-2 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-2 border-transparent border-t-primary rounded-full animate-[fade_1.5s_ease-in-out_infinite]"></div>
            </div>
            {text && (
              <span className={cn("text-muted-foreground", sizeClasses[size])}>
                {text}
              </span>
            )}
          </div>
        );
        
      case 'skeleton':
        return (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        );
        
      default: // spinner
        return (
          <LoadingSpinner 
            size={spinnerSizes[size]} 
            label={text}
            className="justify-center"
          />
        );
    }
  })();

  if (overlay) {
    return (
      <div className={cn(
        "absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center",
        className
      )}>
        {content}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      {content}
    </div>
  );
};

// Page-level loading wrapper
export const PageLoading: React.FC<{
  children?: React.ReactNode;
  text?: string;
  className?: string;
}> = ({ children, text = "Loading...", className }) => (
  <div className={cn("min-h-[400px] flex items-center justify-center", className)}>
    {children || <LoadingState type="spinner" size="lg" text={text} />}
  </div>
);

// Inline loading for components
export const InlineLoading: React.FC<{
  text?: string;
  size?: 'sm' | 'md';
  className?: string;
}> = ({ text, size = 'sm', className }) => (
  <div className={cn("flex items-center gap-2", className)}>
    <LoadingSpinner size={size === 'sm' ? 'xs' : 'sm'} />
    {text && (
      <span className={cn(
        "text-muted-foreground",
        size === 'sm' ? 'text-xs' : 'text-sm'
      )}>
        {text}
      </span>
    )}
  </div>
);

// Button loading state
export const ButtonLoading: React.FC<{
  text?: string;
  className?: string;
}> = ({ text = "Loading...", className }) => (
  <div className={cn("flex items-center gap-2", className)}>
    <LoadingSpinner size="xs" />
    <span>{text}</span>
  </div>
);

// Form loading overlay
export const FormLoading: React.FC<{
  text?: string;
  className?: string;
}> = ({ text = "Saving...", className }) => (
  <div className={cn(
    "absolute inset-0 bg-background/90 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg",
    className
  )}>
    <Card className="p-4 shadow-lg">
      <CardContent className="p-0">
        <LoadingState type="spinner" text={text} />
      </CardContent>
    </Card>
  </div>
);

// Data loading placeholder
export const DataLoading: React.FC<{
  rows?: number;
  className?: string;
}> = ({ rows = 3, className }) => (
  <div className={cn("space-y-3", className)}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="h-4 bg-muted rounded w-full"></div>
      </div>
    ))}
  </div>
);

// Chart loading placeholder
export const ChartLoading: React.FC<{
  height?: string;
  className?: string;
}> = ({ height = "h-64", className }) => (
  <div className={cn("relative", height, className)}>
    <div className="absolute inset-0 bg-muted/30 rounded-lg animate-pulse flex items-center justify-center">
      <LoadingState type="dots" text="Loading chart data..." />
    </div>
  </div>
);