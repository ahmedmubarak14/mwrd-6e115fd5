
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Clock, TrendingUp, Package, Search, MessageSquare, Eye, CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { AdminPageContainer } from '@/components/admin/AdminPageContainer';

interface AdminOffer {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  delivery_time_days: number;
  status: string;
  client_approval_status: string;
  admin_approval_status: string;
  created_at: string;
  updated_at: string;
  vendor_id: string;
  request_id: string;
  request?: {
    title: string;
    client_id: string;
    category: string;
    budget_min?: number;
    budget_max?: number;
  };
  vendor?: {
    full_name?: string;
    company_name?: string;
    email: string;
  };
  client?: {
    full_name?: string;
    company_name?: string;
    email: string;
  };
}

const AdminOffers = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [offers, setOffers] = useState<AdminOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          request:requests(title, client_id, category, budget_min, budget_max),
          vendor:user_profiles!offers_vendor_id_fkey(full_name, company_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch client information for each offer
      const enrichedOffers = await Promise.all(
        (data || []).map(async (offer) => {
          if (offer.request?.client_id) {
            const { data: clientData } = await supabase
              .from('user_profiles')
              .select('full_name, company_name, email')
              .eq('user_id', offer.request.client_id)
              .single();
            
            return {
              ...offer,
              client: clientData
            };
          }
          return offer;
        })
      );

      setOffers(enrichedOffers as AdminOffer[]);
    } catch (error) {
      console.error('Error fetching offers:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch offers',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOfferApproval = async (offerId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ 
          admin_approval_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', offerId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Offer ${status} successfully`,
      });

      fetchOffers();
    } catch (error) {
      console.error('Error updating offer status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update offer status',
        variant: 'destructive'
      });
    }
  };

  const escalateToSupport = async (offerId: string, type: 'pricing' | 'delivery' | 'quality') => {
    try {
      const offer = offers.find(o => o.id === offerId);
      if (!offer) return;

      const { error } = await supabase
        .from('support_tickets')
        .insert([{
          user_id: user?.id,
          subject: `Offer Issue - ${type.charAt(0).toUpperCase() + type.slice(1)}`,
          category: 'offer_issue',
          priority: 'high',
          status: 'open'
        }]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Issue escalated to support team',
      });
    } catch (error) {
      console.error('Error escalating to support:', error);
      toast({
        title: 'Error',
        description: 'Failed to escalate to support',
        variant: 'destructive'
      });
    }
  };

  const initiateConversation = async (vendorId: string, clientId: string, offerId: string) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert([{
          client_id: clientId,
          vendor_id: vendorId,
          offer_id: offerId,
          status: 'active',
          conversation_type: 'business'
        }])
        .select()
        .single();

      if (error) throw error;

      // Send initial message
      await supabase
        .from('messages')
        .insert([{
          conversation_id: data.id,
          sender_id: user?.id,
          recipient_id: vendorId,
          content: 'Admin has initiated this conversation regarding the offer. Please discuss any concerns or questions here.',
          message_type: 'text'
        }]);

      toast({
        title: 'Success',
        description: 'Conversation initiated between all parties',
      });
    } catch (error) {
      console.error('Error initiating conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to initiate conversation',
        variant: 'destructive'
      });
    }
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.vendor?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.request?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || offer.client_approval_status === statusFilter;
    const matchesApproval = approvalFilter === 'all' || offer.admin_approval_status === approvalFilter;
    
    let matchesPrice = true;
    if (priceFilter !== 'all') {
      const price = offer.price;
      switch (priceFilter) {
        case 'low': matchesPrice = price < 10000; break;
        case 'medium': matchesPrice = price >= 10000 && price < 50000; break;
        case 'high': matchesPrice = price >= 50000; break;
      }
    }

    return matchesSearch && matchesStatus && matchesApproval && matchesPrice;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  const calculateConversionRate = () => {
    const approvedOffers = offers.filter(o => o.client_approval_status === 'approved').length;
    return offers.length > 0 ? ((approvedOffers / offers.length) * 100).toFixed(1) : '0';
  };

  const calculateAveragePrice = () => {
    if (offers.length === 0) return 0;
    const total = offers.reduce((sum, offer) => sum + offer.price, 0);
    return (total / offers.length).toLocaleString();
  };

  const calculateAverageResponseTime = () => {
    return '2.5 hours';
  };

  const getUrgencyLevel = (offer: AdminOffer) => {
    const daysSinceCreated = Math.floor((Date.now() - new Date(offer.created_at).getTime()) / (1000 * 60 * 60 * 24));
    
    if (offer.admin_approval_status === 'pending' && daysSinceCreated > 2) return 'high';
    if (offer.client_approval_status === 'pending' && daysSinceCreated > 5) return 'medium';
    return 'normal';
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const pendingOffers = offers.filter(o => o.admin_approval_status === 'pending');
  const approvedOffers = offers.filter(o => o.admin_approval_status === 'approved');
  const clientApprovedOffers = offers.filter(o => o.client_approval_status === 'approved');
  const highUrgencyOffers = offers.filter(o => getUrgencyLevel(o) === 'high');

  return (
    <AdminPageContainer
      title="Offer Management"
      description="Monitor vendor responses, track conversion rates, and manage offer approvals with support integration"
    >

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
            <Package className="h-4 w-4 text-foreground opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offers.length}</div>
            <p className="text-xs text-foreground opacity-75">
              {pendingOffers.length} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-foreground opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateConversionRate()}%</div>
            <p className="text-xs text-foreground opacity-75">
              {clientApprovedOffers.length} offers accepted by clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-foreground opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateAveragePrice()} SAR</div>
            <p className="text-xs text-foreground opacity-75">
              Across all offers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-foreground opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateAverageResponseTime()}</div>
            <p className="text-xs text-foreground opacity-75">
              Vendor response time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{highUrgencyOffers.length}</div>
            <p className="text-xs text-foreground opacity-75">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground opacity-75" />
              <Input
                placeholder="Search offers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Client Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Client Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={approvalFilter} onValueChange={setApprovalFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Admin Approval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Admin Approvals</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="low">Less than 10,000 SAR</SelectItem>
                <SelectItem value="medium">10,000 - 50,000 SAR</SelectItem>
                <SelectItem value="high">Greater than 50,000 SAR</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={fetchOffers} variant="outline">
              Refresh
            </Button>

            <Button variant="outline" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for better organization */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Offers ({offers.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending Review ({pendingOffers.length})</TabsTrigger>
          <TabsTrigger value="urgent">High Priority ({highUrgencyOffers.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedOffers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading offers...</div>
            ) : filteredOffers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-foreground opacity-75">No offers found matching your filters.</p>
              </CardContent>
            </Card>
          ) : (
            filteredOffers.map((offer) => (
              <Card key={offer.id} className={getUrgencyLevel(offer) === 'high' ? 'border-orange-200 bg-orange-50/50' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{offer.title}</CardTitle>
                        {getUrgencyLevel(offer) === 'high' && (
                          <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {offer.description}
                      </CardDescription>
                      <div className="flex items-center gap-4 text-sm text-foreground opacity-75">
                        <span>For: {offer.request?.title}</span>
                        <span>•</span>
                        <span>Vendor: {offer.vendor?.company_name || offer.vendor?.full_name}</span>
                        <span>•</span>
                        <span>Client: {offer.client?.company_name || offer.client?.full_name}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-right">
                      <Badge variant={getStatusBadgeVariant(offer.client_approval_status)}>
                        Status: {offer.client_approval_status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-foreground opacity-75">Offer Price</p>
                      <p className="text-lg font-bold text-primary">
                        {offer.price.toLocaleString()} {offer.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground opacity-75">Request Budget</p>
                      <p className="text-sm">
                        {offer.request?.budget_min && offer.request?.budget_max
                          ? `${offer.request.budget_min.toLocaleString()} - ${offer.request.budget_max.toLocaleString()}`
                          : 'Not specified'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground opacity-75">Delivery Time</p>
                      <p className="text-sm">{offer.delivery_time_days} days</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground opacity-75">Created</p>
                      <p className="text-sm">{format(new Date(offer.created_at), 'MMM dd, yyyy HH:mm')}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => initiateConversation(offer.vendor_id, offer.request?.client_id || '', offer.id)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Start Group Chat
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => escalateToSupport(offer.id, 'pricing')}
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Escalate Issue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingOffers.map((offer) => (
            <Card key={offer.id}>
              <CardContent className="p-4">
                <div className="text-sm text-foreground opacity-75 mb-2">
                  {offer.title} - Pending admin approval since {format(new Date(offer.created_at), 'MMM dd, yyyy')}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="urgent" className="space-y-4">
          {highUrgencyOffers.map((offer) => (
            <Card key={offer.id} className="border-orange-200 bg-orange-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="font-medium">{offer.title}</span>
                  <Badge variant="outline" className="bg-orange-100 text-orange-700">
                    Requires Attention
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedOffers.map((offer) => (
            <Card key={offer.id}>
              <CardContent className="p-4">
                <div className="text-sm text-foreground opacity-75 mb-2">
                  {offer.title} - Approved and active
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </AdminPageContainer>
  );
};

export default AdminOffers;
