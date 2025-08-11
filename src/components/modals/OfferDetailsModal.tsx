import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOffers } from "@/hooks/useOffers";

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
}

interface OfferDetailsModalProps {
  children: React.ReactNode;
  offerId: string;
  userRole?: 'client' | 'supplier' | 'admin';
  onUpdated?: () => Promise<void> | void;
}

export const OfferDetailsModal = ({ children, offerId, userRole = 'client', onUpdated }: OfferDetailsModalProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const { toast } = useToast();
  const { updateOfferStatus } = useOffers();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offer, setOffer] = useState<OfferRow | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const fetchOffer = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('offers')
        .select(`*`)
        .eq('id', offerId)
        .maybeSingle();

      if (error) throw error;
      setOffer(data as OfferRow | null);

      // Ensure the content starts at the top
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
      });
    } catch (err: any) {
      console.error('Error fetching offer details:', err);
      toast({ title: isRTL ? 'خطأ' : 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchOffer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, offerId]);

  const canModify = (userRole === 'client' || userRole === 'admin') && offer?.client_approval_status === 'pending';

  const handleAction = async (status: 'approved' | 'rejected') => {
    if (!offer) return;
    const ok = await updateOfferStatus(offer.id, status, offer.client_approval_notes || undefined);
    if (ok) {
      toast({ title: status === 'approved' ? (isRTL ? 'تم القبول' : 'Approved') : (isRTL ? 'تم الرفض' : 'Rejected'), description: isRTL ? 'تم تحديث حالة العرض.' : 'Offer status updated.' });
      await onUpdated?.();
      setOpen(false);
    } else {
      toast({ title: isRTL ? 'خطأ' : 'Error', description: isRTL ? 'تعذر تحديث حالة العرض.' : 'Failed to update offer status.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle className={isRTL ? 'text-right' : ''}>
            {offer?.title || (isRTL ? 'تفاصيل العرض' : 'Offer Details')}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-10 flex items-center justify-center">
            <LoadingSpinner text={isRTL ? 'جارٍ التحميل...' : 'Loading...'} />
          </div>
        ) : offer ? (
          <div ref={scrollRef} className="max-h-[70vh] overflow-y-auto space-y-4">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Badge variant={offer.client_approval_status === 'approved' ? 'default' : offer.client_approval_status === 'rejected' ? 'destructive' : 'secondary'}>
                {offer.client_approval_status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(offer.created_at).toLocaleString()}
              </span>
            </div>

            <p className={`text-muted-foreground ${isRTL ? 'text-right' : ''}`}>{offer.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`text-sm ${isRTL ? 'text-right' : ''}`}>
                <div className="font-medium">{isRTL ? 'السعر' : 'Price'}</div>
                <div>{offer.price.toLocaleString()} {offer.currency}</div>
              </div>
              <div className={`text-sm ${isRTL ? 'text-right' : ''}`}>
                <div className="font-medium">{isRTL ? 'التسليم' : 'Delivery'}</div>
                <div>{offer.delivery_time_days} {isRTL ? 'أيام' : 'days'}</div>
              </div>
            </div>

            {offer.client_approval_notes ? (
              <div className={`text-sm ${isRTL ? 'text-right' : ''}`}>
                <div className="font-medium">{isRTL ? 'ملاحظات العميل' : 'Client Notes'}</div>
                <div className="text-muted-foreground">{offer.client_approval_notes}</div>
              </div>
            ) : null}

            <div className="h-2" />
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            {isRTL ? 'العرض غير موجود' : 'Offer not found'}
          </div>
        )}

        {/* Sticky footer for actions */}
        {offer && (
          <div className={`sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t mt-2 pt-3 ${isRTL ? 'text-right' : ''}`}>
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                {isRTL ? 'إغلاق' : 'Close'}
              </Button>
              {canModify && (
                <>
                  <Button className="flex-1" onClick={() => handleAction('approved')}>
                    {isRTL ? 'قبول العرض' : 'Accept Offer'}
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => handleAction('rejected')}>
                    {isRTL ? 'رفض العرض' : 'Reject Offer'}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
