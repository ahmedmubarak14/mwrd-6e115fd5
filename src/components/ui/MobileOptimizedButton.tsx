import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface MobileOptimizedButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
  fullWidthOnMobile?: boolean;
  touchOptimized?: boolean;
}

export const MobileOptimizedButton = ({ 
  children, 
  className, 
  fullWidthOnMobile = false,
  touchOptimized = true,
  size = "default",
  ...props 
}: MobileOptimizedButtonProps) => {
  return (
    <Button 
      className={cn(
        touchOptimized && "active:scale-95 mobile-touch-target",
        fullWidthOnMobile && "w-full sm:w-auto",
        "transition-all duration-200",
        "text-sm sm:text-base", // Responsive text size
        "px-4 py-2 sm:px-6 sm:py-3", // Progressive padding
        className
      )}
      size={size}
      {...props}
    >
      {children}
    </Button>
  );
};