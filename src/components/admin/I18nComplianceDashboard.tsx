/**
 * i18n Compliance Dashboard
 * Real-time monitoring and validation of i18n compliance across Admin Dashboard
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info, 
  RefreshCw,
  FileText,
  Globe,
  Languages,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { 
  ComplianceReport, 
  ComplianceIssue, 
  validateI18nCompliance, 
  validateTranslationCoverage 
} from '@/utils/i18nComplianceValidator';

export const I18nComplianceDashboard = () => {
  const { t, isRTL } = useLanguage();
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null);
  const [translationCoverage, setTranslationCoverage] = useState<{ missing: string[]; extra: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const runComplianceCheck = async () => {
    setLoading(true);
    
    try {
      // Simulated component analysis - in real implementation, this would
      // scan actual component files from the filesystem or build process
      const mockComponentFiles = [
        { name: 'AdminErrorBoundary.tsx', content: 'mock content with t() calls' },
        { name: 'ApprovalDashboard.tsx', content: 'mock content with useOptionalLanguage' },
        { name: 'AuditTrailDashboard.tsx', content: 'mock content with i18n' },
        { name: 'SecurityDashboard.tsx', content: 'mock content compliant' },
        { name: 'WorkflowAutomation.tsx', content: 'mock content with RTL support' }
      ];

      const report = validateI18nCompliance(mockComponentFiles);
      const coverage = validateTranslationCoverage();
      
      setComplianceReport(report);
      setTranslationCoverage(coverage);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Compliance check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runComplianceCheck();
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'info': return <Info className="h-4 w-4 text-info" />;
      default: return <CheckCircle className="h-4 w-4 text-success" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      case 'info': return 'outline';
      default: return 'default';
    }
  };

  const getComplianceScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
        <div className={cn(isRTL ? "text-right" : "text-left")}>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
            {t('admin.i18nCompliance.title')}
          </h1>
          <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
            {t('admin.i18nCompliance.description')}
          </p>
        </div>
        <Button onClick={runComplianceCheck} disabled={loading} className="flex items-center gap-2">
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          {t('admin.i18nCompliance.runCheck')}
        </Button>
      </div>

      {/* Compliance Score Overview */}
      {complianceReport && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground opacity-75">{t('admin.i18nCompliance.score')}</p>
                  <p className={cn("text-3xl font-bold", getComplianceScoreColor(complianceReport.complianceScore))}>
                    {complianceReport.complianceScore}%
                  </p>
                  <Progress value={complianceReport.complianceScore} className="mt-2 h-2" />
                </div>
                <ShieldCheck className="h-8 w-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground opacity-75">{t('admin.i18nCompliance.totalIssues')}</p>
                  <p className="text-3xl font-bold text-destructive">{complianceReport.totalIssues}</p>
                  <p className="text-xs text-foreground opacity-75 mt-1">
                    {complianceReport.errorCount} {t('admin.i18nCompliance.errors')}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground opacity-75">{t('admin.i18nCompliance.compliantComponents')}</p>
                  <p className="text-3xl font-bold text-success">
                    {complianceReport.summary.compliantComponents}
                  </p>
                  <p className="text-xs text-foreground opacity-75 mt-1">
                    {t('admin.i18nCompliance.outOf')} {complianceReport.summary.totalComponents}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-success/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground opacity-75">{t('admin.i18nCompliance.warnings')}</p>
                  <p className="text-3xl font-bold text-warning">{complianceReport.warningCount}</p>
                  <p className="text-xs text-foreground opacity-75 mt-1">
                    {t('admin.i18nCompliance.needsAttention')}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning/20" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="issues" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="issues">{t('admin.i18nCompliance.tabs.issues')}</TabsTrigger>
          <TabsTrigger value="coverage">{t('admin.i18nCompliance.tabs.coverage')}</TabsTrigger>
          <TabsTrigger value="components">{t('admin.i18nCompliance.tabs.components')}</TabsTrigger>
          <TabsTrigger value="testing">{t('admin.i18nCompliance.tabs.testing')}</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-4">
          {complianceReport && complianceReport.issues.length > 0 ? (
            <div className="space-y-4">
              {complianceReport.issues.map((issue, index) => (
                <Alert key={index} className={cn(
                  "border-l-4",
                  issue.severity === 'error' && "border-l-destructive",
                  issue.severity === 'warning' && "border-l-warning",
                  issue.severity === 'info' && "border-l-info"
                )}>
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(issue.severity)}
                    <div className="flex-1 min-w-0">
                      <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                        <AlertTitle className="text-sm font-medium">
                          {issue.component} {issue.line && `(${t('admin.i18nCompliance.line')} ${issue.line})`}
                        </AlertTitle>
                        <Badge variant={getSeverityColor(issue.severity) as any}>
                          {t(`admin.i18nCompliance.${issue.severity}`)}
                        </Badge>
                      </div>
                      <AlertDescription className="mt-1 text-sm">
                        <p>{issue.message}</p>
                        {issue.fix && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            <strong>{t('admin.i18nCompliance.suggestedFix')}:</strong> {issue.fix}
                          </p>
                        )}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t('admin.i18nCompliance.allClear')}
                </h3>
                <p className="text-muted-foreground">
                  {t('admin.i18nCompliance.noIssuesFound')}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="coverage" className="space-y-6">
          {translationCoverage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    {t('admin.i18nCompliance.missingTranslations')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {translationCoverage.missing.length > 0 ? (
                    <div className="space-y-2">
                      {translationCoverage.missing.map((key, index) => (
                        <div key={index} className="p-2 bg-destructive/10 rounded text-sm font-mono">
                          {key}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      {t('admin.i18nCompliance.allKeysTranslated')}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    {t('admin.i18nCompliance.extraTranslations')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {translationCoverage.extra.length > 0 ? (
                    <div className="space-y-2">
                      {translationCoverage.extra.map((key, index) => (
                        <div key={index} className="p-2 bg-warning/10 rounded text-sm font-mono">
                          {key}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      {t('admin.i18nCompliance.noExtraKeys')}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="components" className="space-y-4">
          {complianceReport && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t('admin.i18nCompliance.componentStatus')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceReport.summary.nonCompliantComponents.length > 0 && (
                    <div>
                      <h4 className="font-medium text-destructive mb-2">
                        {t('admin.i18nCompliance.nonCompliantComponents')}
                      </h4>
                      <div className="space-y-2">
                        {complianceReport.summary.nonCompliantComponents.map((component, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-destructive/10 rounded">
                            <XCircle className="h-4 w-4 text-destructive" />
                            <span className="font-mono text-sm">{component}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-success mb-2">
                      {t('admin.i18nCompliance.compliantComponentsList')} ({complianceReport.summary.compliantComponents})
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {t('admin.i18nCompliance.compliantComponentsDesc')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.i18nCompliance.manualTests')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">{t('admin.i18nCompliance.languageSwitching')}</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>{t('admin.i18nCompliance.testSwitchLanguages')}</li>
                    <li>{t('admin.i18nCompliance.testRTLLayout')}</li>
                    <li>{t('admin.i18nCompliance.testTextAlignment')}</li>
                    <li>{t('admin.i18nCompliance.testNumberFormat')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('admin.i18nCompliance.automatedChecks')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lastUpdated && (
                  <p className="text-sm text-muted-foreground">
                    {t('admin.i18nCompliance.lastChecked')}: {lastUpdated.toLocaleString()}
                  </p>
                )}
                <Button onClick={runComplianceCheck} disabled={loading} className="w-full">
                  <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                  {t('admin.i18nCompliance.runFullCheck')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};