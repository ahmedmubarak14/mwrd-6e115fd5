import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import React from "react";

interface MobileSheetProps extends React.ComponentProps<typeof SheetContent> {
  children: React.ReactNode;
}

export const MobileSheet = ({ 
  children, 
  className,
  side,
  ...props 
}: MobileSheetProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  return (
    <SheetContent 
      side={side || (isRTL ? "right" : "left")} 
      className={cn(
        "w-80 p-0 flex flex-col mobile-slide-up",
        "safe-area-pt safe-area-pb",
        className
      )}
      {...props}
    >
      {children}
    </SheetContent>
  );
};