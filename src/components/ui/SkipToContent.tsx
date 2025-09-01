import { cn } from "@/lib/utils";
import { TouchOptimizedButton } from "@/components/ui/TouchOptimizedButton";

interface SkipToContentProps {
  targetId?: string;
  className?: string;
  children?: React.ReactNode;
}

export const SkipToContent = ({ 
  targetId = "main-content", 
  className,
  children = "Skip to main content" 
}: SkipToContentProps) => {
  const handleSkip = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <TouchOptimizedButton
      onClick={handleSkip}
      className={cn(
        // Position off-screen by default
        "absolute -top-40 left-6 z-50",
        // Make visible when focused
        "focus:top-6 transition-all duration-200",
        // Ensure high contrast and visibility
        "bg-primary text-primary-foreground",
        "px-4 py-2 text-sm font-medium",
        "border-2 border-primary-foreground",
        className
      )}
      // Ensure it's the first focusable element
      tabIndex={1}
    >
      {children}
    </TouchOptimizedButton>
  );
};