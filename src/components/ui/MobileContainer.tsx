import { cn } from "@/lib/utils";
import React from "react";

interface MobileContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  withBottomPadding?: boolean;
}

export const MobileContainer = ({ 
  children, 
  className,
  withBottomPadding = true,
  ...props 
}: MobileContainerProps) => {
  return (
    <div 
      className={cn(
        "min-h-screen bg-background",
        withBottomPadding && "pb-20 md:pb-0", // Add padding for mobile bottom tabs
        "safe-area-pt safe-area-pb",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};