import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

interface StandardizedButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  touchOptimized?: boolean;
  fullWidthOnMobile?: boolean;
}

export const StandardizedButton = forwardRef<HTMLButtonElement, StandardizedButtonProps>(
  ({ 
    loading = false, 
    loadingText, 
    touchOptimized = true,
    fullWidthOnMobile = false,
    children, 
    disabled, 
    className,
    ...props 
  }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Touch optimization
          touchOptimized && "min-h-[44px] px-4 py-2 active:scale-95",
          // Mobile responsive
          fullWidthOnMobile && "w-full sm:w-auto",
          // Performance optimizations
          "transition-all duration-200 transform-gpu",
          // Loading state
          loading && "cursor-not-allowed",
          className
        )}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText || "Loading..."}
          </div>
        ) : (
          children
        )}
      </Button>
    );
  }
);

StandardizedButton.displayName = "StandardizedButton";