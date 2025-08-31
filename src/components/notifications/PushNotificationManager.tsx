import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, BellOff, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToastFeedback } from "@/hooks/useToastFeedback";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface NotificationSettings {
  messages: boolean;
  offers: boolean;
  requests: boolean;
  marketing: boolean;
}

export const PushNotificationManager = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToastFeedback();
  const { t, isRTL } = useLanguage();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [settings, setSettings] = useState<NotificationSettings>({
    messages: true,
    offers: true,
    requests: true,
    marketing: false,
  });

  useEffect(() => {
    // Check if Push notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }

    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      showError(t("admin.pushNotifications.notSupportedError"));
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === "granted") {
        showSuccess(t("admin.pushNotifications.enabledSuccess"));
        // In a real app, you would register a service worker here
        // and send the subscription to your backend
      } else {
        showError(t("admin.pushNotifications.permissionDenied"));
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      showError(t("admin.pushNotifications.enableFailed"));
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('notification-settings', JSON.stringify(newSettings));
  };

  const sendTestNotification = () => {
    if (permission === "granted") {
      new Notification(t("admin.pushNotifications.testNotificationTitle"), {
        body: t("admin.pushNotifications.testNotificationBody"),
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "test",
      });
      showSuccess(t("admin.pushNotifications.testNotificationSent"));
    } else {
      showError(t("admin.pushNotifications.enableFirst"));
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            {t("admin.pushNotifications.notSupported")}
          </CardTitle>
          <CardDescription>
            {t("admin.pushNotifications.notSupportedDesc")}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t("admin.pushNotifications.title")}
          </CardTitle>
          <CardDescription>
            {t("admin.pushNotifications.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {permission === "default" && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm mb-3">
                {t("admin.pushNotifications.enablePrompt")}
              </p>
              <Button onClick={requestPermission}>
                <Bell className="h-4 w-4 mr-2" />
                {t("admin.pushNotifications.enableButton")}
              </Button>
            </div>
          )}

          {permission === "denied" && (
            <div className="p-4 bg-destructive/10 rounded-lg">
              <p className="text-sm text-destructive">
                {t("admin.pushNotifications.blockedMessage")}
              </p>
            </div>
          )}

          {permission === "granted" && (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-primary font-medium">
                  ✓ {t("admin.pushNotifications.enabledMessage")}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  {t("admin.pushNotifications.settingsTitle")}
                </h4>
                
                <div className="space-y-3">
                  <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                    <Label htmlFor="messages" className="font-normal">
                      {t("admin.pushNotifications.newMessages")}
                    </Label>
                    <Switch
                      id="messages"
                      checked={settings.messages}
                      onCheckedChange={(checked) => updateSetting('messages', checked)}
                    />
                  </div>

                  <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                    <Label htmlFor="offers" className="font-normal">
                      {t("admin.pushNotifications.newOffers")}
                    </Label>
                    <Switch
                      id="offers"
                      checked={settings.offers}
                      onCheckedChange={(checked) => updateSetting('offers', checked)}
                    />
                  </div>

                  <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                    <Label htmlFor="requests" className="font-normal">
                      {t("admin.pushNotifications.requestUpdates")}
                    </Label>
                    <Switch
                      id="requests"
                      checked={settings.requests}
                      onCheckedChange={(checked) => updateSetting('requests', checked)}
                    />
                  </div>

                  <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                    <Label htmlFor="marketing" className="font-normal">
                      {t("admin.pushNotifications.marketingUpdates")}
                    </Label>
                    <Switch
                      id="marketing"
                      checked={settings.marketing}
                      onCheckedChange={(checked) => updateSetting('marketing', checked)}
                    />
                  </div>
                </div>
              </div>

              <Button variant="outline" onClick={sendTestNotification}>
                {t("admin.pushNotifications.sendTestButton")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};