import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AccessibleTooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  className?: string;
  ariaLabel?: string;
}

export const AccessibleTooltip: React.FC<AccessibleTooltipProps> = ({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 700,
  className,
  ariaLabel
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger 
          asChild
          aria-label={ariaLabel || content}
        >
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align}
          className={cn(
            "z-50 max-w-xs text-sm",
            className
          )}
          role="tooltip"
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};