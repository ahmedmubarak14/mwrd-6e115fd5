
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Eye,
  User,
  Building,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToastFeedback } from '@/hooks/useToastFeedback';
import { useAuth } from '@/contexts/AuthContext';

interface VerificationRequest {
  id: string;
  user_id: string;
  document_type: string;
  document_url: string;
  status: string;
  submitted_at: string;
  reviewer_notes?: string;
  user_profiles?: {
    id: string;
    full_name?: string;
    company_name?: string;
    email: string;
  };
}

export const VerificationQueue = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [documentDialog, setDocumentDialog] = useState(false);
  const { userProfile } = useAuth();
  const { showSuccess, showError } = useToastFeedback();

  const fetchVerificationRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('verification_requests')
        .select(`
          *,
          user_profiles:user_id (
            id,
            full_name,
            company_name,
            email
          )
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      console.error('Error fetching verification requests:', error);
      showError('Failed to load verification requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  const handleApprove = async (requestId: string) => {
    await processRequest(requestId, 'approved', reviewNotes);
  };

  const handleReject = async (requestId: string) => {
    if (!reviewNotes.trim()) {
      showError('Please provide rejection notes');
      return;
    }
    await processRequest(requestId, 'rejected', reviewNotes);
  };

  const processRequest = async (requestId: string, status: 'approved' | 'rejected', notes: string) => {
    try {
      setProcessing(requestId);
      
      const { error } = await supabase
        .from('verification_requests')
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: userProfile?.user_id,
          reviewer_notes: notes
        })
        .eq('id', requestId);

      if (error) throw error;

      showSuccess(`Verification ${status} successfully`);
      setSelectedRequest(null);
      setReviewNotes('');
      setDocumentDialog(false);
      await fetchVerificationRequests();
    } catch (error: any) {
      console.error('Error processing verification:', error);
      showError(`Failed to ${status} verification`);
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-success">Approved</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      case 'under_review': return <Badge variant="outline">Under Review</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending' || r.status === 'under_review');
  const processedRequests = requests.filter(r => r.status === 'approved' || r.status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Verification Queue</h2>
          <p className="text-muted-foreground">Review and approve Commercial Registration documents</p>
        </div>
        <Button
          variant="outline"
          onClick={fetchVerificationRequests}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Reviews ({pendingRequests.length})
          </CardTitle>
          <CardDescription>
            Documents awaiting review and approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>No pending verification requests</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">
                          {request.user_profiles?.full_name || 'Unknown User'}
                        </span>
                        {getStatusBadge(request.status)}
                      </div>
                      {request.user_profiles?.company_name && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building className="h-3 w-3" />
                          {request.user_profiles.company_name}
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {request.user_profiles?.email}
                      </p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>Submitted:</p>
                      <p>{new Date(request.submitted_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog open={documentDialog && selectedRequest?.id === request.id} onOpenChange={setDocumentDialog}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setReviewNotes(request.reviewer_notes || '');
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review Document
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Review Commercial Registration</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {/* User Info */}
                          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                            <div>
                              <label className="text-sm font-medium">Full Name:</label>
                              <p>{request.user_profiles?.full_name || 'N/A'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Company:</label>
                              <p>{request.user_profiles?.company_name || 'N/A'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Email:</label>
                              <p>{request.user_profiles?.email}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Submitted:</label>
                              <p>{new Date(request.submitted_at).toLocaleString()}</p>
                            </div>
                          </div>

                          {/* Document Viewer */}
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium">Commercial Registration Document</h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(request.document_url, '_blank')}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                Open in New Tab
                              </Button>
                            </div>
                            <iframe
                              src={request.document_url}
                              className="w-full h-96 border rounded"
                              title="Commercial Registration Document"
                            />
                          </div>

                          {/* Review Notes */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Review Notes:</label>
                            <Textarea
                              value={reviewNotes}
                              onChange={(e) => setReviewNotes(e.target.value)}
                              placeholder="Add notes about the verification (required for rejection)"
                              rows={3}
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setDocumentDialog(false);
                                setSelectedRequest(null);
                                setReviewNotes('');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleReject(request.id)}
                              disabled={processing === request.id}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              {processing === request.id ? 'Processing...' : 'Reject'}
                            </Button>
                            <Button
                              onClick={() => handleApprove(request.id)}
                              disabled={processing === request.id}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {processing === request.id ? 'Processing...' : 'Approve'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processed Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews ({processedRequests.slice(0, 10).length})</CardTitle>
          <CardDescription>
            Recently processed verification requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {processedRequests.slice(0, 10).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {request.user_profiles?.full_name || 'Unknown User'}
                    </span>
                    {getStatusBadge(request.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {request.user_profiles?.email}
                  </p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>Processed:</p>
                  <p>{new Date(request.submitted_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
