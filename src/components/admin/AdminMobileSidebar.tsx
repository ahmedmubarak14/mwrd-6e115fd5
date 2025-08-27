
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AdminSidebar } from "./AdminSidebar";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { cn } from "@/lib/utils";

interface AdminMobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdminMobileSidebar = ({ isOpen, onOpenChange }: AdminMobileSidebarProps) => {
  const languageContext = useOptionalLanguage();
  const { isRTL } = languageContext || { 
    isRTL: false 
  };

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent 
          side={isRTL ? "right" : "left"}
          className={cn(
            "w-[90vw] max-w-sm p-0 bg-background/95 backdrop-blur-md safe-area-pt safe-area-pb",
            "animate-slide-in-right"
          )}
        >
          <AdminSidebar />
        </SheetContent>
      </Sheet>
    </div>
  );
};
