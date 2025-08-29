import { useState, useEffect, useCallback } from 'react';

interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  // Check if PWA is already installed
  useEffect(() => {
    const checkInstallStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      const isAndroidPWA = document.referrer.includes('android-app://');
      
      setIsInstalled(isStandalone || isInWebAppiOS || isAndroidPWA);
    };

    checkInstallStatus();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkInstallStatus);

    return () => mediaQuery.removeEventListener('change', checkInstallStatus);
  }, []);

  // Handle beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      console.log('PWA: Install prompt available');
      
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      event.preventDefault();
      
      // Stash the event so it can be triggered later
      setDeferredPrompt(event);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA: App was installed');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      console.log('PWA: Back online');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('PWA: Gone offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle service worker updates
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('PWA: Service Worker updated');
        setIsUpdateAvailable(true);
      });

      // Check for updates periodically
      const checkForUpdates = () => {
        navigator.serviceWorker.getRegistration().then(registration => {
          if (registration) {
            registration.update();
          }
        });
      };

      const updateInterval = setInterval(checkForUpdates, 60000); // Check every minute

      return () => clearInterval(updateInterval);
    }
  }, []);

  // Install PWA
  const installPWA = useCallback(async () => {
    if (!deferredPrompt) {
      console.log('PWA: No install prompt available');
      return false;
    }

    try {
      // Show the install prompt
      await deferredPrompt.prompt();
      
      // Wait for user response
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA: User accepted install prompt');
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      } else {
        console.log('PWA: User dismissed install prompt');
        return false;
      }
    } catch (error) {
      console.error('PWA: Install failed:', error);
      return false;
    }
  }, [deferredPrompt]);

  // Update PWA
  const updatePWA = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration && registration.waiting) {
          // Send message to service worker to skip waiting
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          
          // Reload page to use new service worker
          window.location.reload();
        }
      });
    }
  }, []);

  // Share API
  const shareContent = useCallback(async (data: {
    title?: string;
    text?: string;
    url?: string;
  }) => {
    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.error('PWA: Share failed:', error);
        return false;
      }
    } else {
      // Fallback to clipboard
      if (navigator.clipboard && data.url) {
        try {
          await navigator.clipboard.writeText(data.url);
          return true;
        } catch (error) {
          console.error('PWA: Clipboard write failed:', error);
          return false;
        }
      }
      return false;
    }
  }, []);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  // Show notification
  const showNotification = useCallback(async (title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const notification = new Notification(title, {
          icon: '/lovable-uploads/9a6215a4-31ff-4f7d-a55b-1cbecc47ec33.png',
          badge: '/lovable-uploads/9a6215a4-31ff-4f7d-a55b-1cbecc47ec33.png',
          ...options
        });
        
        return notification;
      } catch (error) {
        console.error('PWA: Notification failed:', error);
        return null;
      }
    }
    return null;
  }, []);

  // Get device info
  const getDeviceInfo = useCallback(() => {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;
    
    return {
      isMobile,
      isTablet,
      isDesktop,
      platform: navigator.platform,
      userAgent,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine
    };
  }, []);

  return {
    // Installation
    isInstallable,
    isInstalled,
    installPWA,
    
    // Updates
    isUpdateAvailable,
    updatePWA,
    
    // Network
    isOnline,
    
    // Features
    shareContent,
    requestNotificationPermission,
    showNotification,
    getDeviceInfo,
    
    // Capabilities
    canInstall: isInstallable && !isInstalled,
    canShare: 'share' in navigator,
    canNotify: 'Notification' in window,
    hasServiceWorker: 'serviceWorker' in navigator
  };
};