import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
}

/**
 * Custom hook for implementing infinite scroll functionality
 * Automatically loads more content when user scrolls near the bottom
 */
export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '20px'
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      {
        threshold,
        rootMargin
      }
    );
    
    if (node) observer.current.observe(node);
    observerRef.current = node;
  }, [isLoading, hasMore, onLoadMore, threshold, rootMargin]);

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return { lastElementRef };
}

/**
 * Enhanced infinite scroll hook with scroll position management
 */
export function useAdvancedInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '20px'
}: UseInfiniteScrollOptions & {
  preserveScrollPosition?: boolean;
}) {
  const { lastElementRef } = useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore,
    threshold,
    rootMargin
  });

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTop = useRef<number>(0);

  const saveScrollPosition = () => {
    if (scrollContainerRef.current) {
      lastScrollTop.current = scrollContainerRef.current.scrollTop;
    }
  };

  const restoreScrollPosition = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = lastScrollTop.current;
    }
  };

  return {
    lastElementRef,
    scrollContainerRef,
    saveScrollPosition,
    restoreScrollPosition
  };
}