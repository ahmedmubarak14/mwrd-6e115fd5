import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"

const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center",
  {
    variants: {
      size: {
        sm: "py-8 px-4",
        default: "py-12 px-6",
        lg: "py-16 px-8"
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
)

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline"
  }
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ 
    className, 
    size, 
    icon: Icon, 
    title, 
    description, 
    action,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(emptyStateVariants({ size }), className)}
        {...props}
      >
        {Icon && (
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {title}
        </h3>
        
        {description && (
          <p className="mb-4 text-sm text-muted-foreground max-w-sm">
            {description}
          </p>
        )}
        
        {action && (
          <Button 
            onClick={action.onClick}
            variant={action.variant || "default"}
            size="sm"
          >
            {action.label}
          </Button>
        )}
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"

export { EmptyState, emptyStateVariants }