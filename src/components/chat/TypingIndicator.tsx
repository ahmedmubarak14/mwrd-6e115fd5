import React from 'react';
import { cn } from "@/lib/utils";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-3 max-w-[80%] mr-auto">
      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-xs text-primary font-medium">•••</span>
      </div>
      
      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
          </div>
          <span className="ml-2 text-xs text-muted-foreground">typing</span>
        </div>
      </div>
    </div>
  );
};