
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  RefreshCw,
  Download 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToastFeedback } from '@/hooks/useToastFeedback';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface VerificationRequest {
  id: string;
  document_type: string;
  document_url: string;
  status: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewer_notes?: string;
}

export const VerificationStatus = () => {
  const { userProfile } = useAuth();
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToastFeedback();
  const { t, isRTL } = useLanguage();

  const fetchVerificationRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setVerificationRequests(data || []);
    } catch (error: any) {
      console.error('Error fetching verification requests:', error);
      showError(t('verification.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-success" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-destructive" />;
      case 'under_review': return <Clock className="h-5 w-5 text-warning" />;
      default: return <AlertTriangle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge variant="default" className="bg-success">{t('verification.approved')}</Badge>;
      case 'rejected': return <Badge variant="destructive">{t('verification.rejected')}</Badge>;
      case 'under_review': return <Badge variant="outline">{t('verification.underReview')}</Badge>;
      default: return <Badge variant="secondary">{t('verification.pending')}</Badge>;
    }
  };

  if (!userProfile) return null;

  return (
    <Card>
      <CardHeader className={cn(
        "flex flex-row items-center justify-between",
        isRTL && "flex-row-reverse"
      )}>
        <div className={cn(isRTL && "text-right")}>
          <CardTitle className={cn(
            "flex items-center gap-2",
            isRTL && "flex-row-reverse"
          )}>
            <FileText className="h-5 w-5" />
            {t('verification.title')}
          </CardTitle>
          <CardDescription>
            {t('verification.description')}
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchVerificationRequests}
          disabled={loading}
          className={cn(isRTL && "ml-0 mr-4")}
        >
          <RefreshCw className={cn(
            "h-4 w-4", 
            loading && "animate-spin",
            isRTL ? "ml-2 mr-0" : "mr-2 ml-0"
          )} />
          {t('verification.refresh')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className={cn(
          "flex items-center justify-between p-4 border rounded-lg",
          isRTL && "flex-row-reverse"
        )}>
          <div className={cn(
            "flex items-center gap-3",
            isRTL && "flex-row-reverse"
          )}>
            {getStatusIcon(userProfile.verification_status || 'pending')}
            <div className={cn(isRTL && "text-right")}>
              <p className="font-medium">{t('verification.accountStatus')}</p>
              <p className="text-sm text-muted-foreground">
                {userProfile.verification_status === 'approved' ? t('verification.verified') :
                 userProfile.verification_status === 'rejected' ? t('verification.verificationRejected') :
                 userProfile.verification_status === 'under_review' ? t('verification.documentsUnderReview') :
                 t('verification.verificationPending')}
              </p>
            </div>
          </div>
          {getStatusBadge(userProfile.verification_status || 'pending')}
        </div>

        {/* Verification Notes */}
        {userProfile.verification_notes && (
          <Alert variant={userProfile.verification_status === 'rejected' ? 'destructive' : 'default'}>
            <AlertDescription className={cn(isRTL && "text-right")}>
              <strong>{t('verification.adminNotes')}:</strong><br />
              {userProfile.verification_notes}
            </AlertDescription>
          </Alert>
        )}

        {/* Document History */}
        <div className="space-y-3">
          <h4 className={cn(
            "font-medium",
            isRTL && "text-right"
          )}>{t('verification.documentSubmissions')}</h4>
          
          {verificationRequests.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className={cn(isRTL && "text-right")}>
                {t('verification.noDocumentsSubmitted')}
              </AlertDescription>
            </Alert>
          ) : (
            verificationRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 space-y-2">
                <div className={cn(
                  "flex items-center justify-between",
                  isRTL && "flex-row-reverse"
                )}>
                  <div className={cn(
                    "flex items-center gap-2",
                    isRTL && "flex-row-reverse"
                  )}>
                    {getStatusIcon(request.status)}
                    <span className="font-medium">{t('verification.commercialRegistration')}</span>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                
                <div className={cn(
                  "text-sm text-muted-foreground space-y-1",
                  isRTL && "text-right"
                )}>
                  <p>{t('verification.submitted')}: {new Date(request.submitted_at).toLocaleDateString()}</p>
                  {request.reviewed_at && (
                    <p>{t('verification.reviewed')}: {new Date(request.reviewed_at).toLocaleDateString()}</p>
                  )}
                </div>

                {request.reviewer_notes && (
                  <Alert variant={request.status === 'rejected' ? 'destructive' : 'default'}>
                    <AlertDescription className={cn(
                      "text-sm",
                      isRTL && "text-right"
                    )}>
                      <strong>{t('verification.reviewNotes')}:</strong><br />
                      {request.reviewer_notes}
                    </AlertDescription>
                  </Alert>
                )}

                <div className={cn(
                  "flex gap-2",
                  isRTL && "flex-row-reverse"
                )}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(request.document_url, '_blank')}
                  >
                    <Download className={cn(
                      "h-4 w-4",
                      isRTL ? "ml-1 mr-0" : "mr-1 ml-0"
                    )} />
                    {t('verification.viewDocument')}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Next Steps */}
        {userProfile.verification_status !== 'approved' && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className={cn(isRTL && "text-right")}>
              <strong>{t('verification.nextSteps')}:</strong><br />
              {userProfile.verification_status === 'rejected' ? 
                t('verification.reviewFeedback') :
                userProfile.verification_status === 'under_review' ?
                t('verification.documentsBeingReviewed') :
                t('verification.beginVerification')
              }
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
