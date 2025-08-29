import { useState, useRef, TouchEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCapacitor } from "@/hooks/useCapacitor";
import { cn } from "@/lib/utils";
import { Trash2, Edit, Eye, MessageCircle } from "lucide-react";

interface SwipeAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: 'destructive' | 'secondary' | 'default' | 'outline' | 'ghost';
  action: () => void;
}

interface SwipeableCardProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  className?: string;
  swipeThreshold?: number;
}

export const SwipeableCard = ({
  children,
  leftActions = [],
  rightActions = [],
  className,
  swipeThreshold = 80
}: SwipeableCardProps) => {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showActions, setShowActions] = useState<'left' | 'right' | null>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const { triggerHaptic } = useCapacitor();

  const handleTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;

    currentX.current = e.touches[0].clientX;
    const diffX = currentX.current - startX.current;
    
    // Limit swipe range
    const maxSwipe = 120;
    const limitedDiff = Math.max(-maxSwipe, Math.min(maxSwipe, diffX));
    
    setTranslateX(limitedDiff);

    // Show actions preview
    if (limitedDiff > swipeThreshold / 2 && leftActions.length > 0) {
      setShowActions('left');
    } else if (limitedDiff < -swipeThreshold / 2 && rightActions.length > 0) {
      setShowActions('right');
    } else {
      setShowActions(null);
    }
  };

  const handleTouchEnd = async () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    const finalX = translateX;

    // Trigger action if threshold reached
    if (Math.abs(finalX) >= swipeThreshold) {
      await triggerHaptic();
      
      if (finalX > 0 && leftActions.length > 0) {
        // Swipe right - trigger first left action
        leftActions[0].action();
      } else if (finalX < 0 && rightActions.length > 0) {
        // Swipe left - trigger first right action
        rightActions[0].action();
      }
    }

    // Reset position
    setTranslateX(0);
    setShowActions(null);
  };

  const getActionButtons = (actions: SwipeAction[], side: 'left' | 'right') => {
    return actions.map((action) => (
      <Button
        key={action.id}
        variant={action.color}
        size="icon"
        onClick={async () => {
          await triggerHaptic();
          action.action();
          setTranslateX(0);
          setShowActions(null);
        }}
        className="h-12 w-12"
      >
        {action.icon}
      </Button>
    ));
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Left Actions */}
      {leftActions.length > 0 && (
        <div className={cn(
          "absolute left-0 top-0 bottom-0 flex items-center gap-2 px-4 transition-opacity",
          showActions === 'left' ? "opacity-100" : "opacity-50 pointer-events-none"
        )}>
          {getActionButtons(leftActions, 'left')}
        </div>
      )}

      {/* Right Actions */}
      {rightActions.length > 0 && (
        <div className={cn(
          "absolute right-0 top-0 bottom-0 flex items-center gap-2 px-4 transition-opacity",
          showActions === 'right' ? "opacity-100" : "opacity-50 pointer-events-none"
        )}>
          {getActionButtons(rightActions, 'right')}
        </div>
      )}

      {/* Main Card */}
      <Card
        className={cn(
          "transition-transform duration-200 ease-out touch-pan-y",
          isDragging && "duration-0"
        )}
        style={{
          transform: `translateX(${translateX}px)`
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </Card>

      {/* Swipe Hint */}
      {!isDragging && translateX === 0 && (leftActions.length > 0 || rightActions.length > 0) && (
        <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
          ←→ Swipe for actions
        </div>
      )}
    </div>
  );
};