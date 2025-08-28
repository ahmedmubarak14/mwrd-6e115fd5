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

  const complianceFrameworks = [
    {
      name: "GDPR",
      description: "General Data Protection Regulation",
      score: 92,
      status: "compliant",
      requirements: [
        { name: "Data Processing Records", status: "complete" },
        { name: "Privacy Policy", status: "complete" },
        { name: "Data Subject Rights", status: "complete" },
        { name: "Data Breach Procedures", status: "complete" },
        { name: "Cookie Consent", status: "pending" }
      ]
    },
    {
      name: "SOC 2",
      description: "Service Organization Control 2",
      score: 88,
      status: "in-progress",
      requirements: [
        { name: "Security Controls", status: "complete" },
        { name: "Availability Controls", status: "complete" },
        { name: "Processing Integrity", status: "in-progress" },
        { name: "Confidentiality", status: "complete" },
        { name: "Privacy Controls", status: "pending" }
      ]
    },
    {
      name: "PCI DSS",
      description: "Payment Card Industry Data Security Standard",
      score: 85,
      status: "compliant",
      requirements: [
        { name: "Secure Network", status: "complete" },
        { name: "Cardholder Data Protection", status: "complete" },
        { name: "Vulnerability Management", status: "complete" },
        { name: "Access Control", status: "complete" },
        { name: "Network Monitoring", status: "in-progress" }
      ]
    }
  ];

  const handleGenerateReport = async (framework: string) => {
    try {
      await generateComplianceReport(framework);
      toast({
        title: "Success",
        description: `${framework} compliance report generated successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate compliance report",
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
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Controls</TabsTrigger>
          <TabsTrigger value="retention">Data Retention</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Compliance Score</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">88%</div>
                <Progress value={88} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Above industry average
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Frameworks</CardTitle>
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
                <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">4</div>
                <p className="text-xs text-muted-foreground">
                  Requires attention
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Status Summary</CardTitle>
                <CardDescription>Current status across all compliance frameworks</CardDescription>
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
                          Report
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
                      Generate {framework.name} Report
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
                  Data Processing Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>User Registration Data</span>
                  <Badge variant="default">Lawful Basis: Consent</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>Payment Processing</span>
                  <Badge variant="default">Lawful Basis: Contract</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>Marketing Communications</span>
                  <Badge variant="secondary">Lawful Basis: Consent</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>Security Monitoring</span>
                  <Badge variant="default">Lawful Basis: Legitimate Interest</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Data Subject Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>Right to Access</span>
                  <Badge variant="default">Implemented</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>Right to Rectification</span>
                  <Badge variant="default">Implemented</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>Right to Erasure</span>
                  <Badge variant="default">Implemented</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <span>Right to Portability</span>
                  <Badge variant="secondary">In Progress</Badge>
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
                Data Retention Policies
              </CardTitle>
              <CardDescription>
                Automated data retention and deletion schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">User Account Data</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Retained for 7 years after account closure
                    </p>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Transaction Records</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Retained for 10 years for compliance
                    </p>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Audit Logs</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Retained for 3 years from creation
                    </p>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Next Scheduled Cleanup</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatic data cleanup will run on March 15, 2025 at 2:00 AM UTC
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm">Estimated records to be processed: 1,247</span>
                    <Button size="sm" variant="outline">Configure Schedule</Button>
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