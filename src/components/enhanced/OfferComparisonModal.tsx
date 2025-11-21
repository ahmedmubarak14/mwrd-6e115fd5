
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOffers, Offer } from "@/hooks/useOffers";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, DollarSign, Clock, Star, TrendingUp, TrendingDown, Download, MessageSquare, Award } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupplierPerformanceScorecard } from "@/components/vendor/SupplierPerformanceScorecard";

interface OfferComparisonModalProps {
  children: React.ReactNode;
  offers: Offer[];
  onOfferAction?: (offerId: string, action: 'approve' | 'reject', notes?: string) => void;
}

export const OfferComparisonModal = ({ children, offers, onOfferAction }: OfferComparisonModalProps) => {
  const [open, setOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const { language } = useLanguage();
  const { updateOfferStatus } = useOffers();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isRTL = language === 'ar';

  // Calculate comparison metrics
  const avgPrice = offers.reduce((sum, offer) => sum + offer.price, 0) / offers.length;
  const minPrice = Math.min(...offers.map(o => o.price));
  const maxPrice = Math.max(...offers.map(o => o.price));
  const avgDelivery = offers.reduce((sum, offer) => sum + offer.delivery_time_days, 0) / offers.length;

  const getPriceIndicator = (price: number) => {
    if (price === minPrice) return { icon: TrendingDown, color: 'text-green-600', label: 'Best Price' };
    if (price === maxPrice) return { icon: TrendingUp, color: 'text-red-600', label: 'Highest Price' };
    return { icon: DollarSign, color: 'text-yellow-600', label: 'Average Price' };
  };

  const getDeliveryIndicator = (days: number) => {
    const minDelivery = Math.min(...offers.map(o => o.delivery_time_days));
    if (days === minDelivery) return { color: 'text-green-600', label: 'Fastest' };
    if (days > avgDelivery) return { color: 'text-red-600', label: 'Slower' };
    return { color: 'text-yellow-600', label: 'Average' };
  };

  const handleOfferAction = async (offerId: string, action: 'approve' | 'reject') => {
    try {
      if (onOfferAction) {
        await onOfferAction(offerId, action, actionNotes);
      } else {
        await updateOfferStatus(offerId, action === 'approve' ? 'approved' : 'rejected', actionNotes);
      }
      setOpen(false);
      setActionNotes('');
      setSelectedOffer(null);
    } catch (error) {
      console.error('Error handling offer action:', error);
    }
  };

  const openActionDialog = (offerId: string, action: 'approve' | 'reject') => {
    setSelectedOffer(offerId);
    setActionType(action);
    setActionNotes('');
  };

  const handleExportToCSV = () => {
    try {
      // Create CSV headers
      const headers = ['Vendor', 'Title', 'Price (SAR)', 'Currency', 'Delivery (days)', 'Status', 'Description', 'Value Score'];

      // Create CSV rows
      const rows = offers.map(offer => {
        const valueScore = Math.round(((maxPrice - offer.price) / (maxPrice - minPrice) * 50) +
                                     ((avgDelivery - offer.delivery_time_days) / avgDelivery * 50));
        return [
          `Vendor #${offer.vendor_id.slice(0, 8)}`,
          offer.title,
          offer.price,
          offer.currency,
          offer.delivery_time_days,
          offer.client_approval_status,
          `"${offer.description.replace(/"/g, '""')}"`, // Escape quotes in description
          valueScore
        ];
      });

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `offer_comparison_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: isRTL ? 'تم التصدير بنجاح' : 'Export Successful',
        description: isRTL ? 'تم تنزيل ملف المقارنة' : 'Comparison file downloaded',
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast({
        title: isRTL ? 'خطأ في التصدير' : 'Export Error',
        description: isRTL ? 'فشل تصدير الملف' : 'Failed to export file',
        variant: 'destructive',
      });
    }
  };

  const handleMessageVendor = (vendorId: string) => {
    navigate(`/messages?vendor=${vendorId}`);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className={isRTL ? 'text-right' : ''}>
                {isRTL ? 'مقارنة العروض' : 'Compare Offers'} ({offers.length})
              </DialogTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportToCSV}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {isRTL ? 'تصدير CSV' : 'Export CSV'}
              </Button>
            </div>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">
                {isRTL ? 'نظرة عامة' : 'Overview'}
              </TabsTrigger>
              <TabsTrigger value="details">
                {isRTL ? 'التفاصيل' : 'Details'}
              </TabsTrigger>
              <TabsTrigger value="performance">
                {isRTL ? 'الأداء' : 'Performance'}
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Comparison Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {isRTL ? 'متوسط السعر' : 'Average Price'}
                    </p>
                    <p className="text-2xl font-bold">{avgPrice.toLocaleString()} SAR</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {isRTL ? 'نطاق السعر' : 'Price Range'}
                    </p>
                    <p className="text-lg font-semibold">
                      {minPrice.toLocaleString()} - {maxPrice.toLocaleString()} SAR
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {isRTL ? 'متوسط التسليم' : 'Avg. Delivery'}
                    </p>
                    <p className="text-2xl font-bold">{Math.round(avgDelivery)} {isRTL ? 'أيام' : 'days'}</p>
                  </div>
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

              {/* Offers Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offers.map((offer) => {
                  const priceIndicator = getPriceIndicator(offer.price);
                  const deliveryIndicator = getDeliveryIndicator(offer.delivery_time_days);
                  const valueScore = Math.round(((maxPrice - offer.price) / (maxPrice - minPrice) * 50) +
                                               ((avgDelivery - offer.delivery_time_days) / avgDelivery * 50));

                  return (
                    <Card key={offer.id} className="relative">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{offer.title}</CardTitle>
                          <Badge variant={offer.client_approval_status === 'approved' ? 'default' :
                                       offer.client_approval_status === 'rejected' ? 'destructive' : 'secondary'}>
                            {offer.client_approval_status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Vendor #{offer.vendor_id.slice(0, 8)}
                        </p>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Price Analysis */}
                        <div className="flex items-center gap-2">
                          <priceIndicator.icon className={`h-5 w-5 ${priceIndicator.color}`} />
                          <div>
                            <p className="font-bold text-lg">{offer.price.toLocaleString()} {offer.currency}</p>
                            <p className={`text-xs ${priceIndicator.color}`}>{priceIndicator.label}</p>
                          </div>
                        </div>

                        {/* Delivery Analysis */}
                        <div className="flex items-center gap-2">
                          <Clock className={`h-5 w-5 ${deliveryIndicator.color}`} />
                          <div>
                            <p className="font-medium">{offer.delivery_time_days} {isRTL ? 'أيام' : 'days'}</p>
                            <p className={`text-xs ${deliveryIndicator.color}`}>{deliveryIndicator.label}</p>
                          </div>
                        </div>

                        {/* Value Score */}
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">
                            {isRTL ? 'قيمة النتيجة' : 'Value Score'}: {valueScore}%
                          </span>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedVendorId(offer.vendor_id)}
                            className="gap-1"
                          >
                            <Award className="h-3 w-3" />
                            {isRTL ? 'الأداء' : 'Performance'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMessageVendor(offer.vendor_id)}
                            className="gap-1"
                          >
                            <MessageSquare className="h-3 w-3" />
                            {isRTL ? 'رسالة' : 'Message'}
                          </Button>
                        </div>

                        {/* Action Buttons */}
                        {offer.client_approval_status === 'pending' && (
                          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Button
                              onClick={() => openActionDialog(offer.id, 'approve')}
                              className="flex-1"
                              size="sm"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {isRTL ? 'قبول' : 'Accept'}
                            </Button>
                            <Button
                              onClick={() => openActionDialog(offer.id, 'reject')}
                              variant="destructive"
                              className="flex-1"
                              size="sm"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              {isRTL ? 'رفض' : 'Reject'}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <div className="space-y-4">
                {offers.map((offer) => (
                  <Card key={offer.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{offer.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Vendor #{offer.vendor_id.slice(0, 8)}
                          </p>
                        </div>
                        <Badge variant={offer.client_approval_status === 'approved' ? 'default' :
                                     offer.client_approval_status === 'rejected' ? 'destructive' : 'secondary'}>
                          {offer.client_approval_status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">
                            {isRTL ? 'السعر' : 'Price'}
                          </Label>
                          <p className="text-lg font-bold">
                            {offer.price.toLocaleString()} {offer.currency}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            {isRTL ? 'وقت التسليم' : 'Delivery Time'}
                          </Label>
                          <p className="text-lg font-bold">
                            {offer.delivery_time_days} {isRTL ? 'أيام' : 'days'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          {isRTL ? 'الوصف' : 'Description'}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {offer.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-4">
              {selectedVendorId ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      {isRTL ? 'بطاقة أداء المورد' : 'Supplier Performance Scorecard'}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedVendorId(null)}
                    >
                      {isRTL ? 'عرض الكل' : 'View All'}
                    </Button>
                  </div>
                  <SupplierPerformanceScorecard vendorId={selectedVendorId} />
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {isRTL
                      ? 'اختر موردًا لعرض بطاقة الأداء الخاصة به'
                      : 'Select a supplier to view their performance scorecard'}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {offers.map((offer) => (
                      <Card
                        key={offer.id}
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => setSelectedVendorId(offer.vendor_id)}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{offer.title}</p>
                              <p className="text-sm text-muted-foreground">
                                Vendor #{offer.vendor_id.slice(0, 8)}
                              </p>
                            </div>
                            <Award className="h-8 w-8 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <AlertDialog open={!!selectedOffer} onOpenChange={() => setSelectedOffer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'approve' 
                ? (isRTL ? 'تأكيد قبول العرض' : 'Confirm Offer Acceptance')
                : (isRTL ? 'تأكيد رفض العرض' : 'Confirm Offer Rejection')
              }
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'approve'
                ? (isRTL ? 'سيتم إنشاء طلب جديد عند قبول هذا العرض.' : 'A new order will be created when you accept this offer.')
                : (isRTL ? 'هل أنت متأكد من رفض هذا العرض؟' : 'Are you sure you want to reject this offer?')
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">{isRTL ? 'ملاحظات (اختيارية)' : 'Notes (Optional)'}</Label>
              <Textarea
                id="notes"
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder={isRTL ? 'أضف ملاحظات حول قرارك...' : 'Add notes about your decision...'}
                className="min-h-20"
              />
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>{isRTL ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedOffer && handleOfferAction(selectedOffer, actionType)}
              className={actionType === 'reject' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
            >
              {actionType === 'approve' ? (isRTL ? 'قبول العرض' : 'Accept Offer') : (isRTL ? 'رفض العرض' : 'Reject Offer')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
