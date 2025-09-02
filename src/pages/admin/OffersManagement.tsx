import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Search, Filter, Package, DollarSign, Clock, Users } from "lucide-react";
import { useToastFeedback } from "@/hooks/useToastFeedback";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  delivery_time_days: number;
  status: string;
  client_approval_status: string;
  created_at: string;
  requests?: {
    title: string;
    category: string;
  };
  user_profiles?: any;
}

export const OffersManagement = () => {
  const { t, language } = useLanguage();
  const { showSuccess, showError } = useToastFeedback();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const isRTL = language === 'ar';

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          requests!offers_request_id_fkey (
            title,
            category
          ),
          user_profiles!offers_supplier_id_fkey (
            full_name,
            email,
            company_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching offers:', error);
        showError('Failed to load offers');
        return;
      }

      const formattedOffers = (data || []).map((offer: any) => ({
        ...offer,
        currency: 'USD', // Add default currency since not in database yet
        delivery_time_days: offer.delivery_time || 0
      }));
      setOffers(formattedOffers);
    } catch (error) {
      console.error('Error fetching offers:', error);
      showError('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = searchTerm === "" || 
      offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.requests?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.requests?.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.user_profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.user_profiles?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || offer.client_approval_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={isRTL ? 'text-right' : ''}>
        <h1 className="text-3xl font-bold">{t('admin.offersManagement')}</h1>
        <p className="text-muted-foreground">{t('admin.offersManagementDesc')}</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Filter className="h-5 w-5" />
            {t('admin.searchFilter')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
              <Input
                placeholder={t('admin.searchByTitle')}
                className={`${isRTL ? 'pr-10' : 'pl-10'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t('common.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.allStatuses')}</SelectItem>
                <SelectItem value="pending">{t('common.pending')}</SelectItem>
                <SelectItem value="approved">{t('approval.approved')}</SelectItem>
                <SelectItem value="rejected">{t('approval.rejected')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Offers List */}
      <div className="space-y-4">
        {filteredOffers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('admin.noOffersFound')}</h3>
              <p className="text-muted-foreground text-center">
                {t('admin.noOffersDesc')}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOffers.map((offer) => (
            <Card key={offer.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{offer.title}</CardTitle>
                      <Badge variant={getStatusBadgeVariant(offer.client_approval_status)}>
                        {offer.client_approval_status}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {offer.description}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="space-y-2">
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{t('admin.supplier')}:</span>
                    </div>
                    <p className={`font-medium ${isRTL ? 'text-right' : ''}`}>
                      {offer.user_profiles?.full_name || offer.user_profiles?.email}
                    </p>
                    {offer.user_profiles?.company_name && (
                      <p className={`text-muted-foreground text-xs ${isRTL ? 'text-right' : ''}`}>
                        {offer.user_profiles.company_name}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{t('admin.request')}:</span>
                    </div>
                    <p className={`font-medium ${isRTL ? 'text-right' : ''}`}>{offer.requests?.title}</p>
                    <p className={`text-muted-foreground text-xs ${isRTL ? 'text-right' : ''}`}>{offer.requests?.category}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{t('admin.price')}:</span>
                    </div>
                    <p className={`font-medium ${isRTL ? 'text-right' : ''}`}>
                      {offer.price.toLocaleString()} {offer.currency}
                    </p>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {offer.delivery_time_days} {t('admin.daysDelivery')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={`text-xs text-muted-foreground mt-2 ${isRTL ? 'text-right' : ''}`}>
                  {t('admin.created')}: {new Date(offer.created_at).toLocaleDateString()}
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};