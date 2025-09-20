
import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { OfferApprovalCard } from "@/components/admin/OfferApprovalCard";
import { RealTimeChatModal } from "@/components/modals/RealTimeChatModal";
import { OfferDetailsModal } from "@/components/modals/OfferDetailsModal";
import { OfferComparisonModal } from "@/components/enhanced/OfferComparisonModal";
import { useUserProfiles } from "@/hooks/useUserProfiles";
import { useOffers, Offer } from "@/hooks/useOffers";
import { BarChart3, CheckCircle, XCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface RequestOffersModalProps {
  children: React.ReactNode;
  requestId: string;
  requestTitle?: string;
}

interface OfferRow {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  delivery_time?: number;
  delivery_time_days: number;
  status: 'pending' | 'accepted' | 'rejected';
  client_approval_status: 'pending' | 'approved' | 'rejected';
  admin_approval_status: 'pending' | 'approved' | 'rejected';
  client_approval_notes?: string | null;
  client_approval_date?: string | null;
  created_at: string;
  updated_at: string;
  vendor_id: string;
  request_id: string;
  request?: { title: string; client_id: string; description?: string; category?: string } | null;
  vendor?: {
    full_name: string;
    company_name?: string;
    email: string;
  };
}

export const RequestOffersModal = ({ children, requestId, requestTitle }: RequestOffersModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<OfferRow[]>([]);
  const [requestOwnerId, setRequestOwnerId] = useState<string | null>(null);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);

  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const { fetchMultipleProfiles, getProfile } = useUserProfiles();
  const isRTL = language === 'ar';
  const { updateOfferStatus } = useOffers(requestId);

  const loadOffers = async () => {
    setLoading(true);
    try {
      // Fetch offers with simple structure - we'll resolve vendor info separately
      const { data: offersData, error } = await supabase
        .from('offers')
        .select(`
          *,
          requests(title, description, client_id, category, location)
        `)
        .eq('request_id', requestId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching offers:', error);
        toast({
          title: isRTL ? 'خطأ' : 'Error',
          description: isRTL ? 'فشل في تحميل العروض' : 'Failed to load offers',
          variant: 'destructive'
        });
        return;
      }

      // Get the request owner ID from the first offer's request data
      if (offersData && offersData.length > 0 && offersData[0].requests) {
        setRequestOwnerId(offersData[0].requests.client_id);
      }

      // Get vendor profile IDs and fetch their info
      const vendorIds = (offersData || []).map(offer => offer.vendor_id).filter(Boolean);
      if (vendorIds.length > 0) {
        await fetchMultipleProfiles(vendorIds);
      }

      setOffers((offersData || []) as OfferRow[]);
    } catch (error) {
      console.error('Error in loadOffers:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تحميل العروض' : 'Failed to load offers',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadOffers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, requestId]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!open) return;

    const channel = supabase
      .channel('request_offers_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'offers', filter: `request_id=eq.${requestId}` },
        (payload) => {
          loadOffers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [open, requestId]);

  const onApprove = async (id: string, notes: string) => {
    const ok = await updateOfferStatus(id, 'approved', notes);
    if (ok) {
      toast({ title: isRTL ? 'تم القبول' : 'Approved', description: isRTL ? 'تم قبول العرض وإنشاء طلب جديد.' : 'Offer approved and new order created.' });
      setSelectedOffers(prev => prev.filter(offerId => offerId !== id));
      await loadOffers();
    } else {
      toast({ 
        title: isRTL ? 'خطأ' : 'Error', 
        description: isRTL ? 'تعذر قبول العرض. تحقق من الصلاحيات.' : 'Failed to approve offer. Check permissions.', 
        variant: 'destructive' 
      });
    }
  };

  const onReject = async (id: string, notes: string) => {
    const ok = await updateOfferStatus(id, 'rejected', notes);
    if (ok) {
      toast({ title: isRTL ? 'تم الرفض' : 'Rejected', description: isRTL ? 'تم رفض العرض.' : 'Offer rejected.' });
      setSelectedOffers(prev => prev.filter(offerId => offerId !== id));
      await loadOffers();
    } else {
      toast({ 
        title: isRTL ? 'خطأ' : 'Error', 
        description: isRTL ? 'تعذر رفض العرض. تحقق من الصلاحيات.' : 'Failed to reject offer. Check permissions.', 
        variant: 'destructive' 
      });
    }
  };

  // Determine user permissions and role
  const isAdmin = userProfile?.role === 'admin';
  const isRequestOwner = !!userProfile?.id && !!requestOwnerId && userProfile.id === requestOwnerId;
  const canManage = isAdmin || isRequestOwner;
  const userRole = canManage ? (isAdmin ? 'admin' : 'client') : 'vendor';
  

  const handleOfferSelection = (offerId: string, selected: boolean) => {
    if (selected) {
      setSelectedOffers(prev => [...prev, offerId]);
    } else {
      setSelectedOffers(prev => prev.filter(id => id !== offerId));
    }
  };

  const handleSelectAll = () => {
    const pendingOffers = offers.filter(o => o.client_approval_status === 'pending');
    if (selectedOffers.length === pendingOffers.length) {
      setSelectedOffers([]);
    } else {
      setSelectedOffers(pendingOffers.map(o => o.id));
    }
  };

  const pendingOffers = offers.filter(o => o.client_approval_status === 'pending');
  
  // Convert OfferRow to Offer for comparison modal with proper typing
  const selectedOffersData: Offer[] = offers.filter(o => selectedOffers.includes(o.id)).map(offer => ({
    id: offer.id,
    title: offer.title,
    description: offer.description,
    price: offer.price,
    currency: offer.currency,
    delivery_time: offer.delivery_time || offer.delivery_time_days,
    delivery_time_days: offer.delivery_time_days,
    status: offer.status,
    client_approval_status: offer.client_approval_status,
    admin_approval_status: offer.admin_approval_status,
    client_approval_notes: offer.client_approval_notes,
    client_approval_date: offer.client_approval_date,
    created_at: offer.created_at,
    updated_at: offer.updated_at,
    request_id: offer.request_id,
    vendor_id: offer.vendor_id,
    requests: offer.request ? {
      title: offer.request.title,
      description: offer.request.description || '',
      client_id: offer.request.client_id,
      category: offer.request.category || '',
      location: undefined
    } : undefined,
    user_profiles: offer.vendor
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-4">
          <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <DialogTitle className={isRTL ? 'text-right' : ''}>
              {isRTL ? 'العروض للطلب' : 'Offers for Request'}{requestTitle ? `: ${requestTitle}` : ''}
            </DialogTitle>
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {canManage && pendingOffers.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}
                >
                  <Checkbox 
                    checked={selectedOffers.length === pendingOffers.length}
                    onCheckedChange={handleSelectAll}
                  />
                  {selectedOffers.length === pendingOffers.length 
                    ? (isRTL ? 'إلغاء الكل' : 'Deselect All')
                    : (isRTL ? 'تحديد الكل' : 'Select All')
                  }
                </Button>
              )}
              {selectedOffers.length > 1 && canManage && (
                <OfferComparisonModal 
                  offers={selectedOffersData}
                  onOfferAction={async (offerId, action, notes) => {
                    if (action === 'approve') {
                      await onApprove(offerId, notes || '');
                    } else {
                      await onReject(offerId, notes || '');
                    }
                  }}
                >
                  <Button className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}>
                    <BarChart3 className="h-4 w-4" />
                    {isRTL ? `مقارنة (${selectedOffers.length})` : `Compare (${selectedOffers.length})`}
                  </Button>
                </OfferComparisonModal>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="py-10 flex items-center justify-center">
              <LoadingSpinner text={isRTL ? 'جارٍ التحميل...' : 'Loading...'} />
            </div>
          ) : (
            <div className="space-y-4">
              {offers.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center text-muted-foreground">
                    {isRTL ? 'لا توجد عروض بعد.' : 'No offers yet.'}
                  </CardContent>
                </Card>
              ) : (
                offers.map((offer) => {
                  const supplier = getProfile(offer.vendor_id) || offer.vendor;
                  const supplierName = supplier?.company_name || supplier?.full_name || supplier?.email || 'Supplier';
                  
                  return (
                    <div key={offer.id} className="space-y-2">
                      <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {canManage && offer.client_approval_status === 'pending' && (
                          <Checkbox
                            checked={selectedOffers.includes(offer.id)}
                            onCheckedChange={(checked) => handleOfferSelection(offer.id, checked as boolean)}
                            className="mt-4"
                          />
                        )}
                        <div className="flex-1">
                          <OfferApprovalCard 
                            offer={offer as any}
                            onApprove={onApprove}
                            onReject={onReject}
                            userRole={userRole as any}
                          />
                        </div>
                      </div>
                      
                      <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''} ml-8`}>
                        <RealTimeChatModal 
                          recipientId={offer.vendor_id}
                          recipientName={supplierName}
                        >
                          <Button variant="outline" size="sm">
                            {isRTL ? 'مراسلة المورّد' : 'Message Supplier'}
                          </Button>
                        </RealTimeChatModal>

                        <OfferDetailsModal 
                          offerId={offer.id} 
                          userRole={userRole as any} 
                          onUpdated={loadOffers}
                        >
                          <Button variant="outline" size="sm">
                            {isRTL ? 'عرض التفاصيل' : 'View Details'}
                          </Button>
                        </OfferDetailsModal>

                        {canManage && offer.client_approval_status === 'pending' && (
                          <>
                            <Button 
                              size="sm"
                              onClick={() => onApprove(offer.id, '')}
                              className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}
                            >
                              <CheckCircle className="h-4 w-4" />
                              {isRTL ? 'قبول سريع' : 'Quick Accept'}
                            </Button>
                            <Button 
                              variant="destructive"
                              size="sm"
                              onClick={() => onReject(offer.id, '')}
                              className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}
                            >
                              <XCircle className="h-4 w-4" />
                              {isRTL ? 'رفض سريع' : 'Quick Reject'}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
