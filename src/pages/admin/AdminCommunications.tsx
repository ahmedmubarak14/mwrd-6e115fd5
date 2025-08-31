import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Bell, Mail, Smartphone, Settings, Users } from "lucide-react";
import { NotificationCenter } from "@/components/admin/NotificationCenter";
import { EmailCampaignManager } from "@/components/admin/EmailCampaignManager";
import { RealTimeChatSystem } from "@/components/admin/RealTimeChatSystem";
import { PushNotificationManager } from "@/components/admin/PushNotificationManager";
import { CommunicationSettings } from "@/components/admin/CommunicationSettings";
import { CommunicationOverview } from "@/components/admin/CommunicationOverview";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { cn } from "@/lib/utils";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";

const AdminCommunications = () => {
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  return (
    <AdminPageContainer>
      <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className={cn(isRTL ? "text-right" : "text-left")}>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            {t('admin.communicationCenter')}
          </h1>
          <p className="text-muted-foreground">
            {t('admin.communicationCenterDescription')}
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
            <TabsTrigger value="overview" className="flex items-center gap-1 md:gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">{t('common.overview')}</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1 md:gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">{t('admin.notifications')}</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-1 md:gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">{t('common.liveChat')}</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-1 md:gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">{t('common.email')}</span>
            </TabsTrigger>
            <TabsTrigger value="push" className="flex items-center gap-1 md:gap-2">
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">{t('common.push')}</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1 md:gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">{t('common.settings')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <CommunicationOverview />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationCenter />
          </TabsContent>

          <TabsContent value="chat">
            <RealTimeChatSystem />
          </TabsContent>

          <TabsContent value="email">
            <EmailCampaignManager />
          </TabsContent>

          <TabsContent value="push">
            <PushNotificationManager />
          </TabsContent>

          <TabsContent value="settings">
            <CommunicationSettings />
          </TabsContent>
        </Tabs>
      </div>
    </AdminPageContainer>
  );
};

export default AdminCommunications;