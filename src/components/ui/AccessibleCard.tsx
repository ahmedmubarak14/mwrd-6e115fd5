import * as React from "react";
import { Card, CardProps } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface AccessibleCardProps extends CardProps {
  role?: string;
  tabIndex?: number;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

const AccessibleCard = React.forwardRef<HTMLDivElement, AccessibleCardProps>(
  ({ 
    className, 
    role, 
    tabIndex, 
    onKeyDown, 
    ariaLabel, 
    ariaDescribedBy, 
    interactive,
    onClick,
    children,
    ...props 
  }, ref) => {
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (interactive && onClick && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        onClick(event as any);
      }
      onKeyDown?.(event);
    };

    return (
      <Card
        ref={ref}
        className={cn(
          // Enhanced focus styles for accessibility
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          // Better keyboard navigation
          interactive && "cursor-pointer hover:bg-accent/50 transition-colors",
          className
        )}
        role={role}
        tabIndex={interactive ? (tabIndex ?? 0) : tabIndex}
        onKeyDown={handleKeyDown}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        interactive={interactive}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

AccessibleCard.displayName = "AccessibleCard";

export { AccessibleCard };