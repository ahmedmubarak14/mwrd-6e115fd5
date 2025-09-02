import { Sheet, SheetContent } from "@/components/ui/sheet";
import { VendorSidebar } from "./VendorSidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface VendorMobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VendorMobileSidebar = ({ 
  isOpen, 
  onOpenChange
}: VendorMobileSidebarProps) => {
  const { isRTL } = useLanguage();

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent 
          side={isRTL ? "right" : "left"}
          className={cn(
            "w-[75vw] max-w-xs p-0 bg-background overflow-hidden",
            "safe-area-inset-y",
            isRTL ? "border-l-2" : "border-r-2"
          )}
        >
          <VendorSidebar 
            onItemClick={() => onOpenChange(false)} 
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};