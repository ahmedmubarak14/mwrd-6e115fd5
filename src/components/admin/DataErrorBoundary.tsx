import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Database, Wifi } from 'lucide-react';
import { toast } from 'sonner';
import { getTranslation } from '@/constants/translations';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  title?: string;
  description?: string;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

export class DataErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Data Error Boundary caught an error:', error, errorInfo);
    
    // Get current language from localStorage or default to 'en'
    const currentLanguage = localStorage.getItem('language') as 'en' | 'ar' || 'en';
    
    // Track error patterns for better UX
    if (error.message.includes('fetch') || error.message.includes('network')) {
      toast.error(getTranslation('common.errors.networkConnection', currentLanguage));
    } else if (error.message.includes('timeout')) {
      toast.error(getTranslation('common.errors.requestTimeout', currentLanguage));
    } else {
      toast.error(getTranslation('common.errors.dataLoading', currentLanguage));
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    const { onRetry } = this.props;
    const newRetryCount = this.state.retryCount + 1;
    
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      retryCount: newRetryCount
    });
    
    if (onRetry) {
      onRetry();
    }
    
    toast.info(`Retrying... (Attempt ${newRetryCount})`);
  };

  getErrorType = () => {
    const { error } = this.state;
    if (!error) return 'unknown';
    
    const message = error.message.toLowerCase();
    if (message.includes('fetch') || message.includes('network')) return 'network';
    if (message.includes('timeout')) return 'timeout';
    if (message.includes('parse') || message.includes('json')) return 'parse';
    if (message.includes('permission') || message.includes('unauthorized')) return 'permission';
    return 'unknown';
  };

  getErrorIcon = () => {
    const errorType = this.getErrorType();
    switch (errorType) {
      case 'network':
        return <Wifi className="h-6 w-6 text-destructive" />;
      case 'permission':
        return <AlertTriangle className="h-6 w-6 text-destructive" />;  
      default:
        return <Database className="h-6 w-6 text-destructive" />;
    }
  };

  getErrorMessage = () => {
    const errorType = this.getErrorType();
    const { title = 'Data Loading Error', description } = this.props;
    
    if (description) return { title, description };
    
    switch (errorType) {
      case 'network':
        return {
          title: 'Connection Error',
          description: 'Unable to connect to the server. Please check your internet connection and try again.'
        };
      case 'timeout':
        return {
          title: 'Request Timeout',
          description: 'The request took too long to complete. Please try again.'
        };
      case 'permission':
        return {
          title: 'Access Denied',
          description: 'You do not have permission to access this data. Please contact your administrator.'
        };
      case 'parse':
        return {
          title: 'Data Format Error',
          description: 'The server returned invalid data. Please try again or contact support.'
        };
      default:
        return {
          title,
          description: 'An unexpected error occurred while loading data. Please try again.'
        };
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { title, description } = this.getErrorMessage();
      const errorIcon = this.getErrorIcon();
      const { retryCount } = this.state;

      return (
        <Card className="max-w-lg mx-auto mt-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              {errorIcon}
              <div>
                <CardTitle className="text-destructive">{title}</CardTitle>
                <CardDescription className="mt-1">
                  {description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-muted p-3 rounded text-sm font-mono text-xs overflow-auto max-h-32">
                <div className="font-semibold mb-1 text-destructive">Debug Info:</div>
                <div className="text-muted-foreground">{this.state.error.message}</div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={this.handleRetry} 
                variant="outline" 
                className="flex-1"
                disabled={retryCount >= 3}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {retryCount >= 3 ? 'Max Retries Reached' : 'Try Again'}
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                className="flex-1"
              >
                Refresh Page
              </Button>
            </div>
            
            {retryCount > 0 && (
              <p className="text-xs text-muted-foreground text-center">
                Retry attempts: {retryCount}/3
              </p>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}