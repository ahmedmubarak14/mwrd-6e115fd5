
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class AdminErrorBoundary extends Component<Props, State> {
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
    console.error('Admin Dashboard Error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <AdminErrorFallback 
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

// Functional component for error display to use hooks
const AdminErrorFallback: React.FC<{
  error?: Error;
  errorInfo?: ErrorInfo;
  onReset: () => void;
}> = ({ error, errorInfo, onReset }) => {
  const { t } = useOptionalLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">{t('admin.errors.title')}</CardTitle>
          </div>
          <CardDescription>
            {t('admin.errors.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && error && (
            <div className="bg-muted p-3 rounded text-sm font-mono text-xs overflow-auto max-h-40">
              <div className="font-semibold mb-2">{t('admin.errors.details')}</div>
              <div>{error.message}</div>
              {errorInfo && (
                <div className="mt-2">
                  <div className="font-semibold">{t('admin.errors.stackTrace')}</div>
                  <pre className="whitespace-pre-wrap">{errorInfo.componentStack}</pre>
                </div>
              )}
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={onReset} variant="outline" className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('admin.errors.tryAgain')}
            </Button>
            <Button onClick={() => window.location.reload()} className="flex-1">
              {t('admin.errors.refreshPage')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
