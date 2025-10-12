import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Smartphone, 
  Monitor, 
  Zap,
  Shield,
  Eye
} from 'lucide-react';
import { TestingAndRefinementSuite, type TestResult } from '@/utils/testingAndRefinement';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export const TestingDashboard = () => {
  const { t, isRTL } = useLanguage();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const { isMobile, isTablet, screenSize, orientation } = useMobileDetection();

  const runTests = async () => {
    setIsRunning(true);
    const tester = new TestingAndRefinementSuite();
    
    try {
      const results = await tester.runAllTests();
      setTestResults(results);
      setLastRun(new Date());
    } catch (error) {
      console.error('Failed to run tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getTestsByCategory = (category: string) => {
    const categoryMap: Record<string, string[]> = {
      mobile: ['Viewport Meta Tag', 'Mobile Navigation', 'Touch Target Size'],
      pwa: ['Web App Manifest', 'Service Worker Support', 'Service Worker Registration'],
      performance: ['First Contentful Paint', 'Largest Contentful Paint', 'Script Count'],
      accessibility: ['Image Alt Text', 'Heading Structure', 'Focusable Elements']
    };
    
    return testResults.filter(result => 
      categoryMap[category]?.includes(result.test)
    );
  };

  const getOverallScore = () => {
    if (testResults.length === 0) return 0;
    const passed = testResults.filter(r => r.status === 'pass').length;
    return Math.round((passed / testResults.length) * 100);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      pass: 'default' as const,
      warning: 'secondary' as const,
      fail: 'destructive' as const
    };

    return (
      <Badge variant={variants[status]} className="text-xs">
        {status.toUpperCase()}
      </Badge>
    );
  };

  const DeviceInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isMobile ? <Smartphone className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
          {t('admin.testingDashboard.currentDevice')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>{t('admin.testingDashboard.deviceType')}:</span>
          <Badge variant="outline">
            {isMobile ? t('admin.testingDashboard.mobile') : isTablet ? t('admin.testingDashboard.tablet') : t('admin.testingDashboard.desktop')}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span>{t('admin.testingDashboard.screenSize')}:</span>
          <Badge variant="outline">{screenSize.toUpperCase()}</Badge>
        </div>
        <div className="flex justify-between">
          <span>{t('admin.testingDashboard.orientation')}:</span>
          <Badge variant="outline">{orientation}</Badge>
        </div>
      </CardContent>
    </Card>
  );

  const TestCategory = ({ 
    title, 
    icon: Icon, 
    category, 
    description 
  }: { 
    title: string; 
    icon: React.ComponentType<any>; 
    category: string;
    description: string;
  }) => {
    const tests = getTestsByCategory(category);
    const passed = tests.filter(t => t.status === 'pass').length;
    const total = tests.length;
    const percentage = total > 0 ? (passed / total) * 100 : 0;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">{t('admin.testingDashboard.progress')}</span>
            <span className="text-sm font-medium">{passed}/{total}</span>
          </div>
          <Progress value={percentage} className="h-2" />
          
          <div className="space-y-2">
            {tests.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg border">
                <div className="flex items-center gap-2">
                  {getStatusIcon(test.status)}
                  <span className="text-sm">{test.test}</span>
                </div>
                {getStatusBadge(test.status)}
              </div>
            ))}
            {tests.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                {t('admin.testingDashboard.noTestsMessage')}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.testingDashboard.title')}</h1>
          <p className="text-muted-foreground">
            {t('admin.testingDashboard.subtitle')}
          </p>
        </div>
        
        <Button 
          onClick={runTests} 
          disabled={isRunning}
          size="lg"
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", isRunning && "animate-spin")} />
          {isRunning ? t('admin.testing.runningTests') : t('admin.testing.runAllTests')}
        </Button>
      </div>

      {lastRun && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            {t('admin.testingDashboard.lastTestRun')} {lastRun.toLocaleString()} • 
            {t('admin.testingDashboard.overallScoreLabel')} {getOverallScore()}%
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <DeviceInfo />
        
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.testingDashboard.overallScore')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {getOverallScore()}%
              </div>
              <Progress value={getOverallScore()} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.testingDashboard.testSummary')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>{t('admin.testing.passed')}:</span>
              <Badge variant="default">
                {testResults.filter(r => r.status === 'pass').length}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>{t('admin.testing.warnings')}:</span>
              <Badge variant="secondary">
                {testResults.filter(r => r.status === 'warning').length}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>{t('admin.testing.failed')}:</span>
              <Badge variant="destructive">
                {testResults.filter(r => r.status === 'fail').length}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.testingDashboard.quickActions')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Smartphone className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('admin.testingDashboard.testMobileLayout')}
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Zap className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('admin.testingDashboard.performanceCheck')}
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Shield className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('admin.testingDashboard.securityScan')}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mobile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mobile">{t('admin.testing.mobile')}</TabsTrigger>
          <TabsTrigger value="pwa">{t('admin.testing.pwa')}</TabsTrigger>
          <TabsTrigger value="performance">{t('admin.testing.performance')}</TabsTrigger>
          <TabsTrigger value="accessibility">{t('admin.testingDashboard.a11y')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mobile" className="mt-6">
          <TestCategory
            title={t('admin.testingDashboard.mobileResponsiveness')}
            icon={Smartphone}
            category="mobile"
            description={t('admin.testingDashboard.mobileResponsivenessDesc')}
          />
        </TabsContent>
        
        <TabsContent value="pwa" className="mt-6">
          <TestCategory
            title={t('admin.testingDashboard.progressiveWebApp')}
            icon={Monitor}
            category="pwa"
            description={t('admin.testingDashboard.pwaDesc')}
          />
        </TabsContent>
        
        <TabsContent value="performance" className="mt-6">
          <TestCategory
            title={t('admin.testingDashboard.performanceMetrics')}
            icon={Zap}
            category="performance"
            description={t('admin.testingDashboard.performanceMetricsDesc')}
          />
        </TabsContent>
        
        <TabsContent value="accessibility" className="mt-6">
          <TestCategory
            title={t('admin.testingDashboard.accessibility')}
            icon={Eye}
            category="accessibility"
            description={t('admin.testingDashboard.accessibilityDesc')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};