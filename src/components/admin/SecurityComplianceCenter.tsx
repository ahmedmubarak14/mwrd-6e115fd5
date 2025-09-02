import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  FileText,
  Lock,
  Eye,
  Database,
  Users,
  Globe,
  Clock
} from "lucide-react";
import { useSecurityCompliance } from "@/hooks/useSecurityCompliance";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const SecurityComplianceCenter = () => {
  const { 
    complianceStatus, 
    privacyControls, 
    dataRetention, 
    auditReports,
    generateComplianceReport,
    isLoading 
  } = useSecurityCompliance();
  const { toast } = useToast();
  const { t } = useLanguage();

  const complianceFrameworks = [
    {
      name: t('admin.securityCompliance.gdpr'),
      description: t('admin.securityCompliance.gdprDesc'),
      score: 92,
      status: "compliant",
      requirements: [
        { name: t('admin.securityCompliance.dataProcessingRecords'), status: "complete" },
        { name: t('admin.securityCompliance.privacyPolicy'), status: "complete" },
        { name: t('admin.securityCompliance.dataSubjectRights'), status: "complete" },
        { name: t('admin.securityCompliance.dataBreachProcedures'), status: "complete" },
        { name: t('admin.securityCompliance.cookieConsent'), status: "pending" }
      ]
    },
    {
      name: t('admin.securityCompliance.soc2'),
      description: t('admin.securityCompliance.soc2Desc'),
      score: 88,
      status: "in-progress",
      requirements: [
        { name: t('admin.securityCompliance.securityControls'), status: "complete" },
        { name: t('admin.securityCompliance.availabilityControls'), status: "complete" },
        { name: t('admin.securityCompliance.processingIntegrity'), status: "in-progress" },
        { name: t('admin.securityCompliance.confidentiality'), status: "complete" },
        { name: t('admin.securityCompliance.privacyControls'), status: "pending" }
      ]
    },
    {
      name: t('admin.securityCompliance.pciDss'),
      description: t('admin.securityCompliance.pciDssDesc'),
      score: 85,
      status: "compliant",
      requirements: [
        { name: t('admin.securityCompliance.secureNetwork'), status: "complete" },
        { name: t('admin.securityCompliance.cardholderDataProtection'), status: "complete" },
        { name: t('admin.securityCompliance.vulnerabilityManagement'), status: "complete" },
        { name: t('admin.securityCompliance.accessControl'), status: "complete" },
        { name: t('admin.securityCompliance.networkMonitoring'), status: "in-progress" }
      ]
    }
  ];

  const handleGenerateReport = async (framework: string) => {
    try {
      await generateComplianceReport(framework);
      toast({
        title: t('admin.securityCompliance.success'),
        description: `${framework} ${t('admin.securityCompliance.reportGenerated')}`
      });
    } catch (error) {
      toast({
        title: t('admin.securityCompliance.error'),
        description: t('admin.securityCompliance.reportError'),
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'complete':
        return 'text-success';
      case 'in-progress':
        return 'text-warning';
      case 'pending':
      case 'non-compliant':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'complete':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'pending':
      case 'non-compliant':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">{t('admin.securityCompliance.overview')}</TabsTrigger>
          <TabsTrigger value="frameworks">{t('admin.securityCompliance.frameworks')}</TabsTrigger>
          <TabsTrigger value="privacy">{t('admin.securityCompliance.privacyControls')}</TabsTrigger>
          <TabsTrigger value="retention">{t('admin.securityCompliance.dataRetention')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.securityCompliance.overallComplianceScore')}</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">88%</div>
                <Progress value={88} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {t('admin.securityCompliance.aboveIndustryAverage')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.securityCompliance.activeFrameworks')}</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  GDPR, SOC 2, PCI DSS
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.securityCompliance.pendingActions')}</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">4</div>
                <p className="text-xs text-muted-foreground">
                  {t('admin.securityCompliance.requiresAttention')}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.securityCompliance.complianceStatusSummary')}</CardTitle>
                <CardDescription>{t('admin.securityCompliance.currentStatusAllFrameworks')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceFrameworks.map((framework) => (
                    <div key={framework.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(framework.status).replace('text-', 'bg-')}`}></div>
                        <div>
                          <h4 className="font-medium">{framework.name}</h4>
                          <p className="text-sm text-muted-foreground">{framework.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className={`font-semibold ${getStatusColor(framework.status)}`}>
                            {framework.score}%
                          </div>
                          <Badge variant={getStatusBadge(framework.status)}>
                            {framework.status}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleGenerateReport(framework.name)}>
                          <Download className="h-4 w-4 mr-1" />
                          {t('admin.securityCompliance.report')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="frameworks">
          <div className="space-y-6">
            {complianceFrameworks.map((framework) => (
              <Card key={framework.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{framework.name}</CardTitle>
                      <CardDescription>{framework.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`text-2xl font-bold ${getStatusColor(framework.status)}`}>
                        {framework.score}%
                      </div>
                      <Badge variant={getStatusBadge(framework.status)}>
                        {framework.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {framework.requirements.map((req, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                        <span className="font-medium">{req.name}</span>
                        <div className="flex items-center space-x-2">
                          {req.status === 'complete' ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-warning" />
                          )}
                          <Badge variant={getStatusBadge(req.status)}>
                            {req.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" onClick={() => handleGenerateReport(framework.name)}>
                      <Download className="h-4 w-4 mr-2" />
                      Generate {t('admin.securityCompliance.generateReport')} {framework.name}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="privacy">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {t('admin.securityCompliance.dataProcessingActivities')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>{t('admin.securityCompliance.userRegistrationData')}</span>
                  <Badge variant="default">{t('admin.securityCompliance.lawfulBasisConsent')}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>{t('admin.securityCompliance.paymentProcessing')}</span>
                  <Badge variant="default">{t('admin.securityCompliance.lawfulBasisContract')}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>{t('admin.securityCompliance.marketingCommunications')}</span>
                  <Badge variant="secondary">{t('admin.securityCompliance.lawfulBasisConsent')}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>{t('admin.securityCompliance.securityMonitoring')}</span>
                  <Badge variant="default">{t('admin.securityCompliance.lawfulBasisLegitimate')}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t('admin.securityCompliance.dataSubjectRights')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>{t('admin.securityCompliance.rightToAccess')}</span>
                  <Badge variant="default">{t('admin.securityCompliance.implemented')}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>{t('admin.securityCompliance.rightToRectification')}</span>
                  <Badge variant="default">{t('admin.securityCompliance.implemented')}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>{t('admin.securityCompliance.rightToErasure')}</span>
                  <Badge variant="default">{t('admin.securityCompliance.implemented')}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>{t('admin.securityCompliance.rightToPortability')}</span>
                  <Badge variant="secondary">{t('admin.securityCompliance.inProgress')}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="retention">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t('admin.securityCompliance.dataRetentionPolicies')}
              </CardTitle>
              <CardDescription>
                {t('admin.securityCompliance.automatedDataRetention')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{t('admin.securityCompliance.userAccountData')}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t('admin.securityCompliance.retained7Years')}
                    </p>
                    <Badge variant="default">{t('admin.securityCompliance.active')}</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{t('admin.securityCompliance.transactionRecords')}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t('admin.securityCompliance.retained10Years')}
                    </p>
                    <Badge variant="default">{t('admin.securityCompliance.active')}</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{t('admin.securityCompliance.auditLogs')}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t('admin.securityCompliance.retained3Years')}
                    </p>
                    <Badge variant="default">{t('admin.securityCompliance.active')}</Badge>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">{t('admin.securityCompliance.nextScheduledCleanup')}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t('admin.securityCompliance.automaticDataCleanup')}
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm">{t('admin.securityCompliance.estimatedRecords')}: 1,247</span>
                    <Button size="sm" variant="outline">{t('admin.securityCompliance.configureSchedule')}</Button>
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