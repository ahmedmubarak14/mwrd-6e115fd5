import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ProductionLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

export const ProductionLoadingSpinner = ({ 
  size = 'md', 
  text,
  className,
  fullScreen = false
}: ProductionLoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className={cn(
          "flex flex-col items-center justify-center gap-3 p-6",
          className
        )}>
          <Loader2 className={cn(
            "animate-spin text-primary",
            sizeClasses[size]
          )} />
          {text && (
            <p className="text-sm text-muted-foreground animate-pulse">
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-3 p-6",
      className
    )}>
      <Loader2 className={cn(
        "animate-spin text-primary",
        sizeClasses[size]
      )} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};