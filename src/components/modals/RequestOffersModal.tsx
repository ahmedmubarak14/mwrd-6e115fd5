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
import { useUserProfiles } from "@/hooks/useUserProfiles";
import { useOffers } from "@/hooks/useOffers";

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
  delivery_time_days: number;
  client_approval_status: 'pending' | 'approved' | 'rejected';
  client_approval_notes?: string | null;
  client_approval_date?: string | null;
  created_at: string;
  supplier_id: string;
  request_id: string;
  request?: { title: string; user_id: string } | null;
}

export const RequestOffersModal = ({ children, requestId, requestTitle }: RequestOffersModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<OfferRow[]>([]);
  const [requestOwnerId, setRequestOwnerId] = useState<string | null>(null);

  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const { fetchMultipleProfiles, getProfile } = useUserProfiles();
  const isRTL = language === 'ar';
  const { updateOfferStatus } = useOffers(requestId);

  const loadOffers = async () => {
    setLoading(true);
    try {
      // First, fetch request details to get owner ID
      const { data: requestData, error: requestError } = await supabase
        .from('requests')
        .select('user_id')
        .eq('id', requestId)
        .single();
      
      if (requestError) {
        console.error('Error fetching request owner:', requestError);
        throw requestError;
      }
      
      setRequestOwnerId(requestData?.user_id || null);

      // Then fetch offers
      const { data, error } = await supabase
        .from('offers')
        .select(`*, request:requests(title, user_id)`) 
        .eq('request_id', requestId)
        .order('created_at', { ascending: false });
      if (error) throw error;

      const list = (data || []) as OfferRow[];
      setOffers(list);

      const supplierIds = Array.from(new Set(list.map(o => o.supplier_id)));
      if (supplierIds.length > 0) await fetchMultipleProfiles(supplierIds);
    } catch (err: any) {
      console.error('Error loading offers:', err);
      toast({ title: isRTL ? 'خطأ' : 'Error', description: err.message, variant: 'destructive' });
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

  const onApprove = async (id: string, notes: string) => {
    console.log('Attempting to approve offer:', { id, notes, userProfile: userProfile?.id, requestOwnerId });
    const ok = await updateOfferStatus(id, 'approved', notes);
    if (ok) {
      toast({ title: isRTL ? 'تم القبول' : 'Approved', description: isRTL ? 'تم قبول العرض.' : 'Offer approved.' });
      await loadOffers();
    } else {
      console.error('Failed to approve offer - check database permissions and RLS policies');
      toast({ 
        title: isRTL ? 'خطأ' : 'Error', 
        description: isRTL ? 'تعذر قبول العرض. تحقق من الصلاحيات.' : 'Failed to approve offer. Check permissions.', 
        variant: 'destructive' 
      });
    }
  };

  const onReject = async (id: string, notes: string) => {
    console.log('Attempting to reject offer:', { id, notes, userProfile: userProfile?.id, requestOwnerId });
    const ok = await updateOfferStatus(id, 'rejected', notes);
    if (ok) {
      toast({ title: isRTL ? 'تم الرفض' : 'Rejected', description: isRTL ? 'تم رفض العرض.' : 'Offer rejected.' });
      await loadOffers();
    } else {
      console.error('Failed to reject offer - check database permissions and RLS policies');
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
  
  // Fixed logic: if user can manage offers, they should be able to approve/reject (client or admin role)
  // If they can't manage, they're viewing as a supplier
  const userRole = canManage ? (isAdmin ? 'admin' : 'client') : 'supplier';
  
  console.log('Permission check:', { 
    userProfileId: userProfile?.id, 
    userProfileRole: userProfile?.role,
    requestOwnerId, 
    isAdmin, 
    isRequestOwner, 
    canManage, 
    userRole 
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className={isRTL ? 'text-right' : ''}>
            {isRTL ? 'العروض للطلب' : 'Offers for Request'}{requestTitle ? `: ${requestTitle}` : ''}
          </DialogTitle>
        </DialogHeader>
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
                const supplier = getProfile(offer.supplier_id);
                const supplierName = supplier?.full_name || supplier?.email || 'Supplier';
                return (
                  <div key={offer.id} className="space-y-2">
                    <OfferApprovalCard 
                      offer={offer as any}
                      onApprove={onApprove}
                      onReject={onReject}
                      userRole={userRole as any}
                    />
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <RealTimeChatModal 
                        recipientId={offer.supplier_id}
                        recipientName={supplierName}
                        requestId={offer.request_id}
                        offerId={offer.id}
                      >
                        <Button variant="outline" size="sm">
                          {isRTL ? 'مراسلة المورّد' : 'Message Supplier'}
                        </Button>
                      </RealTimeChatModal>

                      <OfferDetailsModal offerId={offer.id} userRole={userRole as any} onUpdated={loadOffers}>
                        <Button variant="outline" size="sm">
                          {isRTL ? 'عرض التفاصيل' : 'View Details'}
                        </Button>
                      </OfferDetailsModal>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
