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
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';
import { cn } from '@/lib/utils';

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
  const languageContext = useOptionalLanguage();
  const { t, isRTL, formatDate } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false,
    formatDate: (date: Date) => date.toLocaleDateString()
  };
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
        title: t('common.error'),
        description: t('admin.requestsManagement.fetchError'),
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
        title: t('common.success'),
        description: status === 'approved' ? t('admin.requestsManagement.approveSuccess') : t('admin.requestsManagement.rejectSuccess'),
      });

      fetchRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
      toast({
        title: t('common.error'),
        description: t('admin.requestsManagement.updateError'),
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'new': return 'info';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getApprovalBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  const getUrgencyBadgeVariant = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'destructive';
      case 'high': return 'warning';
      case 'medium': return 'secondary';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const pendingRequests = requests.filter(r => r.admin_approval_status === 'pending');
  const approvedRequests = requests.filter(r => r.admin_approval_status === 'approved');
  const rejectedRequests = requests.filter(r => r.admin_approval_status === 'rejected');

  return (
    <div className={cn("p-6 space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
          {t('admin.requestsManagement.title')}
        </h1>
        <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
          {t('admin.requestsManagement.description')}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.requestsManagement.totalRequests')}</CardTitle>
            <Clock className="h-4 w-4 text-foreground opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.requestsManagement.pendingApproval')}</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingRequests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.requestsManagement.approved')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{approvedRequests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.requestsManagement.rejected')}</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{rejectedRequests.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{t('admin.requestsManagement.filtersAndSearch')}</CardTitle>
          </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground opacity-75" />
              <Input
                placeholder={t('admin.requestsManagement.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('admin.requestsManagement.statusPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.requestsManagement.allStatuses')}</SelectItem>
                <SelectItem value="new">{t('admin.requestsManagement.new')}</SelectItem>
                <SelectItem value="in_progress">{t('admin.requestsManagement.inProgress')}</SelectItem>
                <SelectItem value="completed">{t('admin.requestsManagement.completed')}</SelectItem>
                <SelectItem value="cancelled">{t('admin.requestsManagement.cancelled')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={approvalFilter} onValueChange={setApprovalFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('admin.requestsManagement.approvalStatusPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.requestsManagement.allApprovals')}</SelectItem>
                <SelectItem value="pending">{t('admin.requestsManagement.pending')}</SelectItem>
                <SelectItem value="approved">{t('admin.requestsManagement.approved')}</SelectItem>
                <SelectItem value="rejected">{t('admin.requestsManagement.rejected')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('admin.requestsManagement.urgencyPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.requestsManagement.allUrgencies')}</SelectItem>
                <SelectItem value="urgent">{t('admin.requestsManagement.urgent')}</SelectItem>
                <SelectItem value="high">{t('admin.requestsManagement.high')}</SelectItem>
                <SelectItem value="medium">{t('admin.requestsManagement.medium')}</SelectItem>
                <SelectItem value="low">{t('admin.requestsManagement.low')}</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={fetchRequests} variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {t('admin.requestsManagement.refresh')}
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
          <TabsTrigger value="all">{t('admin.requestsManagement.allRequests')} ({filteredRequests.length})</TabsTrigger>
          <TabsTrigger value="pending">{t('admin.requestsManagement.pending')} ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="approved">{t('admin.requestsManagement.approved')} ({approvedRequests.length})</TabsTrigger>
          <TabsTrigger value="rejected">{t('admin.requestsManagement.rejected')} ({rejectedRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">{t('admin.requestsManagement.loading')}</div>
          ) : filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-foreground opacity-75">{t('admin.requestsManagement.noRequestsFound')}</p>
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
                        <div className="flex items-center gap-2 text-sm text-foreground opacity-75">
                          <User className="h-4 w-4" />
                          {request.user_profiles?.company_name || request.user_profiles?.full_name || t('admin.requestsManagement.unknownClient')}
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
                      <Badge variant={getApprovalBadgeVariant(request.admin_approval_status)}>
                        {request.admin_approval_status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant={getStatusBadgeVariant(request.status)}>
                        {request.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant={getUrgencyBadgeVariant(request.urgency)}>
                        {request.urgency.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-foreground opacity-75">{t('admin.requestsManagement.budgetRange')}</p>
                      <p className="text-sm">
                        {request.budget_min && request.budget_max 
                          ? `${request.budget_min.toLocaleString()} - ${request.budget_max.toLocaleString()} ${request.currency || 'SAR'}`
                          : t('admin.requestsManagement.notSpecified')
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground opacity-75">{t('admin.requestsManagement.deadline')}</p>
                      <p className="text-sm">
                        {request.deadline ? format(new Date(request.deadline), 'MMM dd, yyyy') : t('admin.requestsManagement.notSpecified')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground opacity-75">{t('admin.requestsManagement.offersReceived')}</p>
                      <p className="text-sm font-bold text-primary">{request._count?.offers || 0} {t('admin.requestsManagement.offers')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground opacity-75">{t('admin.requestsManagement.created')}</p>
                      <p className="text-sm">{format(new Date(request.created_at), 'MMM dd, yyyy HH:mm')}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {t('admin.requestsManagement.viewDetails')}
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {t('admin.requestsManagement.contactClient')}
                    </Button>
                    
                    {request.admin_approval_status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => updateApprovalStatus(request.id, 'approved')}
                        >
                          <CheckCircle className="h-4 w-4" />
                          {t('admin.requestsManagement.approve')}
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => updateApprovalStatus(request.id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4" />
                          {t('admin.requestsManagement.reject')}
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
