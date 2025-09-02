import { useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
  startOnView?: boolean;
}

export const AnimatedCounter = ({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
  startOnView = true
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const countRef = useRef<HTMLSpanElement>(null);
  
  const { isIntersecting } = useIntersectionObserver(countRef, {
    threshold: 0.5,
    triggerOnce: true
  });

  useEffect(() => {
    if (!startOnView || (startOnView && isIntersecting && !hasStarted)) {
      setHasStarted(true);
      let startTime: number;
      const startValue = 0;
      
      const animateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = startValue + (end - startValue) * easeOutQuart;
        
        setCount(currentCount);
        
        if (progress < 1) {
          requestAnimationFrame(animateCount);
        }
      };
      
      requestAnimationFrame(animateCount);
    }
  }, [end, duration, isIntersecting, startOnView, hasStarted]);

  const formatNumber = (num: number) => {
    if (decimals === 0) {
      return Math.floor(num).toLocaleString();
    }
    return num.toFixed(decimals);
  };

  return (
    <span ref={countRef} className={className}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};