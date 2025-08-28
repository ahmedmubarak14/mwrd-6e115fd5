import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Trash2, Star, MessageCircle, MoreHorizontal } from 'lucide-react';

interface SwipeAction {
  icon: React.ComponentType<any>;
  label: string;
  color: 'destructive' | 'primary' | 'secondary' | 'success';
  onClick: () => void;
}

interface SwipeableCardProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  className?: string;
  disabled?: boolean;
}

export const SwipeableCard = ({
  children,
  leftActions = [],
  rightActions = [],
  className,
  disabled = false
}: SwipeableCardProps) => {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const maxSwipe = 100;
  const threshold = 30;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || disabled) return;

    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    
    // Constrain movement
    const newTranslateX = Math.max(-maxSwipe, Math.min(maxSwipe, diff));
    setTranslateX(newTranslateX);
  };

  const handleTouchEnd = () => {
    if (!isDragging || disabled) return;

    setIsDragging(false);

    // Snap to position or return to center
    if (Math.abs(translateX) > threshold) {
      setTranslateX(translateX > 0 ? maxSwipe : -maxSwipe);
    } else {
      setTranslateX(0);
    }
  };

  const executeAction = (action: SwipeAction) => {
    action.onClick();
    setTranslateX(0); // Reset position after action
  };

  const getActionColor = (color: SwipeAction['color']) => {
    switch (color) {
      case 'destructive':
        return 'bg-red-500 text-white';
      case 'primary':
        return 'bg-primary text-primary-foreground';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground';
      case 'success':
        return 'bg-green-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Left Actions */}
      {leftActions.length > 0 && (
        <div className="absolute left-0 top-0 h-full flex items-center z-10">
          {leftActions.map((action, index) => (
            <Button
              key={index}
              size="sm"
              className={cn(
                "h-full rounded-none px-6",
                getActionColor(action.color)
              )}
              onClick={() => executeAction(action)}
            >
              <action.icon className="h-4 w-4" />
              <span className="ml-2 text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      )}

      {/* Right Actions */}
      {rightActions.length > 0 && (
        <div className="absolute right-0 top-0 h-full flex items-center z-10">
          {rightActions.map((action, index) => (
            <Button
              key={index}
              size="sm"
              className={cn(
                "h-full rounded-none px-6",
                getActionColor(action.color)
              )}
              onClick={() => executeAction(action)}
            >
              <action.icon className="h-4 w-4" />
              <span className="ml-2 text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      )}

      {/* Main Card */}
      <Card
        ref={cardRef}
        className={cn(
          "relative z-20 transition-transform duration-200 ease-out cursor-grab active:cursor-grabbing",
          isDragging && "transition-none",
          className
        )}
        style={{
          transform: `translateX(${translateX}px)`
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <CardContent className="p-4">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

// Pre-built swipeable card variants
export const MessageSwipeCard = ({
  children,
  onReply,
  onStar,
  onDelete,
  className
}: {
  children: React.ReactNode;
  onReply?: () => void;
  onStar?: () => void;
  onDelete?: () => void;
  className?: string;
}) => {
  const leftActions: SwipeAction[] = [];
  const rightActions: SwipeAction[] = [];

  if (onReply) {
    leftActions.push({
      icon: MessageCircle,
      label: 'Reply',
      color: 'primary',
      onClick: onReply
    });
  }

  if (onStar) {
    leftActions.push({
      icon: Star,
      label: 'Star',
      color: 'secondary',
      onClick: onStar
    });
  }

  if (onDelete) {
    rightActions.push({
      icon: Trash2,
      label: 'Delete',
      color: 'destructive',
      onClick: onDelete
    });
  }

  return (
    <SwipeableCard
      leftActions={leftActions}
      rightActions={rightActions}
      className={className}
    >
      {children}
    </SwipeableCard>
  );
};