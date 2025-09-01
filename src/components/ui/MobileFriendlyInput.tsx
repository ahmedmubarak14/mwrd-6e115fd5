import * as React from "react";
import { cn } from "@/lib/utils";

export interface MobileFriendlyInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  touchOptimized?: boolean;
}

const MobileFriendlyInput = React.forwardRef<HTMLInputElement, MobileFriendlyInputProps>(
  ({ className, type, touchOptimized = false, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          // Enhanced touch-friendly sizing
          touchOptimized ? "h-12 px-4 py-3 min-h-[48px]" : "h-10 px-3 py-2 min-h-[40px]",
          // Better tap targets for mobile
          "touch-manipulation",
          // Enhanced focus states for accessibility
          "focus:border-primary/50 focus:bg-background",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
MobileFriendlyInput.displayName = "MobileFriendlyInput";

export { MobileFriendlyInput };