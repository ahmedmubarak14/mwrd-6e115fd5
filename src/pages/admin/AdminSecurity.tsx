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
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";

const AdminSecurity = () => {
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  return (
    <AdminPageContainer
      title="Security & Monitoring Center"
      description="Comprehensive security analytics, compliance monitoring, and system health oversight"
    >

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
    </AdminPageContainer>
  );
};

export default AdminSecurity;