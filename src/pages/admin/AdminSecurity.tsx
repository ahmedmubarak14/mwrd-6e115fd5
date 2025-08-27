import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertTriangle, Activity, Users, Database, Lock } from "lucide-react";
import { SecurityDashboard } from "@/components/admin/SecurityDashboard";
import { AuditTrailDashboard } from "@/components/admin/AuditTrailDashboard";
import { SystemHealthMonitor } from "@/components/admin/SystemHealthMonitor";
import { SecurityIncidentManager } from "@/components/admin/SecurityIncidentManager";
import { SecurityComplianceCenter } from "@/components/admin/SecurityComplianceCenter";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { cn } from "@/lib/utils";

const AdminSecurity = () => {
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={cn(isRTL ? "text-right" : "text-left")}>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          Security & Monitoring Center
        </h1>
        <p className="text-muted-foreground">
          Comprehensive security analytics, compliance monitoring, and system health oversight
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="incidents" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Incidents
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Audit Trail
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            System Health
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Compliance
          </TabsTrigger>
        </TabsList>

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
    </div>
  );
};

export default AdminSecurity;