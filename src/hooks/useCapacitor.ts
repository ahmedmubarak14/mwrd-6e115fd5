import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Network, ConnectionStatus } from '@capacitor/network';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { createLogger } from '@/utils/logger';

export interface CapacitorState {
  isNative: boolean;
  platform: string;
  networkStatus: ConnectionStatus | null;
  pushToken: string | null;
}

export const useCapacitor = () => {
  const [state, setState] = useState<CapacitorState>({
    isNative: false,
    platform: 'web',
    networkStatus: null,
    pushToken: null
  });
  const logger = createLogger('useCapacitor');

  useEffect(() => {
    const initCapacitor = async () => {
      const isNative = Capacitor.isNativePlatform();
      const platform = Capacitor.getPlatform();

      setState(prev => ({ ...prev, isNative, platform }));

      // Initialize network monitoring
      const networkStatus = await Network.getStatus();
      setState(prev => ({ ...prev, networkStatus }));

      Network.addListener('networkStatusChange', (status) => {
        setState(prev => ({ ...prev, networkStatus: status }));
      });

      // Initialize push notifications (native only)
      if (isNative) {
        await initPushNotifications();
        await initStatusBar();
        await SplashScreen.hide();
      }
    };

    initCapacitor();

    return () => {
      Network.removeAllListeners();
      if (Capacitor.isNativePlatform()) {
        PushNotifications.removeAllListeners();
      }
    };
  }, []);

  const initPushNotifications = async () => {
    try {
      // Request permission
      const result = await PushNotifications.requestPermissions();
      
      if (result.receive === 'granted') {
        // Register for push notifications
        await PushNotifications.register();

        // Handle registration
        PushNotifications.addListener('registration', (token: Token) => {
          setState(prev => ({ ...prev, pushToken: token.value }));
          logger.info('Push registration success:', { tokenLength: token.value.length });
        });

        // Handle registration error
        PushNotifications.addListener('registrationError', (error: any) => {
          logger.error('Push registration error:', { error });
        });

        // Handle push notification received
        PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
          logger.info('Push notification received:', { title: notification.title });
        });

        // Handle push notification action
        PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
          logger.info('Push notification action performed:', { actionId: notification.actionId });
        });
      }
    } catch (error) {
      logger.error('Push notification setup failed:', { error });
    }
  };

  const initStatusBar = async () => {
    try {
      await StatusBar.setStyle({ style: Style.Default });
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
      await StatusBar.show();
    } catch (error) {
      logger.error('Status bar setup failed:', { error });
    }
  };

  const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style });
      } catch (error) {
        logger.error('Haptic feedback failed:', { error });
      }
    }
  };

  const setStatusBarStyle = async (style: Style) => {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.setStyle({ style });
      } catch (error) {
        logger.error('Status bar style change failed:', { error });
      }
    }
  };

  return {
    ...state,
    triggerHaptic,
    setStatusBarStyle
  };
};