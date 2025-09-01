import React from 'react';

// Track initialization to prevent duplicate event listeners
let isGlobalErrorHandlerInitialized = false;

// Completely static error handler with no React hooks to avoid dispatcher issues during hot reload
export const GlobalErrorHandler = () => {
  // Set up error handlers immediately without using useEffect
  if (typeof window !== 'undefined' && !isGlobalErrorHandlerInitialized) {
    isGlobalErrorHandlerInitialized = true;

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
  }

  return null;
};