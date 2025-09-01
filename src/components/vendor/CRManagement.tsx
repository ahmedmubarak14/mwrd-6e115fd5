import { useState } from "react";
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

export const CRManagement = () => {
  const { userProfile } = useAuth();
  const { crData, loading, updateCRData, uploadCRDocument } = useVendorCR();
  const languageContext = useOptionalLanguage();
  const { toast } = useToast();
  const { isRTL } = languageContext || { isRTL: false };
  const t = languageContext?.t || ((key: string) => key);
  
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
      await submitForVerification();
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
    <div className={cn("space-y-6", isRTL && "rtl")}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t('vendor.cr.title')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t('vendor.cr.verificationRequired')}
        </p>
      </div>

      {/* Status Card */}
      <Card className={cn("border-l-4", statusInfo.color)}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 rtl:space-x-reverse">
            {statusInfo.icon}
            <span>{t('vendor.cr.status')}</span>
            <Badge variant="outline" className={statusInfo.color}>
              {statusInfo.label}
            </Badge>
          </CardTitle>
          <CardDescription>
            {userProfile?.verification_status === 'approved' && 
              'Your account is verified and you have full platform access.'
            }
            {userProfile?.verification_status === 'pending' && 
              'Your account is under review. This typically takes 24-48 hours.'
            }
            {userProfile?.verification_status === 'rejected' && 
              'Your account was rejected. Please review the feedback and resubmit.'
            }
            {(!userProfile?.verification_status || userProfile?.verification_status === 'unverified') && 
              'Please complete your business profile and verification to get approved.'
            }
          </CardDescription>
        </CardHeader>
      </Card>

      {/* CR Information Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
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
              <Label htmlFor="business_size">Business Size</Label>
              <Input
                id="business_size"
                placeholder="Small/Medium/Large"
                value={formData.business_size}
                onChange={(e) => handleInputChange('business_size', e.target.value)}
                className={isRTL ? "text-right" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="established_year" className="flex items-center space-x-2 rtl:space-x-reverse">
                <Calendar className="h-4 w-4" />
                <span>Established Year</span>
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
              <Label htmlFor="experience_years">Experience Years</Label>
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
              <Label htmlFor="employee_count">Employee Count</Label>
              <Input
                id="employee_count"
                placeholder="1-10 / 10-50 / 50+"
                value={formData.employee_count}
                onChange={(e) => handleInputChange('employee_count', e.target.value)}
                className={isRTL ? "text-right" : ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team_size">Team Size</Label>
            <Input
              id="team_size"
              placeholder="Small team / Large team"
              value={formData.team_size}
              onChange={(e) => handleInputChange('team_size', e.target.value)}
              className={isRTL ? "text-right" : ""}
            />
          </div>

          <Button onClick={handleSave} disabled={loading}>
            {loading ? <LoadingSpinner size="sm" /> : null}
            {t('common.save')}
          </Button>
        </CardContent>
      </Card>

      {/* Document Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <FileText className="h-5 w-5" />
            <span>{t('vendor.cr.upload')}</span>
          </CardTitle>
          <CardDescription>
            Upload your commercial registration and business license documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label>Business Documents</Label>
              <div className="mt-2 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Document upload functionality will be available soon
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};