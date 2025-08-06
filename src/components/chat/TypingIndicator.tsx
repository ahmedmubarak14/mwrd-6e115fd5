import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  className?: string;
  userName?: string;
}

export const TypingIndicator = ({ className, userName = "Someone" }: TypingIndicatorProps) => {
  return (
    <div className={cn("flex items-center gap-2 text-muted-foreground text-sm animate-fade-in", className)}>
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0ms]"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:150ms]"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:300ms]"></div>
      </div>
      <span>{userName} is typing...</span>
    </div>
  );
};