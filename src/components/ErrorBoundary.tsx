
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { logSecurityEvent } from '@/utils/security';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log security event for potential attacks or system issues
    logSecurityEvent('application_error', {
      error_message: error.message,
      error_stack: error.stack,
      component_stack: errorInfo.componentStack,
      error_boundary: 'global'
    });

    this.setState({
      error,
      errorInfo,
    });
    
    // Handle WebSocket errors gracefully without breaking the app
    if (error.message?.includes('WebSocket') || error.message?.includes('insecure')) {
      console.warn('WebSocket connection failed - continuing with limited functionality:', error.message);
      // Don't show error UI for WebSocket issues, just log them
      this.setState({ hasError: false });
      return;
    }
  }

  private handleRefresh = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
    
    // Force a hard refresh if the error persists
    if (this.state.hasError) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isWebSocketError = this.state.error?.message?.includes('WebSocket') || 
                              this.state.error?.message?.includes('insecure');

      // Don't show error UI for WebSocket issues - they're handled gracefully
      if (isWebSocketError) {
        return this.props.children;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>
                An error occurred while rendering this component. Please refresh the page to try again.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex gap-2 justify-center mb-4">
                <Button onClick={this.handleRefresh} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                >
                  Go Home
                </Button>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left bg-muted p-3 rounded text-xs">
                  <summary className="cursor-pointer font-medium mb-2">
                    Error Details (Development Only)
                  </summary>
                  <pre className="whitespace-pre-wrap break-all">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simpler functional error boundary for smaller components
interface SimpleErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export const SimpleErrorBoundary: React.FC<SimpleErrorBoundaryProps> = ({ 
  children, 
  onError 
}) => {
  return (
    <ErrorBoundary 
      fallback={
        <div className="p-4 text-center text-muted-foreground">
          <p>Unable to load this component</p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};
