import { ComprehensiveAdminOverview } from '@/components/admin/ComprehensiveAdminOverview';
import { TestRunner } from '@/components/testing/TestRunner';
import { PerformanceDashboard } from '@/components/performance/PerformanceDashboard';
import { TestingDashboard } from '@/components/testing/TestingDashboard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, TestTube, Activity } from 'lucide-react';

export const AdminDashboard = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
          {t('admin.dashboard')}
        </h1>
        <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
          {t('admin.dashboardData.description')}
        </p>
      </div>

      {/* System Overview */}
      <ComprehensiveAdminOverview />

      {/* System Health & Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            System Health & Quality Monitoring
          </CardTitle>
          <CardDescription>
            Real-time performance monitoring, automated testing, and quality assurance tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="performance" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="testing" className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Testing Suite
              </TabsTrigger>
              <TabsTrigger value="quality" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Quality Checks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-4">
              <PerformanceDashboard />
            </TabsContent>

            <TabsContent value="testing" className="space-y-4">
              <TestRunner />
            </TabsContent>

            <TabsContent value="quality" className="space-y-4">
              <TestingDashboard />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};