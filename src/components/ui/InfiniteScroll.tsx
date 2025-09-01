import React, { useEffect, useRef, useCallback } from 'react';
import { ProductionLoadingSpinner } from './ProductionLoadingSpinner';
import { cn } from '@/lib/utils';

interface InfiniteScrollProps {
  children: React.ReactNode;
  loadMore: () => Promise<void> | void;
  hasMore: boolean;
  loading?: boolean;
  threshold?: number;
  className?: string;
  loadingComponent?: React.ReactNode;
  endMessage?: React.ReactNode;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  loadMore,
  hasMore,
  loading = false,
  threshold = 0.8,
  className,
  loadingComponent,
  endMessage
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || loading || !hasMore || loadingRef.current) {
      return;
    }

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (scrollPercentage >= threshold) {
      loadingRef.current = true;
      
      const result = loadMore();
      
      if (result instanceof Promise) {
        result.finally(() => {
          loadingRef.current = false;
        });
      } else {
        // Sync function
        setTimeout(() => {
          loadingRef.current = false;
        }, 100);
      }
    }
  }, [loadMore, loading, hasMore, threshold]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Check if we need to load more on mount
  useEffect(() => {
    if (!loading && hasMore && containerRef.current) {
      const container = containerRef.current;
      if (container.scrollHeight <= container.clientHeight) {
        loadMore();
      }
    }
  }, [loadMore, loading, hasMore]);

  const defaultLoadingComponent = (
    <div className="flex justify-center py-4">
      <ProductionLoadingSpinner size="sm" text="Loading more..." />
    </div>
  );

  const defaultEndMessage = (
    <div className="text-center py-4 text-muted-foreground text-sm">
      No more items to load
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={cn("overflow-auto", className)}
      style={{ overscrollBehavior: 'contain' }}
    >
      {children}
      
      {loading && (loadingComponent || defaultLoadingComponent)}
      
      {!hasMore && !loading && (endMessage || defaultEndMessage)}
    </div>
  );
};