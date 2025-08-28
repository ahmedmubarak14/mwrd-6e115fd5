
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-ring-offset transition-all duration-200 focus-visible:outline-2 focus-visible:outline-focus-outline focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 rtl-transition active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: 
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover hover:shadow-md active:bg-primary-active focus-visible:ring-focus-ring/30 disabled:bg-button-disabled disabled:text-button-disabled-foreground disabled:border-button-disabled-border disabled:shadow-none",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-error-hover hover:shadow-danger/50 active:bg-error-active focus-visible:ring-error/30 disabled:bg-button-disabled disabled:text-button-disabled-foreground disabled:border-button-disabled-border disabled:shadow-none",
        outline:
          "border border-border bg-background text-foreground shadow-sm hover:bg-outline-hover hover:border-border-strong active:bg-outline-active focus-visible:ring-focus-ring/30 disabled:bg-button-disabled disabled:text-button-disabled-foreground disabled:border-button-disabled-border disabled:shadow-none",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary-hover active:bg-secondary-active focus-visible:ring-focus-ring/30 disabled:bg-button-disabled disabled:text-button-disabled-foreground disabled:border-button-disabled-border disabled:shadow-none",
        ghost: 
          "text-foreground hover:bg-secondary hover:text-foreground active:bg-secondary-active focus-visible:ring-focus-ring/30 disabled:bg-transparent disabled:text-button-disabled-foreground",
        link: 
          "text-primary underline-offset-4 hover:underline hover:text-primary-hover active:text-primary-active focus-visible:ring-focus-ring/30 disabled:text-button-disabled-foreground disabled:no-underline",
        success:
          "bg-success text-success-foreground shadow-sm hover:bg-success-hover hover:shadow-success/50 active:bg-success-active focus-visible:ring-success/30 disabled:bg-button-disabled disabled:text-button-disabled-foreground disabled:border-button-disabled-border disabled:shadow-none",
        warning:
          "bg-warning text-warning-foreground shadow-sm hover:bg-warning-hover hover:shadow-warning/50 active:bg-warning-active focus-visible:ring-warning/30 disabled:bg-warning-disabled disabled:text-warning-disabled-foreground disabled:shadow-none",
        info:
          "bg-info text-info-foreground shadow-sm hover:bg-info-hover hover:shadow-info/50 active:bg-info-active focus-visible:ring-info/30 disabled:bg-info-disabled disabled:text-info-disabled-foreground disabled:shadow-none",
        accent:
          "bg-accent text-accent-foreground shadow-sm hover:bg-accent-hover hover:shadow-accent/50 active:bg-accent-active focus-visible:ring-focus-ring/30 disabled:bg-button-disabled disabled:text-button-disabled-foreground disabled:border-button-disabled-border disabled:shadow-none",
        premium:
          "bg-gradient-primary text-primary-foreground shadow-primary hover:shadow-primary hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-primary/30 disabled:bg-button-disabled disabled:text-button-disabled-foreground disabled:shadow-none",
        glass:
          "bg-glass text-foreground border border-glass-border backdrop-blur-sm hover:bg-glass-strong active:bg-glass/80 focus-visible:ring-focus-ring/30 disabled:bg-button-disabled disabled:text-button-disabled-foreground disabled:border-button-disabled-border disabled:backdrop-blur-none"
      },
      size: {
        xs: "h-7 px-2 text-xs rounded",
        sm: "h-8 px-3 text-sm rounded-md",
        default: "h-10 px-4 text-sm rounded-md",
        lg: "h-11 px-6 text-base rounded-md",
        xl: "h-12 px-8 text-lg rounded-lg", 
        icon: "h-10 w-10 rounded-md",
        "icon-sm": "h-8 w-8 rounded-md",
        "icon-lg": "h-11 w-11 rounded-md",
      },
      loading: {
        true: "cursor-wait",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false, 
    loadingText,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, loading, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg 
            className="mr-2 h-4 w-4 animate-spin" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {loading ? (loadingText || children) : children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
