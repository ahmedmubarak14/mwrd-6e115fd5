import { lazy, Suspense, ComponentType, ReactNode, Component } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface LazyLoadWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
}

interface LazyComponentProps {
  componentPath: string;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  props?: Record<string, any>;
}

// Default loading fallback
const DefaultLoadingFallback = () => (
  <div className="flex items-center justify-center py-12">
    <LoadingSpinner size="lg" />
  </div>
);

// Default error fallback
const DefaultErrorFallback = ({ error }: { error?: Error }) => (
  <Card className="border-destructive/20">
    <CardContent className="py-12 text-center">
      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
      <h3 className="text-lg font-semibold mb-2">Failed to Load Component</h3>
      <p className="text-muted-foreground">
        {error?.message || 'An error occurred while loading this component.'}
      </p>
    </CardContent>
  </Card>
);

// Error boundary for lazy components
class LazyLoadErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Lazy load error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Generic lazy load wrapper
export const LazyLoadWrapper = ({ 
  children, 
  fallback = <DefaultLoadingFallback />,
  errorFallback 
}: LazyLoadWrapperProps) => {
  return (
    <LazyLoadErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </LazyLoadErrorBoundary>
  );
};

// Dynamic component loader
export const LazyComponent = ({ 
  componentPath, 
  fallback = <DefaultLoadingFallback />,
  errorFallback,
  props = {}
}: LazyComponentProps) => {
  const Component = lazy(() => import(componentPath));
  
  return (
    <LazyLoadWrapper fallback={fallback} errorFallback={errorFallback}>
      <Component {...props} />
    </LazyLoadWrapper>
  );
};

// Lazy load hook for dynamic imports
export const useLazyComponent = (componentPath: string) => {
  return lazy(() => import(componentPath));
};

// Preload function for critical components
export const preloadComponent = (componentPath: string) => {
  const componentImport = import(componentPath);
  return componentImport;
};

// Admin-specific lazy loading components
export const LazyAdminVerificationWorkflow = lazy(() => 
  import('@/components/admin/AdminVerificationWorkflow').then(m => ({ default: m.AdminVerificationWorkflow }))
);

export const LazyAdminCommunicationCenter = lazy(() => 
  import('@/components/admin/AdminCommunicationCenter').then(m => ({ default: m.AdminCommunicationCenter }))
);

// Vendor-specific lazy loading components
export const LazyVendorDashboard = lazy(() => 
  import('@/components/vendor/CleanVendorDashboard').then(m => ({ default: m.CleanVendorDashboard }))
);

export const LazyOfferManagementSystem = lazy(() => 
  import('@/components/vendor/OfferManagementSystem').then(m => ({ default: m.OfferManagementSystem }))
);

// Client-specific lazy loading components
export const LazyClientDashboard = lazy(() => 
  import('@/components/Dashboard/ProcurementClientDashboard').then(m => ({ default: m.ProcurementClientDashboard }))
);

// Chat and messaging lazy components
export const LazyChatInterface = lazy(() => 
  import('@/components/chat/RealTimeChatInterface').then(m => ({ default: m.RealTimeChatInterface }))
);

export const LazyVideoCallModal = lazy(() => 
  import('@/components/modals/VideoCallModal').then(m => ({ default: m.VideoCallModal }))
);

// Analytics lazy components
export const LazyAnalyticsDashboard = lazy(() => 
  import('@/components/analytics/BasicAnalyticsDashboard').then(m => ({ default: m.BasicAnalyticsDashboard }))
);

export const LazyFinancialAnalyticsChart = lazy(() => 
  import('@/components/analytics/FinancialAnalyticsChart').then(m => ({ default: m.FinancialAnalyticsChart }))
);