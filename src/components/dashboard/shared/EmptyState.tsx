
import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 text-center",
      isRTL && "dir-rtl"
    )}>
      {icon && (
        <div className="mb-4 text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">
        {title || t('dashboard.emptyState.title')}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {description || t('dashboard.emptyState.description')}
      </p>
      {onAction && (
        <Button onClick={onAction}>
          {actionLabel || t('dashboard.emptyState.action')}
        </Button>
      )}
    </div>
  );
};
