import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";
import { MobileHeader } from "./MobileHeader";
import { MobileStatusBar } from "./MobileStatusBar";
import { InstallPrompt } from "./InstallPrompt";
import { OfflineIndicator } from "./OfflineIndicator";
import { useMobileDetection, usePWA } from "@/hooks/useMobileDetection";
import { useCapacitor } from "@/hooks/useCapacitor";
import { cn } from "@/lib/utils";
import { 
  Wifi, 
  WifiOff, 
  Smartphone, 
  Download,
  CheckCircle 
} from "lucide-react";

interface MobileAppShellProps {
  children?: React.ReactNode;
}

export const MobileAppShell = ({ children }: MobileAppShellProps) => {
  const location = useLocation();
  const { isMobile, isTablet, orientation, screenSize } = useMobileDetection();
  const { isInstalled, isInstallable, installApp } = usePWA();
  const { isNative, networkStatus, triggerHaptic } = useCapacitor();
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    if (networkStatus) {
      setShowOfflineMessage(!networkStatus.connected);
    }
  }, [networkStatus]);

  const handleInstallClick = async () => {
    await triggerHaptic();
    const installed = await installApp();
    if (installed) {
      console.log('App installed successfully');
    }
  };

  // Mobile-specific routes that need full app shell
  const needsBottomNav = isMobile && ![
    '/login', '/register', '/forgot-password', '/reset-password'
  ].includes(location.pathname);

  const needsHeader = !isNative || isMobile;

  if (!isMobile && !isTablet) {
    // Desktop - return children without mobile shell
    return <>{children || <Outlet />}</>;
  }

  return (
    <div className={cn(
      "min-h-screen bg-background flex flex-col",
      "mobile-app-shell",
      orientation === 'landscape' && isMobile && "landscape-mode"
    )}>
      {/* Status Bar (native only) */}
      {isNative && <MobileStatusBar />}

      {/* Offline Indicator */}
      <OfflineIndicator 
        isOffline={showOfflineMessage}
        onDismiss={() => setShowOfflineMessage(false)}
      />

      {/* Install Prompt */}
      {!isNative && isInstallable && (
        <InstallPrompt onInstall={handleInstallClick} />
      )}

      {/* Mobile Header */}
      {needsHeader && (
        <MobileHeader />
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-auto",
        needsBottomNav && "pb-16", // Space for bottom nav
        "safe-area-padding"
      )}>
        {children || <Outlet />}
      </main>

      {/* Bottom Navigation */}
      {needsBottomNav && (
        <MobileBottomNav />
      )}

      {/* Development Tools (only in dev mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          <Card className="p-2 text-xs">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone className="h-3 w-3" />
              <span>Mobile Debug</span>
            </div>
            <div className="space-y-1">
              <div>Platform: {isNative ? 'Native' : 'Web'}</div>
              <div>Size: {screenSize}</div>
              <div>Orientation: {orientation}</div>
              <div className="flex items-center gap-1">
                {networkStatus?.connected ? (
                  <><Wifi className="h-3 w-3 text-green-600" /> Online</>
                ) : (
                  <><WifiOff className="h-3 w-3 text-red-600" /> Offline</>
                )}
              </div>
              {!isNative && (
                <div className="flex items-center gap-1">
                  {isInstalled ? (
                    <><CheckCircle className="h-3 w-3 text-green-600" /> Installed</>
                  ) : isInstallable ? (
                    <><Download className="h-3 w-3 text-blue-600" /> Installable</>
                  ) : (
                    <span className="text-gray-500">Not installable</span>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};