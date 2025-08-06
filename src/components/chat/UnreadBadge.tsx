import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UnreadBadgeProps {
  count: number;
  className?: string;
}

export const UnreadBadge = ({ count, className }: UnreadBadgeProps) => {
  if (count === 0) return null;

  return (
    <Badge 
      variant="destructive" 
      className={cn(
        "h-5 w-5 p-0 flex items-center justify-center text-xs font-bold rounded-full animate-scale-in",
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </Badge>
  );
};