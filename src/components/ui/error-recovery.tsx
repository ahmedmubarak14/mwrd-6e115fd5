import React, { useState } from 'react';
import { AlertCircle, RefreshCw, Home, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export interface ErrorRecoveryProps {
  error: Error | string;
  onRetry?: () => void | Promise<void>;
  onGoHome?: () => void;
  title?: string;
  description?: string;
  showDetails?: boolean;
  variant?: 'default' | 'minimal' | 'inline';
  className?: string;
}

export const ErrorRecovery: React.FC<ErrorRecoveryProps> = ({
  error,
  onRetry,
  onGoHome,
  title = "Something went wrong",
  description = "An error occurred while loading this content. Please try again.",
  showDetails = false,
  variant = 'default',
  className
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const { toast } = useToast();

  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'object' ? error.stack : undefined;

  const handleRetry = async () => {
    if (!onRetry) return;
    
    setIsRetrying(true);
    try {
      await onRetry();
      toast({
        title: "Success",
        description: "Content has been refreshed successfully.",
      });
    } catch (retryError) {
      toast({
        title: "Retry Failed",
        description: "Unable to refresh content. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsRetrying(false);
    }
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  // Minimal inline variant
  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-muted-foreground p-2", className)}>
        <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
        <span className="flex-1">Unable to load content</span>
        {onRetry && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRetry}
            disabled={isRetrying}
            className="h-6 px-2 text-xs"
          >
            {isRetrying ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              "Retry"
            )}
          </Button>
        )}
      </div>
    );
  }

  // Inline variant for components
  if (variant === 'inline') {
    return (
      <div className={cn("border border-destructive/20 bg-destructive/5 rounded-lg p-4", className)}>
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-destructive">{title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
            
            {showDetails && (
              <div className="mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowErrorDetails(!showErrorDetails)}
                  className="text-xs h-6 px-2 text-muted-foreground hover:text-foreground"
                >
                  <HelpCircle className="h-3 w-3 mr-1" />
                  {showErrorDetails ? "Hide" : "Show"} Details
                  {showErrorDetails ? (
                    <ChevronUp className="h-3 w-3 ml-1" />
                  ) : (
                    <ChevronDown className="h-3 w-3 ml-1" />
                  )}
                </Button>
                
                {showErrorDetails && (
                  <div className="mt-2 p-2 bg-muted rounded text-xs font-mono text-muted-foreground break-all">
                    {errorMessage}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            {onRetry && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleRetry}
                disabled={isRetrying}
                className="h-7 px-3 text-xs"
              >
                {isRetrying ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Retry
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default full card variant
  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-destructive/10 rounded-full">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="text-sm">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex gap-2 justify-center">
            {onRetry && (
              <Button 
                onClick={handleRetry} 
                disabled={isRetrying}
                className="flex items-center gap-2"
              >
                {isRetrying ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {isRetrying ? "Retrying..." : "Try Again"}
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={handleGoHome}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </div>
          
          {showDetails && process.env.NODE_ENV === 'development' && (
            <details className="text-left bg-muted p-3 rounded text-xs">
              <summary className="cursor-pointer font-medium mb-2 flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Error Details (Development Only)
              </summary>
              <div className="space-y-2 mt-2">
                <div>
                  <Badge variant="destructive" className="text-xs mb-1">Error Message</Badge>
                  <pre className="whitespace-pre-wrap break-all bg-background p-2 rounded">
                    {errorMessage}
                  </pre>
                </div>
                {errorStack && (
                  <div>
                    <Badge variant="outline" className="text-xs mb-1">Stack Trace</Badge>
                    <pre className="whitespace-pre-wrap break-all bg-background p-2 rounded text-xs">
                      {errorStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Hook for error handling with automatic retry
export const useErrorRecovery = (retryFn?: () => Promise<void>) => {
  const [error, setError] = useState<Error | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const handleError = (error: Error | string) => {
    setError(typeof error === 'string' ? new Error(error) : error);
  };
  
  const retry = async () => {
    if (!retryFn) return;
    
    setIsRetrying(true);
    try {
      await retryFn();
      setError(null);
    } catch (retryError) {
      setError(retryError instanceof Error ? retryError : new Error('Retry failed'));
    } finally {
      setIsRetrying(false);
    }
  };
  
  const clearError = () => setError(null);
  
  return {
    error,
    isRetrying,
    handleError,
    retry,
    clearError,
    hasError: !!error
  };
};