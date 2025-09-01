import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";

interface ErrorStateProps {
  title?: string;
  description?: string;
  variant?: 'error' | 'not-found' | 'network' | 'permission';
  onRetry?: () => void;
  showHomeButton?: boolean;
  showBackButton?: boolean;
}

export const ErrorState = ({ 
  title,
  description,
  variant = 'error',
  onRetry,
  showHomeButton = true,
  showBackButton = false
}: ErrorStateProps) => {
  const navigate = useNavigate();
  const languageContext = useOptionalLanguage();
  const { t } = languageContext || { t: (key: string) => key };

  const getVariantStyles = () => {
    switch (variant) {
      case 'not-found':
        return {
          title: title || t('common.notFound') || 'Page Not Found',
          description: description || 'The page you are looking for does not exist.',
          icon: AlertTriangle,
          iconClass: 'text-muted-foreground'
        };
      case 'network':
        return {
          title: title || t('common.errors.networkConnection') || 'Network Error',
          description: description || 'Please check your internet connection and try again.',
          icon: RefreshCw,
          iconClass: 'text-warning'
        };
      case 'permission':
        return {
          title: title || t('common.accessDenied') || 'Access Denied',
          description: description || 'You do not have permission to access this resource.',
          icon: AlertTriangle,
          iconClass: 'text-destructive'
        };
      default:
        return {
          title: title || t('common.error') || 'Something went wrong',
          description: description || 'An unexpected error occurred. Please try again.',
          icon: AlertTriangle,
          iconClass: 'text-destructive'
        };
    }
  };

  const variantConfig = getVariantStyles();
  const Icon = variantConfig.icon;

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-muted">
            <Icon className={`w-6 h-6 ${variantConfig.iconClass}`} />
          </div>
          <CardTitle className="text-lg font-semibold">
            {variantConfig.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground text-sm">
            {variantConfig.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            {onRetry && (
              <Button onClick={onRetry} className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                {t('common.retry') || 'Try Again'}
              </Button>
            )}
            
            {showBackButton && (
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('common.back') || 'Go Back'}
              </Button>
            )}
            
            {showHomeButton && (
              <Button 
                variant={onRetry ? "outline" : "default"}
                onClick={() => navigate('/vendor/dashboard')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                {t('nav.dashboard') || 'Dashboard'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};