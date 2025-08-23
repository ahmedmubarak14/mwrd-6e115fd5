import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOffers } from "@/hooks/useOffers";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, XCircle, Clock, Calendar, DollarSign, Truck } from "lucide-react";

interface OfferRow {
  id: string;
  title: string;
  description: string;
  price: number;
  delivery_time?: number;
  client_approval_status: 'pending' | 'approved' | 'rejected';
  client_approval_notes?: string | null;
  client_approval_date?: string | null;
  created_at: string;
  vendor_id: string;
  request_id: string;
  request?: {
    client_id: string;
  };
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
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [offer, setOffer] = useState<OfferRow | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const fetchOffer = async () => {
    setLoading(true);
    setPermissionError(null);
    try {
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          request:requests!inner (
            client_id
          )
        `)
        .eq('id', offerId)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        setOffer(null);
        return;
      }

      setOffer(data as OfferRow);

      // Check permissions
      const isRequestOwner = user?.id === data.request?.client_id;
      const isAdmin = userRole === 'admin';
      
      if (!isRequestOwner && !isAdmin) {
        setPermissionError(isRTL ? 'ليس لديك صلاحية لإدارة هذا العرض' : 'You do not have permission to manage this offer');
      }

      // Ensure the content starts at the top
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
      });
    } catch (err: any) {
      console.error('Error fetching offer details:', err);
      toast({ 
        title: isRTL ? 'خطأ' : 'Error', 
        description: isRTL ? 'خطأ في جلب تفاصيل العرض' : 'Failed to fetch offer details', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchOffer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, offerId]);

  const canModify = !permissionError && offer?.client_approval_status === 'pending' && !actionLoading;

  const handleAction = async (status: 'approved' | 'rejected', notes?: string) => {
    if (!offer) return;
    
    setActionLoading(true);
    try {
      const success = await updateOfferStatus(offer.id, status, notes);
      
      if (success) {
        const successMessage = status === 'approved' 
          ? (isRTL ? 'تم قبول العرض بنجاح' : 'Offer approved successfully')
          : (isRTL ? 'تم رفض العرض بنجاح' : 'Offer rejected successfully');
          
        toast({ 
          title: isRTL ? 'نجح' : 'Success', 
          description: successMessage,
          variant: 'default'
        });
        
        await onUpdated?.();
        setOpen(false);
        setRejectionNotes('');
      } else {
        throw new Error('Failed to update offer status');
      }
    } catch (error: any) {
      console.error('Error updating offer:', error);
      toast({ 
        title: isRTL ? 'خطأ' : 'Error', 
        description: isRTL ? 'فشل في تحديث حالة العرض' : 'Failed to update offer status', 
        variant: 'destructive' 
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className={`text-xl font-semibold ${isRTL ? 'text-right' : ''}`}>
            {offer?.title || (isRTL ? 'تفاصيل العرض' : 'Offer Details')}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <LoadingSpinner text={isRTL ? 'جارٍ التحميل...' : 'Loading...'} />
          </div>
        ) : offer ? (
          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pr-2">
            {/* Status and Date */}
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Badge variant={getStatusVariant(offer.client_approval_status)} className="flex items-center gap-2">
                {getStatusIcon(offer.client_approval_status)}
                {offer.client_approval_status === 'approved' ? (isRTL ? 'مقبول' : 'Approved') :
                 offer.client_approval_status === 'rejected' ? (isRTL ? 'مرفوض' : 'Rejected') :
                 (isRTL ? 'قيد الانتظار' : 'Pending')}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(offer.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Permission Error */}
            {permissionError && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className={`text-destructive text-sm ${isRTL ? 'text-right' : ''}`}>
                  {permissionError}
                </p>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <Label className={`text-sm font-medium ${isRTL ? 'text-right' : ''}`}>
                {isRTL ? 'الوصف' : 'Description'}
              </Label>
              <div className={`bg-muted/50 rounded-lg p-4 ${isRTL ? 'text-right' : ''}`}>
                <p className="text-sm leading-relaxed">{offer.description}</p>
              </div>
            </div>

            {/* Price and Delivery Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-background border rounded-lg p-4 space-y-2">
                <div className={`flex items-center gap-2 text-sm font-medium ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span>{isRTL ? 'السعر' : 'Price'}</span>
                </div>
                <p className={`text-2xl font-bold text-primary ${isRTL ? 'text-right' : ''}`}>
                  {offer.price.toLocaleString()} SAR
                </p>
              </div>
              
              <div className="bg-background border rounded-lg p-4 space-y-2">
                <div className={`flex items-center gap-2 text-sm font-medium ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Truck className="h-4 w-4 text-primary" />
                  <span>{isRTL ? 'وقت التسليم' : 'Delivery Time'}</span>
                </div>
                <p className={`text-2xl font-bold text-primary ${isRTL ? 'text-right' : ''}`}>
                  {offer.delivery_time || 'Not specified'} {isRTL ? 'أيام' : 'days'}
                </p>
              </div>
            </div>

            {/* Approval Notes */}
            {offer.client_approval_notes && (
              <div className="space-y-2">
                <Label className={`text-sm font-medium ${isRTL ? 'text-right' : ''}`}>
                  {isRTL ? 'ملاحظات العميل' : 'Client Notes'}
                </Label>
                <div className={`bg-muted/50 rounded-lg p-4 ${isRTL ? 'text-right' : ''}`}>
                  <p className="text-sm">{offer.client_approval_notes}</p>
                </div>
              </div>
            )}

            {/* Approval Date */}
            {offer.client_approval_date && (
              <div className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
                <span className="font-medium">
                  {offer.client_approval_status === 'approved' 
                    ? (isRTL ? 'تم القبول في:' : 'Approved on:')
                    : (isRTL ? 'تم الرفض في:' : 'Rejected on:')}
                </span>
                <span className="ml-2">{new Date(offer.client_approval_date).toLocaleString()}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {isRTL ? 'العرض غير موجود' : 'Offer not found'}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {offer && (
          <div className={`border-t pt-4 mt-4 space-y-4 ${isRTL ? 'text-right' : ''}`}>
            {canModify && (
              <div className="space-y-3">
                <Label className={`text-sm font-medium ${isRTL ? 'text-right' : ''}`}>
                  {isRTL ? 'ملاحظات الرفض (اختيارية)' : 'Rejection Notes (Optional)'}
                </Label>
                <Textarea
                  placeholder={isRTL ? 'أدخل سبب الرفض أو ملاحظات أخرى...' : 'Enter reason for rejection or other notes...'}
                  value={rejectionNotes}
                  onChange={(e) => setRejectionNotes(e.target.value)}
                  className={`min-h-[80px] ${isRTL ? 'text-right' : ''}`}
                  disabled={actionLoading}
                />
              </div>
            )}
            
            <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setOpen(false)}
                disabled={actionLoading}
              >
                {isRTL ? 'إغلاق' : 'Close'}
              </Button>
              
              {canModify && (
                <>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        className="flex-1" 
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <LoadingSpinner />
                        ) : (
                          isRTL ? 'رفض العرض' : 'Reject Offer'
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{isRTL ? 'رفض العرض' : 'Reject Offer'}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {isRTL ? 'هل أنت متأكد من رفض هذا العرض؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to reject this offer? This action cannot be undone.'}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{isRTL ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => handleAction('rejected', rejectionNotes || undefined)}
                        >
                          {isRTL ? 'رفض' : 'Reject'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        className="flex-1" 
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <LoadingSpinner />
                        ) : (
                          isRTL ? 'قبول العرض' : 'Accept Offer'
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{isRTL ? 'قبول العرض' : 'Accept Offer'}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {isRTL ? 'هل أنت متأكد من قبول هذا العرض؟ سيتم إعلام المورد بقبول العرض.' : 'Are you sure you want to accept this offer? The supplier will be notified of the acceptance.'}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{isRTL ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleAction('approved')}>
                          {isRTL ? 'قبول' : 'Accept'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};