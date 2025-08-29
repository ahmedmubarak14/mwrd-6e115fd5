import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface UseSwipeOptions {
  threshold?: number;
  preventDefaultTouchmoveEvent?: boolean;
}

export const useSwipe = (
  handlers: SwipeHandlers,
  options: UseSwipeOptions = {}
) => {
  const { threshold = 50, preventDefaultTouchmoveEvent = false } = options;
  const [startTouch, setStartTouch] = useState<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartTouch({ x: touch.clientX, y: touch.clientY });
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (preventDefaultTouchmoveEvent) {
      e.preventDefault();
    }
  }, [preventDefaultTouchmoveEvent]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!startTouch) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startTouch.x;
    const deltaY = touch.clientY - startTouch.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (Math.max(absDeltaX, absDeltaY) > threshold) {
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0) {
          handlers.onSwipeRight?.();
        } else {
          handlers.onSwipeLeft?.();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          handlers.onSwipeDown?.();
        } else {
          handlers.onSwipeUp?.();
        }
      }
    }

    setStartTouch(null);
  }, [startTouch, threshold, handlers]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};

interface SwipeableCardProps {
  children: React.ReactNode;
  className?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: {
    icon: React.ReactNode;
    color: string;
    label: string;
  };
  rightAction?: {
    icon: React.ReactNode;
    color: string;
    label: string;
  };
}

export const SwipeableCard = ({
  children,
  className,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
}: SwipeableCardProps) => {
  const [offset, setOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      if (onSwipeLeft && rightAction) {
        setIsAnimating(true);
        setOffset(-100);
        setTimeout(() => {
          onSwipeLeft();
          setOffset(0);
          setIsAnimating(false);
        }, 300);
      }
    },
    onSwipeRight: () => {
      if (onSwipeRight && leftAction) {
        setIsAnimating(true);
        setOffset(100);
        setTimeout(() => {
          onSwipeRight();
          setOffset(0);
          setIsAnimating(false);
        }, 300);
      }
    },
  });

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Left action background */}
      {leftAction && (
        <div className="absolute inset-y-0 left-0 right-1/2 flex items-center justify-start pl-4 bg-green-500 text-white">
          <div className="flex items-center space-x-2">
            {leftAction.icon}
            <span className="font-medium">{leftAction.label}</span>
          </div>
        </div>
      )}

      {/* Right action background */}
      {rightAction && (
        <div className="absolute inset-y-0 right-0 left-1/2 flex items-center justify-end pr-4 bg-red-500 text-white">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{rightAction.label}</span>
            {rightAction.icon}
          </div>
        </div>
      )}

      {/* Main card */}
      <div
        ref={cardRef}
        className={cn(
          "relative bg-background transition-transform",
          isAnimating ? "duration-300 ease-out" : "duration-150 ease-out"
        )}
        style={{
          transform: `translateX(${offset}%)`,
        }}
        {...swipeHandlers}
      >
        {children}
      </div>
    </div>
  );
};

interface LongPressOptions {
  threshold?: number;
  onLongPress?: () => void;
}

export const useLongPress = ({ threshold = 500, onLongPress }: LongPressOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [isLongPressing, setIsLongPressing] = useState(false);

  const start = useCallback(() => {
    setIsLongPressing(false);
    timeoutRef.current = setTimeout(() => {
      setIsLongPressing(true);
      onLongPress?.();
    }, threshold);
  }, [threshold, onLongPress]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsLongPressing(false);
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
    isLongPressing,
  };
};

interface TapToRevealProps {
  children: React.ReactNode;
  revealContent: React.ReactNode;
  className?: string;
  tapCount?: number;
}

export const TapToReveal = ({
  children,
  revealContent,
  className,
  tapCount = 2,
}: TapToRevealProps) => {
  const [taps, setTaps] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleTap = () => {
    setTaps(prev => prev + 1);
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout to reset taps
    timeoutRef.current = setTimeout(() => {
      setTaps(0);
    }, 500);
  };

  useEffect(() => {
    if (taps >= tapCount) {
      setIsRevealed(true);
      setTaps(0);
      // Auto hide after 3 seconds
      setTimeout(() => {
        setIsRevealed(false);
      }, 3000);
    }
  }, [taps, tapCount]);

  return (
    <div
      className={cn("relative cursor-pointer", className)}
      onClick={handleTap}
    >
      <div className={cn(
        "transition-opacity duration-300",
        isRevealed ? "opacity-30" : "opacity-100"
      )}>
        {children}
      </div>
      
      {isRevealed && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm animate-fade-in">
          {revealContent}
        </div>
      )}
      
      {/* Tap indicator */}
      {taps > 0 && taps < tapCount && (
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full animate-bounce">
          {taps}/{tapCount}
        </div>
      )}
    </div>
  );
};

interface PinchZoomProps {
  children: React.ReactNode;
  className?: string;
  minScale?: number;
  maxScale?: number;
}

export const PinchZoom = ({
  children,
  className,
  minScale = 0.5,
  maxScale = 3,
}: PinchZoomProps) => {
  const [scale, setScale] = useState(1);
  const [lastScale, setLastScale] = useState(1);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      setLastScale(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      
      const scaleChange = distance / lastScale;
      const newScale = Math.min(Math.max(scale * scaleChange, minScale), maxScale);
      setScale(newScale);
      setLastScale(distance);
    }
  };

  const handleDoubleClick = () => {
    setScale(scale === 1 ? 2 : 1);
  };

  return (
    <div
      ref={elementRef}
      className={cn("overflow-hidden touch-pan-y", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className="transition-transform duration-200 origin-center"
        style={{ transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
};