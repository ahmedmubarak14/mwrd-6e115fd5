import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { WifiOff, X } from "lucide-react";

interface OfflineIndicatorProps {
  isOffline: boolean;
  onDismiss?: () => void;
}

export const OfflineIndicator = ({ isOffline, onDismiss }: OfflineIndicatorProps) => {
  const { t, isRTL } = useLanguage();

  if (!isOffline) return null;

  return (
    <Card className={cn(
      "fixed top-4 left-4 right-4 z-50 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950",
      "animate-slide-down"
    )}>
      <CardContent className="p-3">
        <div className={cn(
          "flex items-center gap-3",
          isRTL && "flex-row-reverse"
        )}>
          {/* Icon */}
          <WifiOff className="h-4 w-4 text-orange-600 shrink-0" />

          {/* Content */}
          <div className={cn("flex-1", isRTL && "text-right")}>
            <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
              {isRTL ? "غير متصل بالإنترنت" : "No internet connection"}
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-300">
              {isRTL 
                ? "بعض الميزات قد لا تعمل بشكل صحيح"
                : "Some features may not work properly"
              }
            </p>
          </div>

          {/* Close Button */}
          {onDismiss && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onDismiss}
              className="h-6 w-6 shrink-0 hover:bg-orange-100 dark:hover:bg-orange-900"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};