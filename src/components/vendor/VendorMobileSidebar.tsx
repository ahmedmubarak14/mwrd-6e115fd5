import { Sheet, SheetContent } from "@/components/ui/sheet";
import { VendorSidebar } from "./VendorSidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface VendorMobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  collapsed?: boolean;
  onToggle?: () => void;
}

export const VendorMobileSidebar = ({ 
  isOpen, 
  onOpenChange,
  collapsed,
  onToggle
}: VendorMobileSidebarProps) => {
  const { isRTL } = useLanguage();

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent 
          side={isRTL ? "right" : "left"}
          className={cn(
            "w-80 p-0 bg-background overflow-hidden",
            "safe-area-inset-y",
            isRTL ? "border-l-2" : "border-r-2",
            "flex flex-col"
          )}
        >
          <VendorSidebar 
            onItemClick={() => onOpenChange(false)}
            collapsed={false}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};