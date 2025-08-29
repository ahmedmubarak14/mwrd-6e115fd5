import { useState, useRef, ReactNode, TouchEvent } from "react";
import { useCapacitor } from "@/hooks/useCapacitor";
import { cn } from "@/lib/utils";
import { RotateCcw, CheckCircle } from "lucide-react";

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  refreshThreshold?: number;
  className?: string;
  disabled?: boolean;
}

export const PullToRefresh = ({
  children,
  onRefresh,
  refreshThreshold = 80,
  className,
  disabled = false
}: PullToRefreshProps) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshComplete, setRefreshComplete] = useState(false);
  const startY = useRef(0);
  const isPulling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { triggerHaptic } = useCapacitor();

  const handleTouchStart = (e: TouchEvent) => {
    if (disabled || isRefreshing) return;

    const scrollTop = containerRef.current?.scrollTop || 0;
    if (scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPulling.current || disabled || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    if (diff > 0) {
      // Apply resistance to make pull feel natural
      const resistance = 0.5;
      const distance = Math.min(diff * resistance, refreshThreshold * 1.5);
      setPullDistance(distance);

      // Haptic feedback when reaching threshold
      if (distance >= refreshThreshold && pullDistance < refreshThreshold) {
        triggerHaptic();
      }
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling.current || disabled) return;

    isPulling.current = false;

    if (pullDistance >= refreshThreshold && !isRefreshing) {
      setIsRefreshing(true);
      await triggerHaptic();
      
      try {
        await onRefresh();
        setRefreshComplete(true);
        
        // Show completion state briefly
        setTimeout(() => {
          setRefreshComplete(false);
          setPullDistance(0);
          setIsRefreshing(false);
        }, 1000);
      } catch (error) {
        console.error('Refresh failed:', error);
        setPullDistance(0);
        setIsRefreshing(false);
      }
    } else {
      setPullDistance(0);
    }
  };

  const getRefreshIcon = () => {
    if (refreshComplete) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    
    return (
      <RotateCcw 
        className={cn(
          "h-5 w-5 transition-transform",
          isRefreshing && "animate-spin",
          pullDistance >= refreshThreshold ? "text-primary" : "text-muted-foreground"
        )}
        style={{
          transform: `rotate(${Math.min(pullDistance * 2, 180)}deg)`
        }}
      />
    );
  };

  const getRefreshText = () => {
    if (refreshComplete) return "Refreshed!";
    if (isRefreshing) return "Refreshing...";
    if (pullDistance >= refreshThreshold) return "Release to refresh";
    return "Pull to refresh";
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-auto", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull Indicator */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 z-10 flex items-center justify-center",
          "bg-background/95 backdrop-blur transition-all duration-300 ease-out",
          pullDistance > 0 ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{
          height: `${Math.min(pullDistance, refreshThreshold)}px`,
          transform: `translateY(-${Math.max(0, refreshThreshold - pullDistance)}px)`
        }}
      >
        <div className="flex flex-col items-center gap-1 pb-2">
          {getRefreshIcon()}
          <span className={cn(
            "text-xs font-medium transition-colors",
            pullDistance >= refreshThreshold ? "text-primary" : "text-muted-foreground"
          )}>
            {getRefreshText()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(${isRefreshing ? refreshThreshold : pullDistance}px)`
        }}
      >
        {children}
      </div>
    </div>
  );
};