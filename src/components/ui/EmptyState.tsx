import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
  children
}) => {
  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        {Icon && (
          <Icon className="h-16 w-16 text-muted-foreground/50 mb-4" />
        )}
        
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>
        
        {description && (
          <p className="text-muted-foreground mb-6 max-w-md">
            {description}
          </p>
        )}

        {action && (
          <Button onClick={action.onClick} className="mb-4">
            {action.label}
          </Button>
        )}

        {children}
      </CardContent>
    </Card>
  );
};