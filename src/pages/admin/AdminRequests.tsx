import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, XCircle, Clock, Search, Filter, MessageSquare, Eye, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { BulkApprovalActions } from '@/components/admin/BulkApprovalActions';
import { Checkbox } from '@/components/ui/checkbox';

interface AdminRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_min?: number;
  budget_max?: number;
  currency?: string;
  location?: string;
  deadline?: string;
  urgency: string;
  status: string;
  admin_approval_status: string;
  created_at: string;
  updated_at: string;
  client_id: string;
  user_profiles?: {
    full_name?: string;
    email: string;
    company_name?: string;
  };
  offers?: any[];
  _count?: {
    offers: number;
  };
}

const AdminRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          user_profiles:client_id(full_name, email, company_name),
          offers(id, status)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedData = (data || []).map(request => ({
        ...request,
        _count: {
          offers: request.offers?.length || 0
        }
      }));

      setRequests(transformedData as AdminRequest[]);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch requests',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApprovalStatus = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('requests')
        .update({ 
          admin_approval_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Request ${status} successfully`,
      });

      fetchRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update request status',
        variant: 'destructive'
      });
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.user_profiles?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesApproval = approvalFilter === 'all' || request.admin_approval_status === approvalFilter;
    const matchesUrgency = urgencyFilter === 'all' || request.urgency === urgencyFilter;

    return matchesSearch && matchesStatus && matchesApproval && matchesUrgency;
  });

  const toggleRequestSelection = (requestId: string) => {
    setSelectedRequests(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const clearSelection = () => {
    setSelectedRequests([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const pendingRequests = requests.filter(r => r.admin_approval_status === 'pending');
  const approvedRequests = requests.filter(r => r.admin_approval_status === 'approved');
  const rejectedRequests = requests.filter(r => r.admin_approval_status === 'rejected');

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Request Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage all procurement requests across the platform
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedRequests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedRequests.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={approvalFilter} onValueChange={setApprovalFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Approval Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Approvals</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgencies</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={fetchRequests} variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedRequests.length > 0 && (
        <BulkApprovalActions
          selectedItems={selectedRequests}
          itemType="requests"
          onRefresh={fetchRequests}
          onClearSelection={clearSelection}
        />
      )}

      {/* Requests List */}
      <Tabs value="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Requests ({filteredRequests.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading requests...</div>
          ) : filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No requests found matching your filters.</p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Checkbox
                        checked={selectedRequests.includes(request.id)}
                        onCheckedChange={() => toggleRequestSelection(request.id)}
                      />
                      <div className="space-y-2 flex-1">
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {request.description}
                        </CardDescription>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          {request.user_profiles?.company_name || request.user_profiles?.full_name || 'Unknown Client'}
                          <span>•</span>
                          <span>{request.category}</span>
                          {request.location && (
                            <>
                              <span>•</span>
                              <span>{request.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-right">
                      <Badge className={getApprovalColor(request.admin_approval_status)}>
                        {request.admin_approval_status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Budget Range</p>
                      <p className="text-sm">
                        {request.budget_min && request.budget_max 
                          ? `${request.budget_min.toLocaleString()} - ${request.budget_max.toLocaleString()} ${request.currency || 'SAR'}`
                          : 'Not specified'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Deadline</p>
                      <p className="text-sm">
                        {request.deadline ? format(new Date(request.deadline), 'MMM dd, yyyy') : 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Offers Received</p>
                      <p className="text-sm font-bold text-primary">{request._count?.offers || 0} offers</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created</p>
                      <p className="text-sm">{format(new Date(request.created_at), 'MMM dd, yyyy HH:mm')}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      Contact Client
                    </Button>
                    
                    {request.admin_approval_status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => updateApprovalStatus(request.id, 'approved')}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => updateApprovalStatus(request.id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="pending">
          {/* Similar structure but filtered for pending */}
        </TabsContent>
        <TabsContent value="approved">
          {/* Similar structure but filtered for approved */}
        </TabsContent>
        <TabsContent value="rejected">
          {/* Similar structure but filtered for rejected */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminRequests;
