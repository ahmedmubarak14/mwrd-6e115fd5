
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Eye, 
  Check, 
  X, 
  Clock, 
  User, 
  Building,
  FileText,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToastFeedback } from '@/hooks/useToastFeedback';

interface VerificationRequest {
  id: string;
  user_id: string;
  document_type: string;
  document_url: string;
  status: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
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
  const [reviewNotes, setReviewNotes] = useState<{ [key: string]: string }>({});
  const { showSuccess, showError } = useToastFeedback();

  const fetchVerificationRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .select(`
          *,
          user_profiles!inner(id, full_name, company_name, email)
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = (data || []).map(item => ({
        ...item,
        user_profiles: Array.isArray(item.user_profiles) ? item.user_profiles[0] : item.user_profiles
      }));
      
      setRequests(transformedData);
    } catch (error: any) {
      console.error('Error fetching verification requests:', error);
      showError('Failed to load verification requests');
    } finally {
      setLoading(false);
    }
  };

  const generateSignedUrl = async (filePath: string, expiresIn: number = 3600): Promise<string | null> => {
    try {
      // If the path is already a full URL, it's from old data - return as is
      if (filePath.startsWith('http')) {
        return filePath;
      }

      // Generate signed URL for the file path
      const { data, error } = await supabase.storage
        .from('chat-files')
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        console.error('Error creating signed URL:', error);
        showError('Failed to generate document access URL');
        return null;
      }

      return data.signedUrl;
    } catch (error: any) {
      console.error('Error generating signed URL:', error);
      showError('Failed to access document');
      return null;
    }
  };

  const handleViewDocument = async (filePath: string) => {
    const signedUrl = await generateSignedUrl(filePath);
    if (signedUrl) {
      window.open(signedUrl, '_blank');
    }
  };

  const handleDownloadDocument = async (filePath: string, companyName?: string) => {
    const signedUrl = await generateSignedUrl(filePath, 300); // 5 minutes for download
    if (signedUrl) {
      const link = document.createElement('a');
      link.href = signedUrl;
      link.download = `CR_${companyName || 'document'}.pdf`;
      link.click();
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: 'approved' | 'rejected') => {
    setProcessing(requestId);
    try {
      const { error } = await supabase
        .from('verification_requests')
        .update({
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          reviewer_notes: reviewNotes[requestId] || null
        })
        .eq('id', requestId);

      if (error) throw error;

      showSuccess(`Verification ${newStatus} successfully`);
      fetchVerificationRequests();
      setReviewNotes(prev => ({ ...prev, [requestId]: '' }));
    } catch (error: any) {
      console.error('Error updating verification status:', error);
      showError('Failed to update verification status');
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'under_review':
        return <Badge variant="outline">Under Review</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">Loading verification requests...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Verification Queue
          </CardTitle>
          <CardDescription>
            Review and approve client Commercial Registration documents
          </CardDescription>
        </CardHeader>
      </Card>

      {requests.length === 0 ? (
        <Alert>
          <AlertDescription>No verification requests pending review.</AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">
                        {request.user_profiles?.full_name || 'Unknown User'}
                      </span>
                      {getStatusBadge(request.status)}
                    </div>
                    
                    {request.user_profiles?.company_name && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-4 w-4" />
                        <span>{request.user_profiles.company_name}</span>
                      </div>
                    )}
                    
                    <div className="text-sm text-muted-foreground">
                      Email: {request.user_profiles?.email}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Submitted: {new Date(request.submitted_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument(request.document_url)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Document
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadDocument(request.document_url, request.user_profiles?.company_name)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>

                  {request.status === 'pending' && (
                    <>
                      <Textarea
                        placeholder="Add review notes (optional for approval, required for rejection)..."
                        value={reviewNotes[request.id] || ''}
                        onChange={(e) => setReviewNotes(prev => ({ ...prev, [request.id]: e.target.value }))}
                        rows={3}
                      />
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleStatusUpdate(request.id, 'approved')}
                          disabled={processing === request.id}
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {processing === request.id ? 'Processing...' : 'Approve'}
                        </Button>
                        
                        <Button
                          onClick={() => handleStatusUpdate(request.id, 'rejected')}
                          disabled={processing === request.id || !reviewNotes[request.id]?.trim()}
                          variant="destructive"
                          size="sm"
                        >
                          <X className="h-4 w-4 mr-1" />
                          {processing === request.id ? 'Processing...' : 'Reject'}
                        </Button>
                      </div>
                      
                      {!reviewNotes[request.id]?.trim() && (
                        <p className="text-sm text-muted-foreground">
                          Note: Rejection requires review notes to inform the client.
                        </p>
                      )}
                    </>
                  )}

                  {request.reviewer_notes && (
                    <Alert>
                      <AlertDescription>
                        <strong>Review Notes:</strong><br />
                        {request.reviewer_notes}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
