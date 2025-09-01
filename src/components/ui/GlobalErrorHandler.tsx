import React, { useEffect } from 'react';

// Safe error handler that doesn't depend on external contexts during initialization
export const GlobalErrorHandler = () => {
  useEffect(() => {
    // Get toast function safely
    let toast: ((options: any) => void) | null = null;
    
    // Try to get toast, but don't fail if context is unavailable
    try {
      // Only import and use toast if we're in a proper React context
      if (typeof window !== 'undefined' && window.React) {
        import('@/hooks/use-toast').then(({ useToast }) => {
          // This won't work here since we're not in a component context
          // We'll handle this gracefully by just using console fallbacks
        }).catch(() => {
          // Import failed, use console fallback
        });
      }
    } catch (error) {
      // Context not available, will use console logging
    }

    // Global error handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Parse common error types
      const error = event.reason;
      let title = 'Unexpected Error';
      let description = 'An unexpected error occurred. Please try again.';
      
      if (error?.message?.includes('Network')) {
        title = 'Network Error';
        description = 'Please check your internet connection and try again.';
      } else if (error?.message?.includes('auth')) {
        title = 'Authentication Error';
        description = 'Please sign in again to continue.';
      } else if (error?.status === 404) {
        title = 'Not Found';
        description = 'The requested resource was not found.';
      } else if (error?.status >= 500) {
        title = 'Server Error';
        description = 'Our servers are experiencing issues. Please try again later.';
      }
      
      // For now, always use console logging to avoid context issues
      console.error(`${title}: ${description}`);
    };

    // Global error handler for JavaScript errors
    const handleError = (event: ErrorEvent) => {
      console.error('Global JavaScript error:', event.error);
      console.error('Application Error: Something went wrong. The page may need to be refreshed.');
    };

    // Network status monitoring
    const handleOnline = () => {
      console.log('Back Online: Your internet connection has been restored.');
    };

    const handleOffline = () => {
      console.warn('Connection Lost: Please check your internet connection.');
    };

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // Empty dependency array to avoid re-running

  return null;
};