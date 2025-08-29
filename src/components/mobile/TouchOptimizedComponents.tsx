import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronRight, 
  MoreVertical, 
  Heart,
  Share,
  Bookmark,
  Eye,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Touch-optimized card with swipe actions
interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: {
    icon: React.ElementType;
    label: string;
    color: string;
  };
  rightAction?: {
    icon: React.ElementType;
    label: string;
    color: string;
  };
  className?: string;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  className
}) => {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const SWIPE_THRESHOLD = 100;
  const MAX_DRAG = 120;

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    
    const diff = clientX - startX;
    const clampedDiff = Math.max(-MAX_DRAG, Math.min(MAX_DRAG, diff));
    setDragX(clampedDiff);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (Math.abs(dragX) > SWIPE_THRESHOLD) {
      if (dragX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (dragX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }
    
    setDragX(0);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Mouse events for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Actions */}
      {(leftAction || rightAction) && (
        <>
          {/* Right action (revealed by left swipe) */}
          {rightAction && (
            <div className="absolute right-0 top-0 bottom-0 w-24 flex items-center justify-center bg-red-500 text-white">
              <div className="flex flex-col items-center gap-1">
                <rightAction.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{rightAction.label}</span>
              </div>
            </div>
          )}
          
          {/* Left action (revealed by right swipe) */}
          {leftAction && (
            <div className="absolute left-0 top-0 bottom-0 w-24 flex items-center justify-center bg-green-500 text-white">
              <div className="flex flex-col items-center gap-1">
                <leftAction.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{leftAction.label}</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Card Content */}
      <div
        ref={cardRef}
        className={cn(
          "transition-transform duration-200 ease-out touch-pan-y",
          isDragging ? "transition-none" : "",
          className
        )}
        style={{
          transform: `translateX(${dragX}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? handleMouseMove : undefined}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {children}
      </div>
    </div>
  );
};

// Touch-optimized list item
interface TouchListItemProps {
  title: string;
  subtitle?: string;
  badge?: string | number;
  avatar?: string;
  onClick?: () => void;
  actions?: Array<{
    icon: React.ElementType;
    label: string;
    onClick: () => void;
  }>;
  className?: string;
}

export const TouchListItem: React.FC<TouchListItemProps> = ({
  title,
  subtitle,
  badge,
  avatar,
  onClick,
  actions,
  className
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <Card className={cn("mb-2", className)}>
      <CardContent className="p-0">
        <SwipeableCard
          onSwipeLeft={() => setShowActions(true)}
          rightAction={actions?.[0] ? {
            icon: actions[0].icon,
            label: actions[0].label,
            color: 'red'
          } : undefined}
        >
          <div
            className="flex items-center gap-3 p-4 min-h-16 active:bg-muted/50 transition-colors"
            onClick={onClick}
          >
            {/* Avatar */}
            {avatar && (
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                <img 
                  src={avatar} 
                  alt="" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {!avatar && (
                  <span className="text-sm font-medium text-muted-foreground">
                    {title.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium truncate pr-2">{title}</h3>
                {badge && (
                  <Badge variant="secondary" className="shrink-0">
                    {badge}
                  </Badge>
                )}
              </div>
              {subtitle && (
                <p className="text-sm text-muted-foreground truncate mt-1">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Arrow */}
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </div>
        </SwipeableCard>
      </CardContent>
    </Card>
  );
};

// Pull-to-refresh component
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  className
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const PULL_THRESHOLD = 80;
  const MAX_PULL = 120;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || containerRef.current?.scrollTop !== 0) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.min(MAX_PULL, Math.max(0, currentY - startY));
    setPullDistance(distance);
  };

  const handleTouchEnd = async () => {
    setIsPulling(false);

    if (pullDistance > PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
  };

  return (
    <div
      ref={containerRef}
      className={cn("overflow-auto", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      {(isPulling || isRefreshing) && (
        <div 
          className="flex items-center justify-center py-4 transition-transform duration-200"
          style={{
            transform: `translateY(${pullDistance}px)`
          }}
        >
          <div className={cn(
            "transition-all duration-200",
            isRefreshing ? "animate-spin" : "",
            pullDistance > PULL_THRESHOLD ? "text-primary" : "text-muted-foreground"
          )}>
            {isRefreshing ? (
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="text-sm font-medium">
                {pullDistance > PULL_THRESHOLD ? 'Release to refresh' : 'Pull to refresh'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`
        }}
        className="transition-transform duration-200"
      >
        {children}
      </div>
    </div>
  );
};

// Touch-optimized action sheet
interface ActionSheetItem {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}

interface TouchActionSheetProps {
  items: ActionSheetItem[];
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const TouchActionSheet: React.FC<TouchActionSheetProps> = ({
  items,
  isOpen,
  onClose,
  title
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-in-bottom">
        <Card className="rounded-t-xl border-b-0">
          <CardContent className="p-0">
            {title && (
              <div className="p-4 border-b">
                <h3 className="font-semibold text-center">{title}</h3>
              </div>
            )}
            
            <div className="py-2">
              {items.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-12 px-4 rounded-none",
                    item.variant === 'destructive' && "text-destructive hover:text-destructive"
                  )}
                  onClick={() => {
                    item.onClick();
                    onClose();
                  }}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Button>
              ))}
            </div>
            
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};