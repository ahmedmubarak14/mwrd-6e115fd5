import { Sheet, SheetContent } from "@/components/ui/sheet";
import { VendorSidebar } from "./VendorSidebar";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { cn } from "@/lib/utils";

interface VendorMobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VendorMobileSidebar = ({ 
  isOpen, 
  onOpenChange
}: VendorMobileSidebarProps) => {
  const languageContext = useOptionalLanguage();
  const { isRTL } = languageContext || { isRTL: false };

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
          <VendorSidebar 
            onItemClick={() => onOpenChange(false)} 
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};