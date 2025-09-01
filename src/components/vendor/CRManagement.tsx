import React, { useState } from "react";
import { VendorBreadcrumbs } from "@/components/vendor/VendorBreadcrumbs";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useVendorCR } from "@/hooks/useVendorCR";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle,
  Calendar,
  Building
} from "lucide-react";
import { cn } from "@/lib/utils";

const CRManagementContent = React.memo(() => {
  const { userProfile } = useAuth();
  const { crData, loading, updateCRData, uploadCRDocument } = useVendorCR();
  const languageContext = useOptionalLanguage();
  const { toast } = useToast();
  const { isRTL, t } = languageContext || { 
    isRTL: false,
    t: (key: string) => key.split('.').pop() || key
  };
  
  const [formData, setFormData] = useState({
    business_size: crData?.business_size || '',
    established_year: crData?.established_year?.toString() || '',
    employee_count: crData?.employee_count || '',
    team_size: crData?.team_size || '',
    experience_years: crData?.experience_years?.toString() || ''
  });
  const [uploading, setUploading] = useState(false);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          color: 'text-success border-success/20 bg-success/5',
          label: t('vendor.cr.verified')
        };
      case 'pending':
        return {
          icon: <Clock className="h-5 w-5" />,
          color: 'text-warning border-warning/20 bg-warning/5',
          label: t('vendor.cr.pending')
        };
      case 'rejected':
        return {
          icon: <XCircle className="h-5 w-5" />,
          color: 'text-destructive border-destructive/20 bg-destructive/5',
          label: t('vendor.cr.rejected')
        };
      default:
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          color: 'text-muted-foreground border-muted/20 bg-muted/5',
          label: t('vendor.cr.unverified')
        };
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateCRData({
        business_size: formData.business_size,
        established_year: formData.established_year ? parseInt(formData.established_year) : undefined,
        employee_count: formData.employee_count,
        team_size: formData.team_size,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined
      });
      
      toast({
        title: t('common.success'),
        description: t('vendor.cr.updateCR'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : 'Failed to update CR information',
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const documentUrl = await uploadCRDocument(file);
      await updateCRData({ cr_document_url: documentUrl });
      
      toast({
        title: t('common.success'),
        description: t('vendor.cr.upload'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : 'Failed to upload document',
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitForVerification = async () => {
    try {
      await updateCRData({ verification_status: 'pending' });
      toast({
        title: t('common.success'),
        description: t('vendor.verification.submitForReview'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : 'Failed to submit for verification',
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statusInfo = getStatusInfo(userProfile?.verification_status || 'unverified');

  return (
    <div className={cn("space-y-6", isRTL && "rtl")} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Breadcrumbs */}
      <VendorBreadcrumbs />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
          {t('vendor.cr.title')}
        </h1>
        <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
          {t('vendor.cr.verificationRequired')}
        </p>
      </div>

      {/* Status Card */}
      <Card className={cn("border-l-4", statusInfo.color)}>
        <CardHeader>
          <CardTitle className={cn(
            "flex items-center space-x-3",
            isRTL && "space-x-reverse"
          )}>
            {statusInfo.icon}
            <span>{t('vendor.cr.status')}</span>
            <Badge variant="outline" className={statusInfo.color}>
              {statusInfo.label}
            </Badge>
          </CardTitle>
          <CardDescription>
            {userProfile?.verification_status === 'approved' && 
              t('vendor.cr.statusApproved')
            }
            {userProfile?.verification_status === 'pending' && 
              t('vendor.cr.statusPending')
            }
            {userProfile?.verification_status === 'rejected' && 
              t('vendor.cr.statusRejected')
            }
            {(!userProfile?.verification_status || userProfile?.verification_status === 'under_review') && 
              t('vendor.cr.statusDefault')
            }
          </CardDescription>
        </CardHeader>
      </Card>

      {/* CR Information Form */}
      <Card>
        <CardHeader>
          <CardTitle className={cn(
            "flex items-center space-x-2",
            isRTL && "space-x-reverse"
          )}>
            <Building className="h-5 w-5" />
            <span>{t('vendor.profile.businessInfo')}</span>
          </CardTitle>
          <CardDescription>
            {t('vendor.profile.basicInfo')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="business_size">{t('vendor.cr.businessSize')}</Label>
              <Input
                id="business_size"
                placeholder={t('vendor.cr.smallMediumLarge')}
                value={formData.business_size}
                onChange={(e) => handleInputChange('business_size', e.target.value)}
                className={isRTL ? "text-right" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="established_year" className={cn(
                "flex items-center space-x-2",
                isRTL && "space-x-reverse"
              )}>
                <Calendar className="h-4 w-4" />
                <span>{t('vendor.cr.establishedYear')}</span>
              </Label>
              <Input
                id="established_year"
                type="number"
                placeholder="2010"
                value={formData.established_year}
                onChange={(e) => handleInputChange('established_year', e.target.value)}
                className={isRTL ? "text-right" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience_years">{t('vendor.cr.experienceYears')}</Label>
              <Input
                id="experience_years"
                type="number"
                placeholder="5"
                value={formData.experience_years}
                onChange={(e) => handleInputChange('experience_years', e.target.value)}
                className={isRTL ? "text-right" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee_count">{t('vendor.cr.employeeCount')}</Label>
              <Input
                id="employee_count"
                placeholder={t('vendor.cr.oneToTenEmployees')}
                value={formData.employee_count}
                onChange={(e) => handleInputChange('employee_count', e.target.value)}
                className={isRTL ? "text-right" : ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team_size">{t('vendor.cr.teamSize')}</Label>
            <Input
              id="team_size"
              placeholder={t('vendor.cr.smallLargeTeam')}
              value={formData.team_size}
              onChange={(e) => handleInputChange('team_size', e.target.value)}
              className={isRTL ? "text-right" : ""}
            />
          </div>

          <Button 
            onClick={handleSave} 
            disabled={loading}
            className={cn(
              "gap-2",
              isRTL && "flex-row-reverse"
            )}
          >
            {loading ? <LoadingSpinner size="sm" /> : null}
            {t('common.save')}
          </Button>
        </CardContent>
      </Card>

      {/* Document Upload */}
      <Card>
        <CardHeader>
          <CardTitle className={cn(
            "flex items-center space-x-2",
            isRTL && "space-x-reverse"
          )}>
            <FileText className="h-5 w-5" />
            <span>{t('vendor.cr.businessDocuments')}</span>
          </CardTitle>
          <CardDescription>
            {t('vendor.cr.upload')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label>{t('vendor.cr.businessDocuments')}</Label>
              <div className="mt-2 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t('vendor.cr.documentUpload')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

CRManagementContent.displayName = "CRManagementContent";

export const CRManagement = React.memo(() => {
  return (
    <ErrorBoundary>
      <CRManagementContent />
    </ErrorBoundary>
  );
});

CRManagement.displayName = "CRManagement";