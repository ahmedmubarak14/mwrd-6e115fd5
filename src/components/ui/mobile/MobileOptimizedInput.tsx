import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MobileOptimizedInputProps extends React.ComponentProps<typeof Input> {
  label?: string;
  description?: string;
  error?: string;
  fullWidth?: boolean;
}

export const MobileOptimizedInput = React.forwardRef<
  HTMLInputElement,
  MobileOptimizedInputProps
>(({ label, description, error, fullWidth = true, className, ...props }, ref) => {
  return (
    <div className={cn("space-y-2", fullWidth && "w-full")}>
      {label && (
        <Label className="text-sm font-medium text-foreground">
          {label}
        </Label>
      )}
      
      <Input
        ref={ref}
        className={cn(
          "h-12 px-4 text-base", // Mobile-friendly height and text size
          "border-2 rounded-xl", // Clearer borders and modern corners
          "focus:ring-2 focus:ring-primary/20", // Enhanced focus states
          "transition-all duration-200",
          error && "border-destructive focus:border-destructive",
          className
        )}
        {...props}
      />
      
      {description && !error && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      
      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
});

MobileOptimizedInput.displayName = "MobileOptimizedInput";