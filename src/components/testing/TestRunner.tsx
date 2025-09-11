import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  PlayCircle, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  FileText,
  Clock,
  Zap,
  Shield,
  Smartphone,
  Globe,
  Bug
} from 'lucide-react';
import { TestingAndRefinementSuite, TestResult } from '@/utils/testingAndRefinement';

interface TestSuite {
  id: string;
  name: string;
  description: string;
  tests: TestResult[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
}

export const TestRunner = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isRunning, setIsRunning] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  const suite = new TestingAndRefinementSuite();

  // Initialize test suites
  useEffect(() => {
    setTestSuites([
      {
        id: 'mobile',
        name: 'Mobile Responsiveness',
        description: 'Tests mobile viewport, touch targets, and responsive design',
        tests: [],
        status: 'pending',
        progress: 0
      },
      {
        id: 'pwa',
        name: 'PWA Functionality',
        description: 'Tests Progressive Web App features and service worker',
        tests: [],
        status: 'pending',
        progress: 0
      },
      {
        id: 'performance',
        name: 'Performance',
        description: 'Tests Core Web Vitals and loading performance',
        tests: [],
        status: 'pending',
        progress: 0
      },
      {
        id: 'accessibility',
        name: 'Accessibility',
        description: 'Tests WCAG compliance and accessibility features',
        tests: [],
        status: 'pending',
        progress: 0
      }
    ]);
  }, []);

  // Run individual test suite
  const runTestSuite = async (suiteId: string) => {
    setTestSuites(prev => prev.map(suite => 
      suite.id === suiteId 
        ? { ...suite, status: 'running', progress: 0 }
        : suite
    ));

    try {
      let results: TestResult[] = [];

      switch (suiteId) {
        case 'mobile':
          results = await suite.testMobileResponsiveness();
          break;
        case 'pwa':
          results = await suite.testPWAFunctionality();
          break;
        case 'performance':
          results = await suite.testPerformance();
          break;
        case 'accessibility':
          results = await suite.testAccessibility();
          break;
      }

      setTestSuites(prev => prev.map(suite => 
        suite.id === suiteId 
          ? { 
              ...suite, 
              tests: results, 
              status: 'completed', 
              progress: 100 
            }
          : suite
      ));

    } catch (error) {
      console.error(`Test suite ${suiteId} failed:`, error);
      setTestSuites(prev => prev.map(suite => 
        suite.id === suiteId 
          ? { ...suite, status: 'failed', progress: 0 }
          : suite
      ));
    }
  };

  // Run all test suites
  const runAllTests = async () => {
    setIsRunning(true);
    setOverallProgress(0);

    const suiteIds = testSuites.map(s => s.id);
    
    for (let i = 0; i < suiteIds.length; i++) {
      await runTestSuite(suiteIds[i]);
      setOverallProgress(((i + 1) / suiteIds.length) * 100);
    }

    setIsRunning(false);
  };

  // Get test status icon
  const getTestStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  // Get suite status badge
  const getSuiteStatusBadge = (status: TestSuite['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  // Calculate overall test statistics
  const getTestStats = () => {
    const allTests = testSuites.flatMap(suite => suite.tests);
    const total = allTests.length;
    const passed = allTests.filter(t => t.status === 'pass').length;
    const failed = allTests.filter(t => t.status === 'fail').length;
    const warnings = allTests.filter(t => t.status === 'warning').length;

    return { total, passed, failed, warnings };
  };

  const stats = getTestStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quality Assurance Testing</h2>
          <p className="text-muted-foreground">
            Automated testing suite for MVP validation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <PlayCircle className="h-4 w-4" />
            )}
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
        </div>
      </div>

      {/* Overall Progress */}
      {isRunning && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(overallProgress)}%
                </span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Tests</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Suites */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Mobile
          </TabsTrigger>
          <TabsTrigger value="pwa" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            PWA
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Accessibility
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-4">
            {testSuites.map(suite => (
              <Card key={suite.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{suite.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {suite.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSuiteStatusBadge(suite.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runTestSuite(suite.id)}
                        disabled={isRunning}
                      >
                        {suite.status === 'running' ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <PlayCircle className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={suite.progress} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{suite.tests.length} tests</span>
                      <span>{suite.progress}% complete</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {testSuites.map(suite => (
          <TabsContent key={suite.id} value={suite.id}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{suite.name} Test Results</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => runTestSuite(suite.id)}
                    disabled={isRunning}
                  >
                    {suite.status === 'running' ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <PlayCircle className="h-4 w-4" />
                    )}
                    Run Tests
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {suite.tests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No tests run yet. Click "Run Tests" to start.
                  </div>
                ) : (
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {suite.tests.map((test, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                          {getTestStatusIcon(test.status)}
                          <div className="flex-1">
                            <div className="font-medium">{test.testName || 'Test'}</div>
                            <div className="text-sm text-muted-foreground">
                              {test.message}
                            </div>
                            {test.details && (
                              <div className="text-xs text-muted-foreground mt-1 bg-muted p-2 rounded">
                                {JSON.stringify(test.details, null, 2)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};