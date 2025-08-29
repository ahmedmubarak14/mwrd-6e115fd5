import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Download, 
  X, 
  Zap, 
  Wifi, 
  Bell,
  Share,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePWA } from '@/hooks/usePWA';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface PWAInstallPromptProps {
  className?: string;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ className }) => {
  const { 
    canInstall, 
    installPWA, 
    isOnline, 
    getDeviceInfo 
  } = usePWA();
  
  const [dismissed, setDismissed] = useLocalStorage('pwa-install-dismissed', false);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [deviceInfo] = useState(getDeviceInfo());

  // Show prompt after delay if installable and not dismissed
  useEffect(() => {
    if (canInstall && !dismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [canInstall, dismissed]);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const installed = await installPWA();
      if (installed) {
        setIsVisible(false);
        setDismissed(true);
      }
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
  };

  if (!isVisible || !canInstall || dismissed) {
    return null;
  }

  return (
    <div className={cn(
      "fixed bottom-4 left-4 right-4 z-50 animate-slide-in-bottom",
      "md:bottom-6 md:left-6 md:right-auto md:max-w-sm",
      className
    )}>
      <Card className="shadow-lg border-primary/20">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Install MWRD App</h3>
                <p className="text-xs text-muted-foreground">
                  Get the full experience
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-6 w-6 -mt-1 -mr-1"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center gap-2 text-xs">
              <Zap className="h-3 w-3 text-green-500" />
              <span>Faster loading</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Wifi className="h-3 w-3 text-blue-500" />
              <span>Offline access</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Bell className="h-3 w-3 text-orange-500" />
              <span>Push notifications</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Shield className="h-3 w-3 text-purple-500" />
              <span>More secure</span>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex gap-2 mb-4">
            <Badge variant={isOnline ? "default" : "secondary"} className="text-xs">
              {isOnline ? "Online" : "Offline"}
            </Badge>
            {deviceInfo.isMobile && (
              <Badge variant="outline" className="text-xs">
                Mobile Optimized
              </Badge>
            )}
          </div>

          {/* Install button */}
          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-1 h-9 text-sm"
              size="sm"
            >
              {isInstalling ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                  Installing...
                </>
              ) : (
                <>
                  <Download className="h-3 w-3 mr-2" />
                  Install App
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="h-9 px-3"
            >
              Later
            </Button>
          </div>

          {/* Additional info */}
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Free • No app store required • {Math.round(2.1)}MB
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Compact version for headers
export const PWAInstallButton: React.FC<{ className?: string }> = ({ className }) => {
  const { canInstall, installPWA } = usePWA();
  const [dismissed] = useLocalStorage('pwa-install-dismissed', false);
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await installPWA();
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  if (!canInstall || dismissed) {
    return null;
  }

  return (
    <Button
      onClick={handleInstall}
      disabled={isInstalling}
      variant="outline"
      size="sm"
      className={cn("gap-2", className)}
    >
      {isInstalling ? (
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
      ) : (
        <Download className="h-3 w-3" />
      )}
      Install
    </Button>
  );
};