import React, { Suspense, lazy } from 'react';
import { ProductionLoadingSpinner } from './ProductionLoadingSpinner';
import { ProductionErrorBoundary } from './ProductionErrorBoundary';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

export const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({
  children,
  fallback,
  errorFallback
}) => {
  const defaultFallback = fallback || (
    <ProductionLoadingSpinner 
      size="md" 
      text="Loading component..." 
    />
  );

  return (
    <ProductionErrorBoundary fallback={errorFallback}>
      <Suspense fallback={defaultFallback}>
        {children}
      </Suspense>
    </ProductionErrorBoundary>
  );
};

// Helper function to create lazy-loaded components  
export const createLazyComponent = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFn);

  return React.memo((props: any) => (
    <LazyLoadWrapper fallback={fallback}>
      <LazyComponent {...props} />
    </LazyLoadWrapper>
  ));
};