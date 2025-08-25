
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Clock, TrendingUp, Package, Search, MessageSquare, Eye, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface AdminOffer {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  delivery_time_days: number;
  status: 'pending' | 'accepted' | 'rejected';
  client_approval_status: 'pending' | 'approved' | 'rejected';
  admin_approval_status: 'pending' | 'approved' | 'rejected';
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

      setOffers(enrichedOffers);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
    // This would need more data to calculate accurately
    return '2.5 hours'; // Placeholder
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const pendingOffers = offers.filter(o => o.admin_approval_status === 'pending');
  const approvedOffers = offers.filter(o => o.admin_approval_status === 'approved');
  const clientApprovedOffers = offers.filter(o => o.client_approval_status === 'approved');

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Offer Management</h1>
        <p className="text-muted-foreground">
          Monitor vendor responses, track conversion rates, and manage offer approvals
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offers.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingOffers.length} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateConversionRate()}%</div>
            <p className="text-xs text-muted-foreground">
              {clientApprovedOffers.length} offers accepted by clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateAveragePrice()} SAR</div>
            <p className="text-xs text-muted-foreground">
              Across all offers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateAverageResponseTime()}</div>
            <p className="text-xs text-muted-foreground">
              Vendor response time
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                <SelectItem value="low">< 10,000 SAR</SelectItem>
                <SelectItem value="medium">10,000 - 50,000 SAR</SelectItem>
                <SelectItem value="high">> 50,000 SAR</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={fetchOffers} variant="outline">
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Offers List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading offers...</div>
        ) : filteredOffers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No offers found matching your filters.</p>
            </CardContent>
          </Card>
        ) : (
          filteredOffers.map((offer) => (
            <Card key={offer.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{offer.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {offer.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>For: {offer.request?.title}</span>
                      <span>•</span>
                      <span>Vendor: {offer.vendor?.company_name || offer.vendor?.full_name}</span>
                      <span>•</span>
                      <span>Client: {offer.client?.company_name || offer.client?.full_name}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 text-right">
                    <Badge className={getStatusColor(offer.admin_approval_status)}>
                      Admin: {offer.admin_approval_status.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(offer.client_approval_status)}>
                      Client: {offer.client_approval_status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Offer Price</p>
                    <p className="text-lg font-bold text-primary">
                      {offer.price.toLocaleString()} {offer.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Request Budget</p>
                    <p className="text-sm">
                      {offer.request?.budget_min && offer.request?.budget_max
                        ? `${offer.request.budget_min.toLocaleString()} - ${offer.request.budget_max.toLocaleString()}`
                        : 'Not specified'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Delivery Time</p>
                    <p className="text-sm">{offer.delivery_time_days} days</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p className="text-sm">{format(new Date(offer.created_at), 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    Contact Vendor
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    Contact Client
                  </Button>
                  
                  {offer.admin_approval_status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => updateOfferApproval(offer.id, 'approved')}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => updateOfferApproval(offer.id, 'rejected')}
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
      </div>
    </div>
  );
};

export default AdminOffers;
