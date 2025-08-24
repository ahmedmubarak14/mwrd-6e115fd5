
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

interface MobileFriendlyCardProps extends React.ComponentProps<typeof Card> {
  children: React.ReactNode;
  touchOptimized?: boolean;
}

export const MobileFriendlyCard = ({ 
  children, 
  className, 
  touchOptimized = false,
  ...props 
}: MobileFriendlyCardProps) => {
  return (
    <Card 
      className={cn(
        "transition-all duration-200",
        touchOptimized && "active:scale-[0.98] hover:scale-[1.02] cursor-pointer",
        "p-4 sm:p-6 lg:p-8",
        "rounded-xl sm:rounded-2xl",
        "bg-card/70 backdrop-blur-sm shadow-sm",
        "hover:shadow-xl hover:bg-card/80",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
};
