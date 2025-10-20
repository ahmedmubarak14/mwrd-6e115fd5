import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock, AlertTriangle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface KYCStatus {
  kyc_required: boolean;
  kyc_exists: boolean;
  submission_status: string | null;
  reviewer_notes?: string;
}

export const KYCStatusWidget = () => {
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile?.user_id) {
      fetchKYCStatus();
    }
  }, [userProfile]);

  const fetchKYCStatus = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_kyc_status', { user_uuid: userProfile!.user_id });

      if (error) throw error;

      if (data && data.length > 0) {
        setKycStatus(data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch KYC status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!kycStatus?.kyc_required) {
    return null; // Don't show widget if KYC not required for this user
  }

  const getStatusConfig = () => {
    if (!kycStatus.kyc_exists) {
      return {
        icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        title: t('widgets.kyc.required.title'),
        description: t('widgets.kyc.required.description'),
        badge: <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">{t('widgets.kyc.required.badge')}</Badge>,
        action: (
          <Button onClick={() => navigate('/kyc/main-info')} size="sm">
            {t('widgets.kyc.required.action')}
          </Button>
        ),
        alertVariant: 'default' as const
      };
    }

    switch (kycStatus.submission_status) {
      case 'draft':
        return {
          icon: <FileText className="w-5 h-5 text-blue-500" />,
          title: t('widgets.kyc.draft.title'),
          description: t('widgets.kyc.draft.description'),
          badge: <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">{t('widgets.kyc.draft.badge')}</Badge>,
          action: (
            <Button onClick={() => navigate('/kyc/form')} size="sm">
              {t('widgets.kyc.draft.action')}
            </Button>
          ),
          alertVariant: 'default' as const
        };

      case 'submitted':
      case 'under_review':
        return {
          icon: <Clock className="w-5 h-5 text-blue-500" />,
          title: t('widgets.kyc.underReview.title'),
          description: t('widgets.kyc.underReview.description'),
          badge: <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">{t('widgets.kyc.underReview.badge')}</Badge>,
          action: null,
          alertVariant: 'default' as const
        };

      case 'approved':
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          title: t('widgets.kyc.approved.title'),
          description: t('widgets.kyc.approved.description'),
          badge: <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">{t('widgets.kyc.approved.badge')}</Badge>,
          action: null,
          alertVariant: 'default' as const
        };

      case 'rejected':
        return {
          icon: <XCircle className="w-5 h-5 text-red-500" />,
          title: t('widgets.kyc.rejected.title'),
          description: kycStatus.reviewer_notes || t('widgets.kyc.rejected.description'),
          badge: <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">{t('widgets.kyc.rejected.badge')}</Badge>,
          action: (
            <Button onClick={() => navigate('/kyc/form')} size="sm" variant="destructive">
              {t('widgets.kyc.rejected.action')}
            </Button>
          ),
          alertVariant: 'destructive' as const
        };

      default:
        return {
          icon: <AlertTriangle className="w-5 h-5 text-gray-500" />,
          title: t('widgets.kyc.unknown.title'),
          description: t('widgets.kyc.unknown.description'),
          badge: <Badge variant="outline">{t('widgets.kyc.unknown.badge')}</Badge>,
          action: null,
          alertVariant: 'default' as const
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {statusConfig.icon}
            <CardTitle className="text-lg">{statusConfig.title}</CardTitle>
          </div>
          {statusConfig.badge}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Alert variant={statusConfig.alertVariant}>
          <AlertDescription className="text-sm">
            {statusConfig.description}
          </AlertDescription>
        </Alert>
        {statusConfig.action && (
          <div className="flex justify-end">
            {statusConfig.action}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
