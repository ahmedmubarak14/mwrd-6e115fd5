
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
      showError('Failed to load verification status');
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
      case 'approved': return <Badge variant="default" className="bg-success">Approved</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      case 'under_review': return <Badge variant="outline">Under Review</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (!userProfile) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Verification Status
          </CardTitle>
          <CardDescription>
            Track your document verification progress
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchVerificationRequests}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(userProfile.verification_status || 'pending')}
            <div>
              <p className="font-medium">Account Status</p>
              <p className="text-sm text-muted-foreground">
                {userProfile.verification_status === 'approved' ? 'Fully verified and active' :
                 userProfile.verification_status === 'rejected' ? 'Verification rejected' :
                 userProfile.verification_status === 'under_review' ? 'Documents under review' :
                 'Verification pending'}
              </p>
            </div>
          </div>
          {getStatusBadge(userProfile.verification_status || 'pending')}
        </div>

        {/* Verification Notes */}
        {userProfile.verification_notes && (
          <Alert variant={userProfile.verification_status === 'rejected' ? 'destructive' : 'default'}>
            <AlertDescription>
              <strong>Admin Notes:</strong><br />
              {userProfile.verification_notes}
            </AlertDescription>
          </Alert>
        )}

        {/* Document History */}
        <div className="space-y-3">
          <h4 className="font-medium">Document Submissions</h4>
          
          {verificationRequests.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No documents have been submitted yet. Please upload your Commercial Registration to begin verification.
              </AlertDescription>
            </Alert>
          ) : (
            verificationRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    <span className="font-medium">Commercial Registration</span>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Submitted: {new Date(request.submitted_at).toLocaleDateString()}</p>
                  {request.reviewed_at && (
                    <p>Reviewed: {new Date(request.reviewed_at).toLocaleDateString()}</p>
                  )}
                </div>

                {request.reviewer_notes && (
                  <Alert variant={request.status === 'rejected' ? 'destructive' : 'default'}>
                    <AlertDescription className="text-sm">
                      <strong>Review Notes:</strong><br />
                      {request.reviewer_notes}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(request.document_url, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    View Document
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
            <AlertDescription>
              <strong>Next Steps:</strong><br />
              {userProfile.verification_status === 'rejected' ? 
                'Please review the feedback above and upload a new Commercial Registration document.' :
                userProfile.verification_status === 'under_review' ?
                'Your documents are being reviewed. You will be notified once the review is complete.' :
                'Upload your Commercial Registration document to begin the verification process.'
              }
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
