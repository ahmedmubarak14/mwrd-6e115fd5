
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AdminMobileSidebarContent } from "./AdminMobileSidebarContent";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface AdminMobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdminMobileSidebar = ({ isOpen, onOpenChange }: AdminMobileSidebarProps) => {
  const languageContext = useLanguage();
  const { isRTL } = languageContext || { 
    isRTL: false 
  };

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent 
          side={isRTL ? "right" : "left"}
          className={cn(
            "w-[75vw] max-w-xs p-0 bg-background border-r-2 overflow-hidden",
            "safe-area-inset-y"
          )}
        >
          <AdminMobileSidebarContent onItemClick={() => onOpenChange(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
};
