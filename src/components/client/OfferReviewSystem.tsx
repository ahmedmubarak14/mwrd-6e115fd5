import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  DollarSign, 
  User, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  FileText,
  Calendar,
  Building
} from "lucide-react";

interface OfferWithVendor {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  delivery_time_days: number;
  status: string;
  client_approval_status: string;
  created_at: string;
  request_id: string;
  vendor_id: string;
  client_approval_notes?: string;
  requests: {
    title: string;
    category: string;
  };
  vendor: {
    full_name: string;
    company_name?: string;
    avatar_url?: string;
    bio?: string;
    verification_status: string;
  };
}

interface ApprovalData {
  status: 'approved' | 'rejected';
  notes: string;
}

export const OfferReviewSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [offers, setOffers] = useState<OfferWithVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<OfferWithVendor | null>(null);
  const [approvalData, setApprovalData] = useState<ApprovalData>({
    status: 'approved',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch client's received offers
  const fetchOffers = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          requests!inner (
            title,
            category,
            client_id
          ),
          vendor:user_profiles!offers_vendor_id_fkey (
            full_name,
            company_name,
            avatar_url,
            bio,
            verification_status
          )
        `)
        .eq('requests.client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data as OfferWithVendor[] || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
      toast({
        title: "Error",
        description: "Failed to load offers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle offer approval/rejection
  const handleOfferDecision = async () => {
    if (!selectedOffer) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('offers')
        .update({
          client_approval_status: approvalData.status,
          client_approval_notes: approvalData.notes,
          client_approval_date: new Date().toISOString()
        })
        .eq('id', selectedOffer.id);

      if (error) throw error;

      // If approved, create an order
      if (approvalData.status === 'approved') {
        const { error: orderError } = await supabase
          .from('orders')
          .insert([{
            offer_id: selectedOffer.id,
            request_id: selectedOffer.request_id,
            client_id: user.id,
            vendor_id: selectedOffer.vendor_id,
            title: selectedOffer.title,
            description: selectedOffer.description,
            amount: selectedOffer.price,
            currency: selectedOffer.currency,
            status: 'pending',
            delivery_date: new Date(Date.now() + selectedOffer.delivery_time_days * 24 * 60 * 60 * 1000).toISOString()
          }]);

        if (orderError) {
          console.error('Error creating order:', orderError);
          // Still show success for offer approval
        }
      }

      toast({
        title: "Success",
        description: `Offer ${approvalData.status} successfully${approvalData.status === 'approved' ? ' and order created' : ''}`,
      });

      // Reset form and close dialog
      setApprovalData({ status: 'approved', notes: '' });
      setSelectedOffer(null);
      
      // Refresh offers
      await fetchOffers();
      
    } catch (error) {
      console.error('Error updating offer:', error);
      toast({
        title: "Error",
        description: "Failed to update offer status",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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

  // Group offers by status
  const pendingOffers = offers.filter(offer => offer.client_approval_status === 'pending');
  const reviewedOffers = offers.filter(offer => offer.client_approval_status !== 'pending');

  useEffect(() => {
    if (user) {
      fetchOffers();
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
      <div>
        <h2 className="text-2xl font-bold text-foreground">Offer Reviews</h2>
        <p className="text-muted-foreground">Review and manage offers received for your requests</p>
      </div>

      {/* Pending Offers */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Pending Review ({pendingOffers.length})
        </h3>
        
        {pendingOffers.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">No pending offers</h4>
              <p className="text-muted-foreground">
                Offers received for your requests will appear here for review
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pendingOffers.map((offer) => (
              <Card key={offer.id} className="border-l-4 border-l-yellow-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{offer.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        For: {offer.requests.title} • {offer.requests.category}
                      </p>
                    </div>
                    <Badge variant="secondary">Pending Review</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{offer.description}</p>
                    
                    {/* Vendor Info */}
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {offer.vendor.full_name || offer.vendor.company_name}
                          {offer.vendor.verification_status === 'approved' && (
                            <CheckCircle className="h-4 w-4 text-green-500 inline ml-1" />
                          )}
                        </div>
                        {offer.vendor.company_name && offer.vendor.full_name && (
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {offer.vendor.company_name}
                          </div>
                        )}
                        {offer.vendor.bio && (
                          <p className="text-sm text-muted-foreground mt-1">{offer.vendor.bio}</p>
                        )}
                      </div>
                    </div>

                    {/* Offer Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {offer.price.toLocaleString()} {offer.currency}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{offer.delivery_time_days} days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(offer.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            onClick={() => {
                              setSelectedOffer(offer);
                              setApprovalData({ status: 'approved', notes: '' });
                            }}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Accept Offer
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Accept Offer</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <h4 className="font-medium text-green-800 dark:text-green-200">
                                Accepting this offer will:
                              </h4>
                              <ul className="mt-2 text-sm text-green-700 dark:text-green-300 space-y-1">
                                <li>• Create a new order with {offer.vendor.full_name || offer.vendor.company_name}</li>
                                <li>• Set delivery timeline to {offer.delivery_time_days} days</li>
                                <li>• Lock in the price of {offer.price.toLocaleString()} {offer.currency}</li>
                              </ul>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="approval-notes">Notes (Optional)</Label>
                              <Textarea
                                id="approval-notes"
                                value={approvalData.notes}
                                onChange={(e) => setApprovalData(prev => ({ ...prev, notes: e.target.value }))}
                                placeholder="Any additional notes or requirements..."
                                rows={3}
                              />
                            </div>
                            
                            <Button 
                              onClick={handleOfferDecision}
                              disabled={isSubmitting}
                              className="w-full"
                            >
                              {isSubmitting ? 'Processing...' : 'Confirm Acceptance'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline"
                            onClick={() => {
                              setSelectedOffer(offer);
                              setApprovalData({ status: 'rejected', notes: '' });
                            }}
                            className="flex items-center gap-2"
                          >
                            <XCircle className="h-4 w-4" />
                            Decline
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Decline Offer</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="rejection-notes">Reason for Decline *</Label>
                              <Textarea
                                id="rejection-notes"
                                value={approvalData.notes}
                                onChange={(e) => setApprovalData(prev => ({ ...prev, notes: e.target.value }))}
                                placeholder="Please provide feedback for the vendor..."
                                rows={3}
                                required
                              />
                            </div>
                            
                            <Button 
                              onClick={handleOfferDecision}
                              disabled={isSubmitting || !approvalData.notes.trim()}
                              variant="destructive"
                              className="w-full"
                            >
                              {isSubmitting ? 'Processing...' : 'Confirm Decline'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Reviewed Offers */}
      {reviewedOffers.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Previously Reviewed ({reviewedOffers.length})
          </h3>
          
          <div className="grid gap-4">
            {reviewedOffers.map((offer) => (
              <Card key={offer.id} className={`border-l-4 ${
                offer.client_approval_status === 'approved' 
                  ? 'border-l-green-500' 
                  : 'border-l-red-500'
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{offer.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        For: {offer.requests.title} • By: {offer.vendor.full_name || offer.vendor.company_name}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(offer.client_approval_status)}>
                      {offer.client_approval_status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>{offer.price.toLocaleString()} {offer.currency}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{offer.delivery_time_days} days</span>
                    </div>
                    <div className="text-muted-foreground">
                      Reviewed: {new Date(offer.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {offer.client_approval_notes && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Your Notes:</p>
                          <p className="text-sm text-muted-foreground">{offer.client_approval_notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};