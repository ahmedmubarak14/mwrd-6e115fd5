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
  Download,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToastFeedback } from '@/hooks/useToastFeedback';
import { generateDocumentSignedUrl, verifyFileExists, extractFilePath } from '@/utils/documentStorage';

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
  const [documentStatus, setDocumentStatus] = useState<{ [key: string]: 'checking' | 'available' | 'missing' }>({});
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

      // Check document availability for each request
      transformedData.forEach(async (request) => {
        setDocumentStatus(prev => ({ ...prev, [request.id]: 'checking' }));
        
        // Extract file path from URL or use direct path
        const filePath = extractFilePath(request.document_url);
        const verification = await verifyFileExists(filePath);
        
        setDocumentStatus(prev => ({ 
          ...prev, 
          [request.id]: verification.success ? 'available' : 'missing' 
        }));
      });

    } catch (error: any) {
      console.error('Error fetching verification requests:', error);
      showError('Failed to load verification requests');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = async (filePath: string, requestId: string) => {
    const status = documentStatus[requestId];
    
    if (status === 'missing') {
      showError('Document not found in storage. The file may have been deleted or corrupted.');
      return;
    }

    // Extract file path before generating signed URL
    const actualFilePath = extractFilePath(filePath);
    const result = await generateDocumentSignedUrl(actualFilePath);
    if (result.success && result.signedUrl) {
      window.open(result.signedUrl, '_blank');
    } else {
      showError(result.error || 'Failed to access document');
    }
  };

  const handleDownloadDocument = async (filePath: string, companyName?: string, requestId?: string) => {
    const status = requestId ? documentStatus[requestId] : undefined;
    
    if (status === 'missing') {
      showError('Document not found in storage. Cannot download missing file.');
      return;
    }

    // Extract file path before generating signed URL
    const actualFilePath = extractFilePath(filePath);
    const result = await generateDocumentSignedUrl(actualFilePath, 300); // 5 minutes for download
    if (result.success && result.signedUrl) {
      const link = document.createElement('a');
      link.href = result.signedUrl;
      link.download = `CR_${companyName || 'document'}.pdf`;
      link.click();
    } else {
      showError(result.error || 'Failed to download document');
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

  const getDocumentStatusIndicator = (requestId: string) => {
    const status = documentStatus[requestId];
    
    switch (status) {
      case 'checking':
        return <Badge variant="outline">Checking...</Badge>;
      case 'available':
        return <Badge variant="default" className="bg-green-500">Available</Badge>;
      case 'missing':
        return <Badge variant="destructive">Missing</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
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

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Document Status:</span>
                      {getDocumentStatusIndicator(request.id)}
                    </div>
                  </div>
                </div>

                {documentStatus[request.id] === 'missing' && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Warning:</strong> The uploaded document file is missing from storage. 
                      This request may need to be rejected and the user asked to re-upload their document.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument(request.document_url, request.id)}
                      disabled={documentStatus[request.id] === 'missing'}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Document
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadDocument(
                        request.document_url, 
                        request.user_profiles?.company_name,
                        request.id
                      )}
                      disabled={documentStatus[request.id] === 'missing'}
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
                          disabled={processing === request.id || documentStatus[request.id] === 'missing'}
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
                      
                      {documentStatus[request.id] === 'missing' && (
                        <p className="text-sm text-destructive">
                          Note: Cannot approve request with missing document. Consider rejecting and asking user to re-upload.
                        </p>
                      )}
                      
                      {!reviewNotes[request.id]?.trim() && documentStatus[request.id] !== 'missing' && (
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
