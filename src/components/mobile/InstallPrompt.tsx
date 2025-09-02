import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Download, X, Smartphone } from "lucide-react";

interface InstallPromptProps {
  onInstall: () => void;
  onDismiss?: () => void;
}

export const InstallPrompt = ({ onInstall, onDismiss }: InstallPromptProps) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const { t, isRTL } = useLanguage();

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  const handleInstall = () => {
    onInstall();
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <Card className={cn(
      "fixed bottom-20 left-4 right-4 z-50 shadow-lg border-2 border-primary/20",
      "animate-slide-up"
    )}>
      <CardContent className="p-4">
        <div className={cn(
          "flex items-center gap-3",
          isRTL && "flex-row-reverse"
        )}>
          {/* Icon */}
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <Smartphone className="h-5 w-5 text-primary" />
          </div>

          {/* Content */}
          <div className={cn("flex-1", isRTL && "text-right")}>
            <h3 className="font-semibold text-sm mb-1">
              {isRTL ? "تثبيت التطبيق" : "Install MWRD App"}
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              {isRTL 
                ? "احصل على تجربة أفضل مع التطبيق المثبت على جهازك"
                : "Get the best experience with our installed app"
              }
            </p>

            {/* Actions */}
            <div className={cn(
              "flex gap-2",
              isRTL && "flex-row-reverse"
            )}>
              <Button 
                size="sm" 
                onClick={handleInstall}
                className="flex items-center gap-2 text-xs"
              >
                <Download className="h-3 w-3" />
                {isRTL ? "تثبيت" : "Install"}
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleDismiss}
                className="text-xs"
              >
                {isRTL ? "لاحقاً" : "Later"}
              </Button>
            </div>
          </div>

          {/* Close Button */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleDismiss}
            className="h-6 w-6 shrink-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};