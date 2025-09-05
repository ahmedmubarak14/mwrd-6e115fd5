
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AdminSidebar } from "./AdminSidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface AdminMobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  collapsed?: boolean;
  onToggle?: () => void;
}

export const AdminMobileSidebar = ({ 
  isOpen, 
  onOpenChange,
  collapsed,
  onToggle
}: AdminMobileSidebarProps) => {
  const { isRTL } = useLanguage();

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent 
          side={isRTL ? "right" : "left"}
          className={cn(
            "w-[75vw] max-w-xs p-0 bg-background overflow-hidden",
            "safe-area-inset-y",
            isRTL ? "border-l-2" : "border-r-2",
            "flex flex-col"
          )}
        >
          <AdminSidebar 
            onItemClick={() => onOpenChange(false)}
            collapsed={collapsed}
            onToggle={onToggle}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};
