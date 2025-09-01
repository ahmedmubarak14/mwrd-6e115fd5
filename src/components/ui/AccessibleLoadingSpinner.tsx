import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface AccessibleLoadingSpinnerProps {
  size?: "sm" | "default" | "lg";
  className?: string;
  label?: string;
  description?: string;
}

export const AccessibleLoadingSpinner = ({ 
  size = "default", 
  className,
  label = "Loading",
  description
}: AccessibleLoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      aria-describedby={description ? "loading-description" : undefined}
      className={cn("flex items-center justiy-center", className)}
    >
      <Loader2 
        className={cn(
          "animate-spin text-primary",
          sizeClasses[size]
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
      {description && (
        <span id="loading-description" className="sr-only">
          {description}
        </span>
      )}
    </div>
  );
};