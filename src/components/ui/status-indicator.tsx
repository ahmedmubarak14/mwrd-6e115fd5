import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const statusIndicatorVariants = cva(
  "inline-flex items-center gap-2",
  {
    variants: {
      variant: {
        success: "text-success",
        warning: "text-warning",
        destructive: "text-destructive",
        info: "text-info",
        pending: "text-muted-foreground",
        processing: "text-primary",
      },
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base"
      }
    },
    defaultVariants: {
      variant: "success",
      size: "default"
    }
  }
)

const dotVariants = cva(
  "rounded-full flex-shrink-0",
  {
    variants: {
      variant: {
        success: "bg-success",
        warning: "bg-warning", 
        destructive: "bg-destructive",
        info: "bg-info",
        pending: "bg-muted-foreground",
        processing: "bg-primary animate-pulse",
      },
      size: {
        sm: "h-1.5 w-1.5",
        default: "h-2 w-2", 
        lg: "h-2.5 w-2.5"
      }
    },
    defaultVariants: {
      variant: "success",
      size: "default"
    }
  }
)

export interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusIndicatorVariants> {
  showDot?: boolean
}

const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  ({ className, variant, size, showDot = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(statusIndicatorVariants({ variant, size }), className)}
        {...props}
      >
        {showDot && (
          <div className={cn(dotVariants({ variant, size }))} />
        )}
        {children}
      </div>
    )
  }
)
StatusIndicator.displayName = "StatusIndicator"

// Predefined status components
const SuccessStatus = ({ children, ...props }: Omit<StatusIndicatorProps, 'variant'>) => (
  <StatusIndicator variant="success" {...props}>{children}</StatusIndicator>
)

const WarningStatus = ({ children, ...props }: Omit<StatusIndicatorProps, 'variant'>) => (
  <StatusIndicator variant="warning" {...props}>{children}</StatusIndicator>
)

const ErrorStatus = ({ children, ...props }: Omit<StatusIndicatorProps, 'variant'>) => (
  <StatusIndicator variant="destructive" {...props}>{children}</StatusIndicator>
)

const InfoStatus = ({ children, ...props }: Omit<StatusIndicatorProps, 'variant'>) => (
  <StatusIndicator variant="info" {...props}>{children}</StatusIndicator>
)

const PendingStatus = ({ children, ...props }: Omit<StatusIndicatorProps, 'variant'>) => (
  <StatusIndicator variant="pending" {...props}>{children}</StatusIndicator>
)

const ProcessingStatus = ({ children, ...props }: Omit<StatusIndicatorProps, 'variant'>) => (
  <StatusIndicator variant="processing" {...props}>{children}</StatusIndicator>
)

export { 
  StatusIndicator,
  SuccessStatus,
  WarningStatus, 
  ErrorStatus,
  InfoStatus,
  PendingStatus,
  ProcessingStatus,
  statusIndicatorVariants 
}