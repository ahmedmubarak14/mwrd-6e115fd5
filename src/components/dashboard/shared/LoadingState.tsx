
import React from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useLanguage } from "@/contexts/LanguageContext";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  size = "lg"
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-center">
        <LoadingSpinner size={size} />
        <p className="mt-4 text-muted-foreground">
          {message || t('dashboard.loading')}
        </p>
      </div>
    </div>
  );
};
