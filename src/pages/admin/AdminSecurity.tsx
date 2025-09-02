import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertTriangle, Activity, Users, Database, Lock, Monitor } from "lucide-react";
import { SecurityDashboard } from "@/components/admin/SecurityDashboard";
import { AuditTrailDashboard } from "@/components/admin/AuditTrailDashboard";
import { SystemHealthMonitor } from "@/components/admin/SystemHealthMonitor";
import { SecurityIncidentManager } from "@/components/admin/SecurityIncidentManager";
import { SecurityComplianceCenter } from "@/components/admin/SecurityComplianceCenter";
import { RealTimeSecurityMonitor } from "@/components/admin/RealTimeSecurityMonitor";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";

const AdminSecurity = () => {
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <AdminPageContainer
        title={t('admin.security.title')}
        description={t('admin.security.description')}
      >

        <Tabs defaultValue="monitor" className="space-y-6">
          <TabsList className={cn(
            "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 w-full gap-1",
            isRTL && "flex-row-reverse"
          )}>
            <TabsTrigger value="monitor" className={cn(
              "flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-4",
              isRTL && "flex-row-reverse"
            )}>
              <Monitor className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{t('admin.security.liveMonitor')}</span>
              <span className="sm:hidden">{t('admin.security.liveMonitor')}</span>
            </TabsTrigger>
            <TabsTrigger value="overview" className={cn(
              "flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-4",
              isRTL && "flex-row-reverse"
            )}>
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{t('admin.security.overview')}</span>
              <span className="sm:hidden">{t('admin.security.overview')}</span>
            </TabsTrigger>
            <TabsTrigger value="incidents" className={cn(
              "flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-4",
              isRTL && "flex-row-reverse"
            )}>
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{t('admin.security.incidents')}</span>
              <span className="sm:hidden">{t('admin.security.incidents')}</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className={cn(
              "flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-4",
              isRTL && "flex-row-reverse"
            )}>
              <Database className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{t('admin.security.auditTrail')}</span>
              <span className="sm:hidden">{t('admin.security.auditTrail')}</span>
            </TabsTrigger>
            <TabsTrigger value="health" className={cn(
              "flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-4",
              isRTL && "flex-row-reverse"
            )}>
              <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{t('admin.security.systemHealth')}</span>
              <span className="sm:hidden">{t('admin.security.systemHealth')}</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className={cn(
              "flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-4",
              isRTL && "flex-row-reverse"
            )}>
              <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{t('admin.security.compliance')}</span>
              <span className="sm:hidden">{t('admin.security.compliance')}</span>
            </TabsTrigger>
          </TabsList>

        <TabsContent value="monitor">
          <RealTimeSecurityMonitor />
        </TabsContent>

        <TabsContent value="overview">
          <SecurityDashboard />
        </TabsContent>

        <TabsContent value="incidents">
          <SecurityIncidentManager />
        </TabsContent>

        <TabsContent value="audit">
          <AuditTrailDashboard />
        </TabsContent>

        <TabsContent value="health">
          <SystemHealthMonitor />
        </TabsContent>

        <TabsContent value="compliance">
          <SecurityComplianceCenter />
        </TabsContent>
      </Tabs>
      </AdminPageContainer>
    </div>
  );
};

export default AdminSecurity;