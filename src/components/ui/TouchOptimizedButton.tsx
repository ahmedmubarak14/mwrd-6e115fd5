import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const touchButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80 active:scale-[0.98]",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80 active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70 active:scale-[0.98]",
        ghost: 
          "hover:bg-accent hover:text-accent-foreground active:bg-accent/80 active:scale-[0.98]",
        link: 
          "text-primary underline-offset-4 hover:underline active:text-primary/80"
      },
      size: {
        default: "h-11 px-4 py-2 min-h-[44px]", // WCAG 2.1 AA minimum touch target
        sm: "h-10 rounded-md px-3 min-h-[40px]", // Slightly smaller but still accessible
        lg: "h-12 rounded-md px-8 min-h-[48px]", // Larger for primary actions
        icon: "h-11 w-11 min-h-[44px] min-w-[44px]", // Square touch target
        touch: "h-12 px-6 py-3 min-h-[48px]", // Extra large for mobile
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface TouchOptimizedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof touchButtonVariants> {
  asChild?: boolean;
}

const TouchOptimizedButton = React.forwardRef<HTMLButtonElement, TouchOptimizedButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(touchButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
TouchOptimizedButton.displayName = "TouchOptimizedButton";

export { TouchOptimizedButton, touchButtonVariants };