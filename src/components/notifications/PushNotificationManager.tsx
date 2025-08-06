import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, BellOff, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToastFeedback } from "@/hooks/useToastFeedback";

interface NotificationSettings {
  messages: boolean;
  offers: boolean;
  requests: boolean;
  marketing: boolean;
}

export const PushNotificationManager = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToastFeedback();
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
      showError("Push notifications are not supported in this browser");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === "granted") {
        showSuccess("Push notifications enabled successfully!");
        // In a real app, you would register a service worker here
        // and send the subscription to your backend
      } else {
        showError("Push notifications permission denied");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      showError("Failed to enable push notifications");
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('notification-settings', JSON.stringify(newSettings));
  };

  const sendTestNotification = () => {
    if (permission === "granted") {
      new Notification("Supplify Test Notification", {
        body: "This is a test notification to verify everything is working!",
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "test",
      });
      showSuccess("Test notification sent!");
    } else {
      showError("Please enable notifications first");
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Push Notifications Not Supported
          </CardTitle>
          <CardDescription>
            Your browser doesn't support push notifications.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Get notified about important updates even when the app is closed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {permission === "default" && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm mb-3">
                Enable push notifications to stay updated with messages, offers, and important updates.
              </p>
              <Button onClick={requestPermission}>
                <Bell className="h-4 w-4 mr-2" />
                Enable Notifications
              </Button>
            </div>
          )}

          {permission === "denied" && (
            <div className="p-4 bg-destructive/10 rounded-lg">
              <p className="text-sm text-destructive">
                Notifications are blocked. Please enable them in your browser settings.
              </p>
            </div>
          )}

          {permission === "granted" && (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-primary font-medium">
                  ✓ Push notifications are enabled
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Notification Settings
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="messages" className="font-normal">
                      New Messages
                    </Label>
                    <Switch
                      id="messages"
                      checked={settings.messages}
                      onCheckedChange={(checked) => updateSetting('messages', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="offers" className="font-normal">
                      New Offers
                    </Label>
                    <Switch
                      id="offers"
                      checked={settings.offers}
                      onCheckedChange={(checked) => updateSetting('offers', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="requests" className="font-normal">
                      Request Updates
                    </Label>
                    <Switch
                      id="requests"
                      checked={settings.requests}
                      onCheckedChange={(checked) => updateSetting('requests', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="marketing" className="font-normal">
                      Marketing & Updates
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
                Send Test Notification
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};