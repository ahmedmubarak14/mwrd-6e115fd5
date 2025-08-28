import React, { useState, useRef, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void> | void;
  className?: string;
  disabled?: boolean;
  threshold?: number;
  refreshingThreshold?: number;
}

export const PullToRefresh = ({
  children,
  onRefresh,
  className,
  disabled = false,
  threshold = 80,
  refreshingThreshold = 50
}: PullToRefreshProps) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    
    const container = containerRef.current;
    if (container && container.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, [disabled, isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || disabled || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;

    if (deltaY > 0) {
      // Prevent default scroll behavior when pulling down
      e.preventDefault();
      
      // Apply resistance to make pulling feel more natural
      const resistance = 0.5;
      const distance = Math.min(deltaY * resistance, threshold + 20);
      setPullDistance(distance);
    }
  }, [isPulling, disabled, isRefreshing, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || disabled) return;

    setIsPulling(false);

    if (pullDistance >= refreshingThreshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(refreshingThreshold);

      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        // Animate back to 0
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 500);
      }
    } else {
      setPullDistance(0);
    }
  }, [isPulling, disabled, pullDistance, refreshingThreshold, isRefreshing, onRefresh]);

  const getRefreshStatus = () => {
    if (isRefreshing) return 'Refreshing...';
    if (pullDistance >= refreshingThreshold) return 'Release to refresh';
    if (isPulling) return 'Pull to refresh';
    return '';
  };

  const getIconRotation = () => {
    if (isRefreshing) return 'animate-spin';
    if (pullDistance >= refreshingThreshold) return 'rotate-180';
    return '';
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Pull indicator */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur z-10 transition-transform duration-200",
          pullDistance > 0 ? "translate-y-0" : "-translate-y-full"
        )}
        style={{
          height: Math.max(pullDistance, 0),
          transform: `translateY(${Math.max(pullDistance - threshold, -threshold)}px)`
        }}
      >
        {pullDistance > 20 && (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <RefreshCw 
              className={cn("h-5 w-5 transition-transform duration-200", getIconRotation())} 
            />
            <span className="text-sm font-medium">
              {getRefreshStatus()}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        className="transition-transform duration-200 overflow-auto h-full"
        style={{
          transform: `translateY(${isPulling || isRefreshing ? pullDistance : 0}px)`
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
};