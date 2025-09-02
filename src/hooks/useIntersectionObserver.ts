import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useIntersectionObserver = (
  targetRef: React.RefObject<Element>,
  options: UseIntersectionObserverOptions = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    triggerOnce = false
  } = options;

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isIntersectingNow = entry.isIntersecting;
        setIsIntersecting(isIntersectingNow);
        
        if (isIntersectingNow && !hasIntersected) {
          setHasIntersected(true);
        }
        
        // If triggerOnce is true and we've intersected, disconnect the observer
        if (triggerOnce && isIntersectingNow) {
          observerRef.current?.disconnect();
        }
      },
      { threshold, root, rootMargin }
    );

    observerRef.current.observe(target);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [targetRef, threshold, root, rootMargin, triggerOnce, hasIntersected]);

  return {
    isIntersecting: triggerOnce ? hasIntersected : isIntersecting,
    hasIntersected
  };
};