import React, { Suspense, lazy, memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { InlineLoading } from '@/components/ui/enhanced-loading-states';
import { ErrorRecovery } from '@/components/ui/error-recovery';

// Lazy load heavy components for better performance
const LazyAnalyticsDashboard = lazy(() => 
  import('@/components/analytics/EnhancedAnalyticsDashboard').then(module => ({
    default: module.EnhancedAnalyticsDashboard
  }))
);

const LazyAdminDashboard = lazy(() => 
  import('@/components/admin/ComprehensiveAdminOverview').then(module => ({
    default: module.ComprehensiveAdminOverview
  }))
);

const LazyVendorDashboard = lazy(() => 
  import('@/components/vendor/VendorDashboard').then(module => ({
    default: module.VendorDashboard
  }))
);

interface PerformanceWrapperProps {
  component: 'analytics' | 'admin' | 'vendor';
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

export const PerformanceOptimizer = memo<PerformanceWrapperProps>(({ 
  component, 
  fallback,
  children 
}) => {
  const getComponent = () => {
    switch (component) {
      case 'analytics':
        return <LazyAnalyticsDashboard />;
      case 'admin':
        return <LazyAdminDashboard />;
      case 'vendor':
        return <LazyVendorDashboard />;
      default:
        return children;
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <ErrorRecovery
          error={error.message}
          onRetry={resetErrorBoundary}
          title="Component Error"
          description="This component failed to load. Please try again."
        />
      )}
      onError={(error) => {
        // Log performance errors
        console.error(`Performance component error (${component}):`, error);
      }}
    >
      <Suspense 
        fallback={
          fallback || (
            <div className="min-h-screen flex items-center justify-center">
              <InlineLoading text={`Loading ${component} dashboard...`} />
            </div>
          )
        }
      >
        {getComponent()}
      </Suspense>
    </ErrorBoundary>
  );
});

PerformanceOptimizer.displayName = 'PerformanceOptimizer';