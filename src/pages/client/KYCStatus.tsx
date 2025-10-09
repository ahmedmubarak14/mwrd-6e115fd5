import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FileText, CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';

interface KYCSubmission {
  id: string;
  submission_status: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewer_notes?: string;
  company_legal_name: string;
  cr_number: string;
  vat_number: string;
  account_type: string;
  credit_ceiling?: number;
  payment_period_days?: number;
}

const KYCStatus = () => {
  const { userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [kycSubmission, setKycSubmission] = useState<KYCSubmission | null>(null);
  const [loadingKYC, setLoadingKYC] = useState(true);

  useEffect(() => {
    const fetchKYCStatus = async () => {
      if (userProfile?.user_id) {
        const { data, error } = await supabase
          .from('kyc_submissions')
          .select('*')
          .eq('user_id', userProfile.user_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          setKycSubmission(data);
        }
      }
      setLoadingKYC(false);
    };

    if (!loading) {
      fetchKYCStatus();
    }
  }, [loading, userProfile]);

  if (loading || loadingKYC) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </ClientLayout>
    );
  }

  const getStatusInfo = () => {
    if (!kycSubmission) {
      return {
        icon: <AlertTriangle className="w-8 h-8 text-orange-500" />,
        title: 'KYC Not Submitted',
        description: 'You have not submitted your KYC documents yet.',
        variant: 'default' as const,
        badge: <Badge variant="outline">Pending</Badge>,
        action: (
          <Button onClick={() => navigate('/kyc/main-info')}>
            Start KYC Process
          </Button>
        )
      };
    }

    switch (kycSubmission.submission_status) {
      case 'draft':
        return {
          icon: <FileText className="w-8 h-8 text-gray-500" />,
          title: 'KYC Draft',
          description: 'Your KYC submission is incomplete.',
          variant: 'default' as const,
          badge: <Badge variant="outline">Draft</Badge>,
          action: (
            <Button onClick={() => navigate('/kyc/form')}>
              Complete KYC
            </Button>
          )
        };
      case 'submitted':
      case 'under_review':
        return {
          icon: <Clock className="w-8 h-8 text-blue-500" />,
          title: 'KYC Under Review',
          description: 'Your KYC documents are being reviewed by our team. This typically takes 24-48 hours.',
          variant: 'default' as const,
          badge: <Badge>Under Review</Badge>,
          action: null
        };
      case 'approved':
        return {
          icon: <CheckCircle className="w-8 h-8 text-green-500" />,
          title: 'KYC Approved',
          description: 'Your KYC has been approved. You now have full access to all platform features.',
          variant: 'default' as const,
          badge: <Badge className="bg-green-500">Approved</Badge>,
          action: (
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          )
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-8 h-8 text-red-500" />,
          title: 'KYC Rejected',
          description: 'Your KYC submission has been rejected. Please review the feedback and resubmit.',
          variant: 'destructive' as const,
          badge: <Badge variant="destructive">Rejected</Badge>,
          action: (
            <Button variant="destructive" onClick={() => navigate('/kyc/form')}>
              Resubmit KYC
            </Button>
          )
        };
      default:
        return {
          icon: <AlertTriangle className="w-8 h-8 text-orange-500" />,
          title: 'Unknown Status',
          description: 'Please contact support for assistance.',
          variant: 'default' as const,
          badge: <Badge variant="outline">Unknown</Badge>,
          action: null
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <ClientLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">KYC Status</h1>
          <p className="text-muted-foreground mt-2">
            View your KYC verification status and details
          </p>
        </div>

        <Alert variant={statusInfo.variant}>
          <div className="flex items-start gap-4">
            {statusInfo.icon}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">{statusInfo.title}</h3>
                {statusInfo.badge}
              </div>
              <AlertDescription>{statusInfo.description}</AlertDescription>
              {kycSubmission?.reviewer_notes && kycSubmission.submission_status === 'rejected' && (
                <div className="mt-3 p-3 bg-destructive/10 rounded border border-destructive/20">
                  <strong>Rejection Reason:</strong><br />
                  <span className="text-sm">{kycSubmission.reviewer_notes}</span>
                </div>
              )}
              {statusInfo.action && (
                <div className="mt-4">
                  {statusInfo.action}
                </div>
              )}
            </div>
          </div>
        </Alert>

        {kycSubmission && (
          <Card>
            <CardHeader>
              <CardTitle>Submission Details</CardTitle>
              <CardDescription>Your KYC submission information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Company Name</p>
                  <p className="font-semibold">{kycSubmission.company_legal_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CR Number</p>
                  <p className="font-semibold">{kycSubmission.cr_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">VAT Number</p>
                  <p className="font-semibold">{kycSubmission.vat_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Type</p>
                  <Badge>{kycSubmission.account_type.toUpperCase()}</Badge>
                </div>
              </div>

              {kycSubmission.account_type === 'credit' && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold mb-3">Credit Terms</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Credit Ceiling</p>
                      <p className="font-semibold">SAR {kycSubmission.credit_ceiling?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Period</p>
                      <p className="font-semibold">{kycSubmission.payment_period_days} days</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted On</p>
                    <p className="font-semibold">
                      {new Date(kycSubmission.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  {kycSubmission.reviewed_at && (
                    <div>
                      <p className="text-sm text-muted-foreground">Reviewed On</p>
                      <p className="font-semibold">
                        {new Date(kycSubmission.reviewed_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ClientLayout>
  );
};

export default KYCStatus;
