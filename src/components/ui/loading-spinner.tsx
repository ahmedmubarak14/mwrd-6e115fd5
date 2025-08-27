import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const spinnerVariants = cva(
  "animate-spin rounded-full border-2 border-current border-t-transparent",
  {
    variants: {
      size: {
        xs: "h-3 w-3",
        sm: "h-4 w-4", 
        default: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
      },
      variant: {
        default: "text-primary",
        secondary: "text-muted-foreground",
        destructive: "text-destructive",
        success: "text-success",
        warning: "text-warning",
        accent: "text-accent",
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default"
    },
  }
)

export interface LoadingSpinnerProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string
  text?: string // Keep for backwards compatibility
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size, variant, label, text, ...props }, ref) => {
    const displayText = label || text; // Use label first, fallback to text for compatibility
    
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center gap-2", className)}
        {...props}
      >
        <div 
          className={cn(spinnerVariants({ size, variant }))}
          aria-label={displayText || "Loading"}
        />
        {displayText && (
          <span className="text-sm text-muted-foreground animate-pulse">
            {displayText}
          </span>
        )}
      </div>
    )
  }
)
LoadingSpinner.displayName = "LoadingSpinner"

export { LoadingSpinner, spinnerVariants }