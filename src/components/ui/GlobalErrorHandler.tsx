import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';

export const GlobalErrorHandler = () => {
  const { toast } = useToast();

  useEffect(() => {
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
      
      toast({
        title,
        description,
        variant: 'destructive',
        duration: 5000,
      });
    };

    // Global error handler for JavaScript errors
    const handleError = (event: ErrorEvent) => {
      console.error('Global JavaScript error:', event.error);
      
      toast({
        title: 'Application Error',
        description: 'Something went wrong. The page may need to be refreshed.',
        variant: 'destructive',
        duration: 5000,
      });
    };

    // Network status monitoring
    const handleOnline = () => {
      toast({
        title: 'Back Online',
        description: 'Your internet connection has been restored.',
        variant: 'default',
        duration: 3000,
      });
    };

    const handleOffline = () => {
      toast({
        title: 'Connection Lost', 
        description: 'Please check your internet connection.',
        variant: 'destructive',
        duration: 10000,
      });
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
  }, [toast]);

  return null;
};