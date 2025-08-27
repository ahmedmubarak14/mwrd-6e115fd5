import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary-hover",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        success:
          "border-transparent bg-success text-success-foreground hover:bg-success/90 shadow-sm",
        warning:
          "border-transparent bg-warning text-warning-foreground hover:bg-warning/90 shadow-sm",
        info:
          "border-transparent bg-info text-info-foreground hover:bg-info/90 shadow-sm",
        accent:
          "border-transparent bg-accent text-accent-foreground hover:bg-accent-hover shadow-sm",
        outline: 
          "border border-border text-foreground bg-background hover:bg-secondary hover:border-border-strong",
        ghost:
          "border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
        premium:
          "border-transparent bg-gradient-primary text-white shadow-sm hover:shadow-primary/30",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs", 
        lg: "px-3 py-1 text-sm"
      },
      rounded: {
        default: "rounded-full",
        sm: "rounded-md",
        lg: "rounded-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default"
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, rounded, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size, rounded }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
