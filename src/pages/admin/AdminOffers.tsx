
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
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';
import { cn } from '@/lib/utils';

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
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };
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
        title: t('common.error'),
        description: t('admin.offersManagement.loadingOffers'),
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
        title: t('common.success'),
        description: status === 'approved' ? t('admin.offersManagement.approveOfferSuccess') : t('admin.offersManagement.rejectOfferSuccess'),
      });

      fetchOffers();
    } catch (error) {
      console.error('Error updating offer status:', error);
      toast({
        title: t('common.error'),
        description: t('admin.offersManagement.updateError'),
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
        title: t('common.success'),
        description: t('admin.offersManagement.escalateSuccess'),
      });
    } catch (error) {
      console.error('Error escalating to support:', error);
      toast({
        title: t('common.error'),
        description: t('admin.offersManagement.escalateError'),
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
        title: t('common.success'),
        description: t('admin.offersManagement.conversationSuccess'),
      });
    } catch (error) {
      console.error('Error initiating conversation:', error);
      toast({
        title: t('common.error'),
        description: t('admin.offersManagement.conversationError'),
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
    return t('admin.offersManagement.averageResponseTime');
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
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <AdminPageContainer
        title={t('admin.offersManagement.title')}
        description={t('admin.offersManagement.description')}
      >

          {/* Enhanced Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
            <Card>
              <CardHeader className={cn(
                "flex flex-row items-center justify-between space-y-0 pb-2",
                isRTL && "flex-row-reverse"
              )}>
                <CardTitle className="text-sm font-medium">{t('admin.offersManagement.totalOffers')}</CardTitle>
                <Package className="h-4 w-4 text-foreground opacity-75" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{offers.length}</div>
                <p className="text-xs text-foreground opacity-75">
                  {pendingOffers.length} {t('admin.offersManagement.pendingApproval')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.offersManagement.conversionRate')}</CardTitle>
                <TrendingUp className="h-4 w-4 text-foreground opacity-75" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calculateConversionRate()}%</div>
                <p className="text-xs text-foreground opacity-75">
                  {clientApprovedOffers.length} {t('admin.offersManagement.offersAcceptedByClients')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.offersManagement.averagePrice')}</CardTitle>
                <DollarSign className="h-4 w-4 text-foreground opacity-75" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calculateAveragePrice()} SAR</div>
                <p className="text-xs text-foreground opacity-75">
                  {t('admin.offersManagement.acrossAllOffers')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.offersManagement.avgResponseTime')}</CardTitle>
                <Clock className="h-4 w-4 text-foreground opacity-75" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calculateAverageResponseTime()}</div>
                <p className="text-xs text-foreground opacity-75">
                  {t('admin.offersManagement.vendorResponseTime')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin.offersManagement.highPriority')}</CardTitle>
                <AlertTriangle className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{highUrgencyOffers.length}</div>
                <p className="text-xs text-foreground opacity-75">
                  {t('admin.offersManagement.requiresAttention')}
                </p>
              </CardContent>
            </Card>
          </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">{t('admin.offersManagement.filtersAndSearch')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground opacity-75" />
              <Input
                placeholder={t('admin.offersManagement.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('admin.offersManagement.clientStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.offersManagement.allClientStatuses')}</SelectItem>
                <SelectItem value="pending">{t('admin.offersManagement.pending')}</SelectItem>
                <SelectItem value="approved">{t('admin.offersManagement.approved')}</SelectItem>
                <SelectItem value="rejected">{t('admin.offersManagement.rejected')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={approvalFilter} onValueChange={setApprovalFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('admin.offersManagement.adminApproval')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.offersManagement.allAdminApprovals')}</SelectItem>
                <SelectItem value="pending">{t('admin.offersManagement.pending')}</SelectItem>
                <SelectItem value="approved">{t('admin.offersManagement.approved')}</SelectItem>
                <SelectItem value="rejected">{t('admin.offersManagement.rejected')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('admin.offersManagement.priceRange')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.offersManagement.allPrices')}</SelectItem>
                <SelectItem value="low">{t('admin.offersManagement.lessThan10k')}</SelectItem>
                <SelectItem value="medium">{t('admin.offersManagement.between10k50k')}</SelectItem>
                <SelectItem value="high">{t('admin.offersManagement.greaterThan50k')}</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={fetchOffers} variant="outline">
              {t('admin.offersManagement.refresh')}
            </Button>

            <Button variant="outline" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {t('admin.offersManagement.exportReport')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for better organization */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">{t('admin.offersManagement.allOffers')} ({offers.length})</TabsTrigger>
          <TabsTrigger value="pending">{t('admin.offersManagement.pendingReview')} ({pendingOffers.length})</TabsTrigger>
          <TabsTrigger value="urgent">{t('admin.offersManagement.highPriority')} ({highUrgencyOffers.length})</TabsTrigger>
          <TabsTrigger value="approved">{t('admin.offersManagement.approved')} ({approvedOffers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">{t('admin.offersManagement.loading')}</div>
            ) : filteredOffers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-foreground opacity-75">{t('admin.offersManagement.noOffersFound')}</p>
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
                            {t('admin.offersManagement.urgent')}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {offer.description}
                      </CardDescription>
                      <div className="flex items-center gap-4 text-sm text-foreground opacity-75">
                        <span>{t('admin.offersManagement.forRequest')}: {offer.request?.title}</span>
                        <span>•</span>
                        <span>{t('admin.offersManagement.vendor')}: {offer.vendor?.company_name || offer.vendor?.full_name}</span>
                        <span>•</span>
                        <span>{t('admin.offersManagement.client')}: {offer.client?.company_name || offer.client?.full_name}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-right">
                      <Badge variant={getStatusBadgeVariant(offer.client_approval_status)}>
                        {t('admin.offersManagement.status')}: {offer.client_approval_status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-foreground opacity-75">{t('admin.offersManagement.price')}</p>
                      <p className="text-lg font-bold text-primary">
                        {offer.price.toLocaleString()} {offer.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground opacity-75">{t('admin.offersManagement.budgetRange')}</p>
                      <p className="text-sm">
                        {offer.request?.budget_min && offer.request?.budget_max
                          ? `${offer.request.budget_min.toLocaleString()} - ${offer.request.budget_max.toLocaleString()}`
                          : t('admin.requestsManagement.notSpecified')
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground opacity-75">{t('admin.offersManagement.deliveryTime')}</p>
                      <p className="text-sm">{offer.delivery_time_days} {t('admin.offersManagement.days')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground opacity-75">{t('admin.offersManagement.created')}</p>
                      <p className="text-sm">{format(new Date(offer.created_at), 'MMM dd, yyyy HH:mm')}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {t('admin.offersManagement.viewDetails')}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => initiateConversation(offer.vendor_id, offer.request?.client_id || '', offer.id)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      {t('admin.offersManagement.initiateDiscussion')}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => escalateToSupport(offer.id, 'pricing')}
                    >
                      <AlertTriangle className="h-4 w-4" />
                      {t('admin.offersManagement.escalateToSupport')}
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
    </div>
  );
};

export default AdminOffers;
