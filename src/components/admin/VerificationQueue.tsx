
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Eye, 
  Check, 
  X, 
  Clock, 
  User, 
  Building,
  FileText,
  Download,
  AlertTriangle,
  Search,
  Filter,
  Grid,
  List,
  CheckSquare,
  XSquare,
  TrendingUp,
  Users,
  FileCheck,
  FileX,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToastFeedback } from '@/hooks/useToastFeedback';
import { generateDocumentSignedUrl, verifyFileExists, extractFilePath } from '@/utils/documentStorage';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';
import { cn } from '@/lib/utils';

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

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'under_review';

export const VerificationQueue = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<{ [key: string]: string }>({});
  const [documentStatus, setDocumentStatus] = useState<{ [key: string]: 'checking' | 'available' | 'missing' }>({});
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'name'>('date');
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState<'approve' | 'reject' | null>(null);
  const [bulkNotes, setBulkNotes] = useState('');
  const { showSuccess, showError } = useToastFeedback();
  const languageContext = useOptionalLanguage();
  const { t, isRTL, formatDate } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false,
    formatDate: (date: Date) => date.toLocaleDateString()
  };

  // Memoized filtered and sorted requests
  const filteredAndSortedRequests = useMemo(() => {
    let filtered = requests;
    
    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(request => request.status === activeFilter);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(request => 
        request.user_profiles?.full_name?.toLowerCase().includes(query) ||
        request.user_profiles?.company_name?.toLowerCase().includes(query) ||
        request.user_profiles?.email?.toLowerCase().includes(query) ||
        request.document_type.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          const nameA = a.user_profiles?.full_name || a.user_profiles?.email || '';
          const nameB = b.user_profiles?.full_name || b.user_profiles?.email || '';
          return nameA.localeCompare(nameB);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
        default:
          return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
      }
    });
    
    return filtered;
  }, [requests, activeFilter, searchQuery, sortBy]);

  // Analytics calculations
  const analytics = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === 'pending').length;
    const approved = requests.filter(r => r.status === 'approved').length;
    const rejected = requests.filter(r => r.status === 'rejected').length;
    const underReview = requests.filter(r => r.status === 'under_review').length;
    
    // Calculate average processing time for completed requests
    const completedRequests = requests.filter(r => r.reviewed_at && r.submitted_at);
    const avgProcessingTime = completedRequests.length > 0 
      ? completedRequests.reduce((sum, r) => {
          const submitted = new Date(r.submitted_at).getTime();
          const reviewed = new Date(r.reviewed_at!).getTime();
          return sum + (reviewed - submitted);
        }, 0) / completedRequests.length / (1000 * 60 * 60 * 24) // Convert to days
      : 0;
    
    const approvalRate = total > 0 ? ((approved / (approved + rejected)) * 100) : 0;
    
    return {
      total,
      pending,
      approved,
      rejected,
      underReview,
      avgProcessingTime: Math.round(avgProcessingTime * 10) / 10,
      approvalRate: Math.round(approvalRate * 10) / 10
    };
  }, [requests]);

  // Memoized status counts for tab labels
  const statusCounts = useMemo(() => {
    return {
      all: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length,
      under_review: requests.filter(r => r.status === 'under_review').length
    };
  }, [requests]);

  const fetchVerificationRequests = async () => {
    try {
      setLoading(true);
      
      // Fetch real verification requests from database
      const { data, error } = await supabase
        .from('verification_requests')
        .select(`
          *,
          user_profiles(
            id,
            full_name,
            company_name,
            email
          )
        `)
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        // If table doesn't exist, show helpful message
        if (error.code === '42P01') {
          showError('Verification requests table not found. Please contact administrator to set up the database schema.');
          return;
        }
        throw error;
      }

      const transformedRequests: VerificationRequest[] = (data || []).map(request => ({
        id: request.id,
        user_id: request.user_id,
        document_type: request.document_type,
        document_url: request.document_url,
        status: request.status,
        submitted_at: request.submitted_at,
        reviewed_at: request.reviewed_at || undefined,
        reviewed_by: request.reviewed_by || undefined,
        reviewer_notes: request.reviewer_notes || undefined,
        user_profiles: Array.isArray(request.user_profiles) 
          ? request.user_profiles[0] || undefined
          : request.user_profiles || undefined
      }));

      setRequests(transformedRequests);

      // Check document availability for each request
      transformedRequests.forEach(async (request) => {
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
      
      // If it's a table not found error, provide a clearer message
      if (error.code === '42P01') {
        showError('Database table "verification_requests" not found. The verification system needs to be set up in the database first.');
      } else {
        showError('Failed to load verification requests. Using demo data for now.');
        
        // Fall back to demo data if real data fetch fails
        const demoData: VerificationRequest[] = [
          {
            id: 'demo-1',
            user_id: 'demo-user-1',
            document_type: 'business_license',
            document_url: '/demo/business-license.pdf',
            status: 'pending',
            submitted_at: new Date().toISOString(),
            user_profiles: {
              id: 'demo-profile-1',
              full_name: 'Demo User 1',
              company_name: 'Demo Company Ltd',
              email: 'demo1@example.com'
            }
          },
          {
            id: 'demo-2',
            user_id: 'demo-user-2',
            document_type: 'tax_certificate',
            document_url: '/demo/tax-certificate.pdf',
            status: 'approved',
            submitted_at: new Date(Date.now() - 86400000).toISOString(),
            user_profiles: {
              id: 'demo-profile-2',
              full_name: 'Demo User 2',
              company_name: 'Another Demo Corp',
              email: 'demo2@example.com'
            }
          }
        ];
        
        setRequests(demoData);
        
        // Set demo document status
        demoData.forEach(request => {
          setDocumentStatus(prev => ({ ...prev, [request.id]: 'available' }));
        });
      }
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
          reviewer_notes: reviewNotes[requestId] || null,
          reviewed_by: 'current_admin' // You might want to get this from auth context
        })
        .eq('id', requestId);

      if (error) throw error;

      // Refresh the data
      await fetchVerificationRequests();
      
      showSuccess(`Request ${newStatus} successfully`);
      setReviewNotes(prev => ({ ...prev, [requestId]: '' }));
    } catch (error: any) {
      console.error('Error updating verification status:', error);
      showError('Failed to update request status');
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">{t('verification.approved')}</Badge>;
      case 'rejected':
        return <Badge variant="destructive">{t('verification.rejected')}</Badge>;
      case 'under_review':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">{t('verification.underReview')}</Badge>;
      default:
        return <Badge variant="secondary">{t('users.pending')}</Badge>;
    }
  };

  const getDocumentStatusIndicator = (requestId: string) => {
    const status = documentStatus[requestId];
    
    switch (status) {
      case 'checking':
        return <Badge variant="outline">{t('verification.checking')}</Badge>;
      case 'available':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">{t('verification.available')}</Badge>;
      case 'missing':
        return <Badge variant="destructive">{t('verification.missing')}</Badge>;
      default:
        return <Badge variant="secondary">{t('verification.unknown')}</Badge>;
    }
  };

  const renderRequestCard = (request: VerificationRequest) => (
    <Card key={request.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selectedRequests.includes(request.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedRequests([...selectedRequests, request.id]);
                  } else {
                    setSelectedRequests(selectedRequests.filter(id => id !== request.id));
                  }
                }}
              />
              <User className="h-5 w-5 text-primary" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {request.user_profiles?.full_name || 'Unknown User'}
                </span>
                {getStatusBadge(request.status)}
              </div>
            </div>
            
            {request.user_profiles?.company_name && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground ml-8">
                <Building className="h-4 w-4" />
                <span className="font-medium">{request.user_profiles.company_name}</span>
              </div>
            )}
            
            <div className="ml-8 space-y-1">
              <div className="text-sm text-muted-foreground">
                <strong>Email:</strong> {request.user_profiles?.email}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Submitted: {formatDate(new Date(request.submitted_at))}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Document Status:</span>
                {getDocumentStatusIndicator(request.id)}
              </div>
            </div>
          </div>
        </div>

        {documentStatus[request.id] === 'missing' && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> Document file is missing from storage. Cannot approve without valid document.
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
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
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
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>

          {request.status === 'pending' && (
            <>
              <Textarea
                placeholder="Add review notes (required for rejection)..."
                value={reviewNotes[request.id] || ''}
                onChange={(e) => setReviewNotes(prev => ({ ...prev, [request.id]: e.target.value }))}
                rows={3}
                className="resize-none"
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={() => handleStatusUpdate(request.id, 'approved')}
                  disabled={processing === request.id || documentStatus[request.id] === 'missing'}
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {processing === request.id ? 'Processing...' : 'Approve'}
                </Button>
                
                <Button
                  onClick={() => handleStatusUpdate(request.id, 'rejected')}
                  disabled={processing === request.id || !reviewNotes[request.id]?.trim()}
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  {processing === request.id ? 'Processing...' : 'Reject'}
                </Button>
              </div>
              
              {documentStatus[request.id] === 'missing' && (
                <p className="text-sm text-destructive">
                  Cannot approve request with missing documentation.
                </p>
              )}
              
              {!reviewNotes[request.id]?.trim() && documentStatus[request.id] !== 'missing' && (
                <p className="text-sm text-muted-foreground">
                  Note: Review notes are required for rejection.
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
  );

  const renderTableView = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5" />
          Verification Requests Table
        </CardTitle>
        <CardDescription>
          Comprehensive view of all verification requests
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRequests.length === filteredAndSortedRequests.length && filteredAndSortedRequests.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedRequests(filteredAndSortedRequests.map(r => r.id));
                    } else {
                      setSelectedRequests([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>Vendor Information</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedRequests.map((request) => (
              <TableRow key={request.id} className="hover:bg-muted/50">
                <TableCell>
                  <Checkbox
                    checked={selectedRequests.includes(request.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRequests([...selectedRequests, request.id]);
                      } else {
                        setSelectedRequests(selectedRequests.filter(id => id !== request.id));
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{request.user_profiles?.full_name || 'Unknown'}</div>
                    <div className="text-sm text-muted-foreground">{request.user_profiles?.company_name}</div>
                    <div className="text-xs text-muted-foreground">{request.user_profiles?.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <div>
                      <div className="text-sm font-medium">{request.document_type}</div>
                      {getDocumentStatusIndicator(request.id)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDate(new Date(request.submitted_at))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument(request.document_url, request.id)}
                      disabled={documentStatus[request.id] === 'missing'}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {request.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(request.id, 'approved')}
                          disabled={processing === request.id || documentStatus[request.id] === 'missing'}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusUpdate(request.id, 'rejected')}
                          disabled={processing === request.id || !reviewNotes[request.id]?.trim()}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

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
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Requests
            </CardDescription>
            <CardTitle className="text-2xl">{analytics.total}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Review
            </CardDescription>
            <CardTitle className="text-2xl text-orange-600">{analytics.pending}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Approved
            </CardDescription>
            <CardTitle className="text-2xl text-green-600">{analytics.approved}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <FileX className="h-4 w-4" />
              Rejected
            </CardDescription>
            <CardTitle className="text-2xl text-red-600">{analytics.rejected}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Under Review
            </CardDescription>
            <CardTitle className="text-2xl text-blue-600">{analytics.underReview}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Approval Rate
            </CardDescription>
            <CardTitle className="text-2xl">{analytics.approvalRate}%</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Avg. Processing
            </CardDescription>
            <CardTitle className="text-2xl">{analytics.avgProcessingTime}d</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, company, email, or document type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="status">Sort by Status</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
          >
            {viewMode === 'cards' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            {viewMode === 'cards' ? 'Table View' : 'Card View'}
          </Button>
          
          <Button variant="outline" size="sm" onClick={fetchVerificationRequests}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedRequests.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedRequests.length} requests selected
              </span>
              <div className="flex gap-2">
                <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setBulkAction('approve')}
                    >
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Bulk Approve
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Bulk {bulkAction === 'approve' ? 'Approve' : 'Reject'} Requests</DialogTitle>
                      <DialogDescription>
                        This will {bulkAction} {selectedRequests.length} selected verification requests.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        placeholder={`Notes for ${bulkAction} action...`}
                        value={bulkNotes}
                        onChange={(e) => setBulkNotes(e.target.value)}
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowBulkDialog(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => {
                            // Handle bulk action here
                            setShowBulkDialog(false);
                            setBulkNotes('');
                            setSelectedRequests([]);
                          }}
                        >
                          Confirm {bulkAction === 'approve' ? 'Approval' : 'Rejection'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setBulkAction('reject');
                    setShowBulkDialog(true);
                  }}
                >
                  <XSquare className="h-4 w-4 mr-2" />
                  Bulk Reject
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as StatusFilter)} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            All ({statusCounts.all})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({statusCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({statusCounts.approved})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({statusCounts.rejected})
          </TabsTrigger>
          <TabsTrigger value="under_review">
            Under Review ({statusCounts.under_review})
          </TabsTrigger>
        </TabsList>

        {(['all', 'pending', 'approved', 'rejected', 'under_review'] as StatusFilter[]).map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {filteredAndSortedRequests.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Verification Requests</h3>
                  <p className="text-muted-foreground">
                    {status === 'all' 
                      ? searchQuery 
                        ? 'No requests match your search criteria.'
                        : 'No verification requests found.'
                      : `No ${status} verification requests found.`
                    }
                  </p>
                  {searchQuery && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear Search
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : viewMode === 'cards' ? (
              <div className="grid gap-4">
                {filteredAndSortedRequests.map(renderRequestCard)}
              </div>
            ) : (
              renderTableView()
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
