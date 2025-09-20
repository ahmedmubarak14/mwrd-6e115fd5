import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Clock, DollarSign, FileText, Send, Eye, Edit, Trash2 } from "lucide-react";

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
  requests: {
    title: string;
    category: string;
    client_id: string;
  };
}

interface Request {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_max?: number;
  currency?: string;
  deadline?: string;
  client_id: string;
}

export const OfferManagementSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [availableRequests, setAvailableRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  
  // Form state
  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    price: '',
    delivery_time_days: '',
  });

  // Fetch vendor's offers
  const fetchOffers = async () => {
    if (!user) return;

    // Always use auth user id for vendor_id filters
    const { data: authData } = await supabase.auth.getUser();
    const authUserId = authData?.user?.id;
    if (!authUserId) return;
    
    try {
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          requests (
            title,
            category,
            client_id
          )
        `)
        .eq('vendor_id', authUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('common.failedToLoad'),
        variant: "destructive"
      });
    }
  };

  // Fetch available requests
  const fetchAvailableRequests = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('admin_approval_status', 'approved')
        .neq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filter out requests that already have offers from this vendor
      const requestsWithoutOffers = await Promise.all(
        (data || []).map(async (request) => {
          const { data: existingOffer } = await supabase
            .from('offers')
            .select('id')
            .eq('request_id', request.id)
            .eq('vendor_id', (await supabase.auth.getUser()).data?.user?.id || '')
            .maybeSingle();
            
          return existingOffer ? null : request;
        })
      );
      
      setAvailableRequests(requestsWithoutOffers.filter(Boolean) as Request[]);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  // Submit offer
  const handleSubmitOffer = async () => {
    if (!user || !selectedRequest) return;
    
    if (!offerForm.title || !offerForm.description || !offerForm.price || !offerForm.delivery_time_days) {
      toast({
        title: t('forms.validationError'),
        description: t('forms.pleaseCompleteFields'),
        variant: "destructive"
      });
      return;
    }

  setIsSubmitting(true);
  
  try {
    const { data: authData } = await supabase.auth.getUser();
    const authUserId = authData?.user?.id;
    if (!authUserId) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('offers')
      .insert([{
        request_id: selectedRequest.id,
        vendor_id: authUserId,
        title: offerForm.title,
        description: offerForm.description,
        price: parseFloat(offerForm.price),
        currency: selectedRequest.currency || 'SAR',
        delivery_time_days: parseInt(offerForm.delivery_time_days),
        status: 'pending',
        client_approval_status: 'pending'
      }])
      .select()
      .single();

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('forms.offerSubmittedSuccess')
      });

      // Reset form and close dialog
      setOfferForm({
        title: '',
        description: '',
        price: '',
        delivery_time_days: '',
      });
      setSelectedRequest(null);
      
      // Refresh data
      await fetchOffers();
      await fetchAvailableRequests();
      
    } catch (error) {
      console.error('Error submitting offer:', error);
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('common.failedToSubmit'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete offer
  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offerId)
        .eq('vendor_id', user?.id);

      if (error) throw error;
      
      toast({
        title: t('common.success'),
        description: t('forms.offerDeletedSuccess')
      });
      
      await fetchOffers();
      await fetchAvailableRequests();
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('common.failedToDelete'),
        variant: "destructive"
      });
    }
  };

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchOffers(), fetchAvailableRequests()]);
      setLoading(false);
    };
    
    if (user) {
      loadData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Offer Management</h2>
          <p className="text-muted-foreground">Submit and manage your offers</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Submit New Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submit New Offer</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Request</Label>
                <Select onValueChange={(value) => {
                  const request = availableRequests.find(r => r.id === value);
                  setSelectedRequest(request || null);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('forms.chooseRequest')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRequests.map((request) => (
                      <SelectItem key={request.id} value={request.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{request.title}</span>
                          <span className="text-sm text-muted-foreground">
                            {request.category} • Budget: {request.budget_max?.toLocaleString()} {request.currency}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedRequest && (
                <>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <h4 className="font-medium mb-2">{selectedRequest.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{selectedRequest.description}</p>
                      <div className="flex gap-4 text-sm">
                        <span>Category: {selectedRequest.category}</span>
                        <span>Budget: {selectedRequest.budget_max?.toLocaleString()} {selectedRequest.currency}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="offer-title">Offer Title *</Label>
                      <Input
                        id="offer-title"
                        value={offerForm.title}
                        onChange={(e) => setOfferForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder={t('forms.enterOfferTitle')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="offer-description">Proposal & Description *</Label>
                      <Textarea
                        id="offer-description"
                        value={offerForm.description}
                        onChange={(e) => setOfferForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder={t('forms.describeProposal')}
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="offer-price">Price ({selectedRequest.currency}) *</Label>
                        <Input
                          id="offer-price"
                          type="number"
                          value={offerForm.price}
                          onChange={(e) => setOfferForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="delivery-days">Delivery Time (Days) *</Label>
                        <Input
                          id="delivery-days"
                          type="number"
                          value={offerForm.delivery_time_days}
                          onChange={(e) => setOfferForm(prev => ({ ...prev, delivery_time_days: e.target.value }))}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handleSubmitOffer} 
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Offer'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {offers.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No offers yet</h3>
              <p className="text-muted-foreground mb-4">
                Start submitting offers to available requests to grow your business
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Submit Your First Offer</Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          offers.map((offer) => (
            <Card key={offer.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{offer.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      For: {offer.requests.title} • {offer.requests.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusVariant(offer.client_approval_status)}>
                      {offer.client_approval_status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{offer.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {offer.price.toLocaleString()} {offer.currency}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{offer.delivery_time_days} days</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Submitted: {new Date(offer.created_at).toLocaleDateString()}
                  </div>
                </div>

                {offer.client_approval_status === 'pending' && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteOffer(offer.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};