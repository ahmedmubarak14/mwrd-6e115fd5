import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  showHomeButton?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ProductionErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ProductionErrorBoundary caught an error:', error, errorInfo);
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error monitoring service
    }
    
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/vendor/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <CardTitle className="text-destructive">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                We're sorry, but something unexpected happened. Please try again or return to the dashboard.
              </p>
              
              {this.props.showDetails && process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="bg-muted p-2 rounded text-xs">
                  <summary className="cursor-pointer font-medium">Error Details</summary>
                  <pre className="mt-2 whitespace-pre-wrap text-xs overflow-auto max-h-32">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}

              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={this.handleReset}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                
                {this.props.showHomeButton && (
                  <Button 
                    onClick={this.handleGoHome}
                    size="sm"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}