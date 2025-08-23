import React from "react";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageNotificationProps {
  count: number;
  className?: string;
}

export const MessageNotification = ({ count, className }: MessageNotificationProps) => {
  if (count === 0) return null;

  return (
    <Badge 
      variant="destructive" 
      className={cn(
        "absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs",
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </Badge>
  );
};

interface MessageIndicatorProps {
  hasUnread: boolean;
  count?: number;
  className?: string;
}

export const MessageIndicator = ({ hasUnread, count = 0, className }: MessageIndicatorProps) => {
  return (
    <div className={cn("relative inline-flex", className)}>
      <MessageCircle className="h-5 w-5" />
      {hasUnread && <MessageNotification count={count} />}
    </div>
  );
};