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

      <Tabs defaultValue="monitor" className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 w-full gap-1">
          <TabsTrigger value="monitor" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-4">
            <Monitor className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Live Monitor</span>
            <span className="sm:hidden">Live</span>
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-4">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Overview</span>
            <span className="sm:hidden">Home</span>
          </TabsTrigger>
          <TabsTrigger value="incidents" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-4">
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Incidents</span>
            <span className="sm:hidden">Issues</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-4">
            <Database className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Audit Trail</span>
            <span className="sm:hidden">Audit</span>
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-4">
            <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">System Health</span>
            <span className="sm:hidden">Health</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-4">
            <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Compliance</span>
            <span className="sm:hidden">Rules</span>
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
  );
};

export default AdminSecurity;