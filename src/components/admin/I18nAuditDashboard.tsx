import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Globe,
  FileText,
  Target,
  Zap
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { i18nAuditor, I18nAuditReport } from '@/utils/audit/i18nAuditor';

export const I18nAuditDashboard = () => {
  const { t } = useLanguage();
  const [report, setReport] = useState<I18nAuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runAudit = async () => {
    setLoading(true);
    try {
      const auditReport = await i18nAuditor.runFullAudit();
      setReport(auditReport);
      setLastRun(new Date());
    } catch (error) {
      console.error('Audit failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-run audit on component mount
    runAudit();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, any> = {
      critical: 'destructive',
      high: 'destructive',
      medium: 'secondary',
      low: 'outline'
    };
    return variants[severity] || 'outline';
  };

  if (!report) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">I18n Audit Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive vendor dashboard internationalization audit</p>
          </div>
          <Button onClick={runAudit} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Running Audit...' : 'Run Audit'}
          </Button>
        </div>

        {loading && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <RefreshCw className="h-6 w-6 animate-spin" />
                <div>
                  <p className="font-medium">Scanning vendor components...</p>
                  <p className="text-sm text-muted-foreground">This may take a moment</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">I18n Audit Dashboard</h1>
          <p className="text-muted-foreground">
            Last updated: {lastRun?.toLocaleDateString()} at {lastRun?.toLocaleTimeString()}
          </p>
        </div>
        <Button onClick={runAudit} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Audit
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`text-3xl font-bold ${getScoreColor(report.summary.overallScore)}`}>
                {report.summary.overallScore}
              </div>
              <div className="text-muted-foreground">/100</div>
            </div>
            <Progress value={report.summary.overallScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {report.summary.criticalIssues > 0 ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              <div className="text-2xl font-bold">{report.summary.criticalIssues}</div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {report.summary.totalIssues} total issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Translation Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <div className="text-2xl font-bold">
                {report.summary.translationCoverage.toFixed(1)}%
              </div>
            </div>
            <Progress value={report.summary.translationCoverage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vendor Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-500" />
              <div className="text-2xl font-bold">{report.vendorSpecific.componentsCovered}</div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {report.vendorSpecific.criticalComponents.length} need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {report.summary.criticalIssues > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {report.summary.criticalIssues} critical issues found that require immediate attention. 
            Fix these before deploying to production.
          </AlertDescription>
        </Alert>
      )}

      {/* Detailed Tabs */}
      <Tabs defaultValue="actions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="actions">Action Items</TabsTrigger>
          <TabsTrigger value="hardcoded">Hardcoded Strings</TabsTrigger>
          <TabsTrigger value="translations">Translation Quality</TabsTrigger>
          <TabsTrigger value="vendor">Vendor Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Prioritized Action Items
              </CardTitle>
              <CardDescription>
                Fix these issues in order of priority for maximum impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.actionItems.slice(0, 10).map((item, index) => (
                  <div key={item.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium">#{index + 1}</span>
                        <Badge variant={getSeverityBadge(item.priority)}>
                          {item.priority}
                        </Badge>
                        <Badge variant="outline">{item.category}</Badge>
                        {item.autoFixable && (
                          <Badge variant="secondary">
                            <Zap className="h-3 w-3 mr-1" />
                            Auto-fixable
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      {item.file && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {item.file}{item.line && `:${item.line}`}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm font-medium">{item.estimatedEffort}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hardcoded" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hardcoded Strings Analysis</CardTitle>
              <CardDescription>
                {report.hardcodedStrings.issues.length} hardcoded strings found across vendor components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {report.hardcodedStrings.issues.filter(i => i.severity === 'high').length}
                  </div>
                  <div className="text-sm text-muted-foreground">High Severity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {report.hardcodedStrings.issues.filter(i => i.severity === 'medium').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Medium Severity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {report.hardcodedStrings.issues.filter(i => i.severity === 'low').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Low Severity</div>
                </div>
              </div>

              <div className="space-y-2">
                {report.hardcodedStrings.issues.slice(0, 20).map((issue, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getSeverityBadge(issue.severity)}>
                          {issue.severity}
                        </Badge>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          "{issue.text}"
                        </code>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {issue.file.split('/').pop()}:{issue.line}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="translations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Translation Quality</CardTitle>
              <CardDescription>
                Analysis of translation completeness and quality issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Coverage Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Keys:</span>
                      <span>{report.translations.coverage.totalKeys}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Translated:</span>
                      <span>{report.translations.coverage.translatedKeys}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Missing:</span>
                      <span className="text-red-600">{report.translations.coverage.missingKeys.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Empty:</span>
                      <span className="text-yellow-600">{report.translations.coverage.emptyKeys.length}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Issue Breakdown</h4>
                  <div className="space-y-2">
                    {['critical', 'high', 'medium', 'low'].map(severity => (
                      <div key={severity} className="flex justify-between">
                        <span className="capitalize">{severity}:</span>
                        <Badge variant={getSeverityBadge(severity)}>
                          {report.translations.issues.filter(i => i.severity === severity).length}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Recommendations</h4>
                <div className="space-y-2">
                  {report.translations.recommendations.map((rec, index) => (
                    <Alert key={index}>
                      <AlertDescription>{rec}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Components Analysis</CardTitle>
              <CardDescription>
                Specific analysis of vendor dashboard components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Component Coverage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Components:</span>
                      <span>{report.vendorSpecific.componentsCovered}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>With Issues:</span>
                      <span className="text-red-600">{report.vendorSpecific.componentsWithIssues}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Critical Components</h4>
                  <div className="space-y-1">
                    {report.vendorSpecific.criticalComponents.map((component, index) => (
                      <Badge key={index} variant="destructive" className="mr-2 mb-2">
                        {component}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};