import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  showHeader?: boolean;
  lines?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ 
  className, 
  showHeader = true, 
  lines = 3 
}) => {
  return (
    <Card className={cn("w-full", className)}>
      {showHeader && (
        <CardHeader>
          <div className="space-y-2">
            <div className="h-5 bg-muted rounded shimmer w-3/4" />
            <div className="h-4 bg-muted rounded shimmer w-1/2" />
          </div>
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div 
            key={index}
            className={cn(
              "h-4 bg-muted rounded shimmer",
              index === 0 && "w-full",
              index === 1 && "w-5/6", 
              index === 2 && "w-4/6",
              index > 2 && "w-3/4"
            )}
          />
        ))}
      </CardContent>
    </Card>
  );
};