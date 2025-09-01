import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Globe, 
  Shield, 
  Code,
  RefreshCw
} from "lucide-react";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";

// Mock data - in a real implementation, this would come from actual validation
const mockValidationResults = {
  totalTranslationKeys: 342,
  translatedKeys: 334,
  missingKeys: ['forms.defaultLocation', 'analytics.conversionRate'],
  hardcodedStrings: [
    { file: 'src/components/ui/loading.tsx', line: 12, content: 'Loading...' },
    { file: 'src/pages/admin/dashboard.tsx', line: 45, content: 'Welcome back' }
  ],
  rtlCompliance: true,
  coverage: 97.7,
  lastUpdated: new Date().toISOString()
};

export const I18nMonitoringDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { t, isRTL } = useOptionalLanguage() || { 
    t: (key: string) => key.split('.').pop() || key, 
    isRTL: false 
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 95) return "text-green-600";
    if (coverage >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  const getCoverageBadge = (coverage: number) => {
    if (coverage >= 95) return "default";
    if (coverage >= 85) return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">I18n Status Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor translation coverage and i18n compliance across your application
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Translation Coverage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Translation Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getCoverageColor(mockValidationResults.coverage)}`}>
                  {mockValidationResults.coverage.toFixed(1)}%
                </div>
                <Progress value={mockValidationResults.coverage} className="mt-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">
                    {mockValidationResults.translatedKeys}
                  </div>
                  <div className="text-muted-foreground">Translated</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-red-600">
                    {mockValidationResults.missingKeys.length}
                  </div>
                  <div className="text-muted-foreground">Missing</div>
                </div>
              </div>

              <Badge variant={getCoverageBadge(mockValidationResults.coverage)} className="w-full justify-center">
                {mockValidationResults.coverage >= 95 ? 'Excellent' : 
                 mockValidationResults.coverage >= 85 ? 'Good' : 'Needs Attention'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* RTL Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              RTL Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              {mockValidationResults.rtlCompliance ? (
                <>
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                  <Badge variant="default">Compliant</Badge>
                  <p className="text-sm text-muted-foreground">
                    Document attributes and styles properly configured
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="h-12 w-12 text-red-600 mx-auto" />
                  <Badge variant="destructive">Issues Found</Badge>
                  <p className="text-sm text-muted-foreground">
                    RTL support needs configuration
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Code Quality */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Code Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              {mockValidationResults.hardcodedStrings.length === 0 ? (
                <>
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                  <Badge variant="default">Clean</Badge>
                  <p className="text-sm text-muted-foreground">
                    No hardcoded strings detected
                  </p>
                </>
              ) : (
                <>
                  <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto" />
                  <Badge variant="secondary">{mockValidationResults.hardcodedStrings.length} Issues</Badge>
                  <p className="text-sm text-muted-foreground">
                    Hardcoded strings found in codebase
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="missing" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="missing">Missing Keys</TabsTrigger>
          <TabsTrigger value="hardcoded">Hardcoded Strings</TabsTrigger>
          <TabsTrigger value="guidelines">Best Practices</TabsTrigger>
        </TabsList>

        <TabsContent value="missing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Missing Translation Keys</CardTitle>
              <CardDescription>
                Keys that need to be added to locale files
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockValidationResults.missingKeys.length > 0 ? (
                <div className="space-y-2">
                  {mockValidationResults.missingKeys.map((key, index) => (
                    <Alert key={index}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <code className="bg-muted px-2 py-1 rounded text-sm">{key}</code>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">All Keys Translated!</h3>
                  <p className="text-muted-foreground">
                    No missing translation keys found.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hardcoded" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hardcoded Strings</CardTitle>
              <CardDescription>
                Strings that should be moved to translation files
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockValidationResults.hardcodedStrings.length > 0 ? (
                <div className="space-y-3">
                  {mockValidationResults.hardcodedStrings.map((item, index) => (
                    <Alert key={index}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{item.file}:{item.line}</div>
                          <code className="bg-muted px-2 py-1 rounded text-sm block">
                            "{item.content}"
                          </code>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Code is Clean!</h3>
                  <p className="text-muted-foreground">
                    No hardcoded strings detected in the codebase.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guidelines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>I18n Best Practices</CardTitle>
              <CardDescription>
                Guidelines for maintaining internationalization quality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Translation Keys
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• Use descriptive, hierarchical key names (e.g., common.buttons.save)</li>
                    <li>• Keep keys consistent across components</li>
                    <li>• Add context in key names when needed</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    RTL Support
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• Test layouts in both LTR and RTL modes</li>
                    <li>• Use logical CSS properties (margin-inline-start vs margin-left)</li>
                    <li>• Handle icon and image directionality</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Code Quality
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• Never use hardcoded strings in UI components</li>
                    <li>• Use ESLint rules to catch literal strings</li>
                    <li>• Implement pre-commit hooks for validation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-xs text-muted-foreground">
        Last updated: {new Date(mockValidationResults.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
};