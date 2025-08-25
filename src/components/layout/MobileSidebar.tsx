
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface MobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MobileSidebar = ({ isOpen, onOpenChange }: MobileSidebarProps) => {
  const { userProfile } = useAuth();
  const { isRTL } = useLanguage();

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent 
          side={isRTL ? "right" : "left"}
          className={cn(
            "w-[90vw] max-w-sm p-0 bg-unified-page safe-area-pt safe-area-pb",
            "animate-slide-in-right"
          )}
        >
          <Sidebar 
            userRole={userProfile?.role as 'client' | 'vendor' | 'admin'}
            userProfile={userProfile}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};
