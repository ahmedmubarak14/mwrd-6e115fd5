
import { cn } from "@/lib/utils";
import React from "react";

interface MobileContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  withBottomPadding?: boolean;
  pageType?: 'landing' | 'dashboard' | 'auth' | 'default';
}

export const MobileContainer = ({ 
  children, 
  className,
  withBottomPadding = true,
  pageType = 'default',
  ...props 
}: MobileContainerProps) => {
  const getBackgroundClass = () => {
    switch (pageType) {
      case 'landing':
        return 'bg-landing';
      case 'dashboard':
        return 'bg-dashboard';
      case 'auth':
        return 'bg-auth';
      default:
        return 'bg-unified-page';
    }
  };

  return (
    <div 
      className={cn(
        "min-h-screen w-full h-full",
        getBackgroundClass(),
        withBottomPadding && "pb-20 md:pb-0",
        "safe-area-pt safe-area-pb",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
