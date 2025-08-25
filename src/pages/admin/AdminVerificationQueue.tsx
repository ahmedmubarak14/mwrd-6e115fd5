
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  UserCheck, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search,
  Filter,
  Eye,
  Download,
  Building2,
  User
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface VerificationRequest {
  id: string;
  user_id: string;
  document_type: string;
  document_url: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  reviewer_notes?: string;
  user_profiles?: {
    full_name?: string;
    email: string;
    company_name?: string;
    role: string;
  };
}

export const AdminVerificationQueue = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [reviewNotes, setReviewNotes] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  const fetchVerificationRequests = async () => {
    try {
      setLoading(true);
      
      // Get verification requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('verification_requests')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (requestsError) throw requestsError;

      // Enrich with user profile data
      const enrichedRequests = await Promise.all(
        (requestsData || []).map(async (request) => {
          const { data: userProfile } = await supabase
            .from('user_profiles')
            .select('full_name, email, company_name, role')
            .eq('user_id', request.user_id)
            .single();

          return {
            ...request,
            user_profiles: userProfile
          };
        })
      );

      setRequests(enrichedRequests);
    } catch (error: any) {
      console.error('Error fetching verification requests:', error);
      toast({
        title: "Error",
        description: "Failed to load verification requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('verification_requests')
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewer_notes: reviewNotes[requestId] || null
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Verification request ${status}`,
      });

      fetchVerificationRequests();
      setReviewNotes(prev => ({ ...prev, [requestId]: '' }));
    } catch (error: any) {
      console.error('Error reviewing request:', error);
      toast({
        title: "Error",
        description: "Failed to update verification request",
        variant: "destructive"
      });
    }
  };

  const filteredRequests = requests.filter(request => {
    const searchText = `${request.user_profiles?.full_name || ''} ${request.user_profiles?.email || ''} ${request.user_profiles?.company_name || ''}`;
    const matchesSearch = searchText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesType = typeFilter === 'all' || request.document_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Group requests by status
  const pendingRequests = filteredRequests.filter(r => r.status === 'pending');
  const approvedRequests = filteredRequests.filter(r => r.status === 'approved');
  const rejectedRequests = filteredRequests.filter(r => r.status === 'rejected');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'approved': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const VerificationCard = ({ request }: { request: VerificationRequest }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {request.user_profiles?.role === 'vendor' ? <Building2 className="h-4 w-4" /> : <User className="h-4 w-4" />}
              {request.user_profiles?.company_name || request.user_profiles?.full_name || 'Unknown User'}
            </CardTitle>
            <CardDescription className="mt-1">
              {request.user_profiles?.email} • {request.document_type.replace('_', ' ')}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant={getStatusColor(request.status)}>
              {getStatusIcon(request.status)}
              <span className="ml-1">{request.status}</span>
            </Badge>
            <Badge variant="outline">
              {request.user_profiles?.role}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Submitted: {format(new Date(request.submitted_at), 'MMM dd, yyyy HH:mm')}
          </div>
          
          {request.reviewed_at && (
            <div className="text-sm text-muted-foreground">
              Reviewed: {format(new Date(request.reviewed_at), 'MMM dd, yyyy HH:mm')}
            </div>
          )}

          {request.reviewer_notes && (
            <div className="text-sm">
              <strong>Review Notes:</strong> {request.reviewer_notes}
            </div>
          )}
          
          {request.status === 'pending' && (
            <div className="space-y-3">
              <Textarea
                placeholder="Add review notes..."
                value={reviewNotes[request.id] || ''}
                onChange={(e) => setReviewNotes(prev => ({ ...prev, [request.id]: e.target.value }))}
                className="min-h-20"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(request.document_url, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Document
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleReview(request.id, 'approved')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReview(request.id, 'rejected')}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}

          {request.status !== 'pending' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(request.document_url, '_blank')}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Document
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <LoadingSpinner text="Loading verification requests..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Verification Queue</h1>
        <p className="text-muted-foreground mt-2">
          Review and approve vendor verification requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedRequests.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="commercial_registration">Commercial Registration</SelectItem>
                <SelectItem value="business_license">Business License</SelectItem>
                <SelectItem value="tax_certificate">Tax Certificate</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Verification Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedRequests.length})</TabsTrigger>
          <TabsTrigger value="all">All Requests ({filteredRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <UserCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No pending verification requests</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingRequests.map((request) => (
                <VerificationCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <div className="grid gap-4">
            {approvedRequests.map((request) => (
              <VerificationCard key={request.id} request={request} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <div className="grid gap-4">
            {rejectedRequests.map((request) => (
              <VerificationCard key={request.id} request={request} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {filteredRequests.map((request) => (
              <VerificationCard key={request.id} request={request} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
