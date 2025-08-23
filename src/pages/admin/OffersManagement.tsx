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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Offers Management</h1>
        <p className="text-muted-foreground">Monitor and manage supplier offers</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, supplier, request..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
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
              <h3 className="text-lg font-semibold mb-2">No offers found</h3>
              <p className="text-muted-foreground text-center">
                Try adjusting your search terms or filters
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
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Supplier:</span>
                    </div>
                    <p className="font-medium">
                      {offer.user_profiles?.full_name || offer.user_profiles?.email}
                    </p>
                    {offer.user_profiles?.company_name && (
                      <p className="text-muted-foreground text-xs">
                        {offer.user_profiles.company_name}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Request:</span>
                    </div>
                    <p className="font-medium">{offer.requests?.title}</p>
                    <p className="text-muted-foreground text-xs">{offer.requests?.category}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Price:</span>
                    </div>
                    <p className="font-medium">
                      {offer.price.toLocaleString()} {offer.currency}
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {offer.delivery_time_days} days delivery
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground mt-2">
                  Created: {new Date(offer.created_at).toLocaleDateString()}
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};