import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PDFQuoteGenerator } from '@/components/vendor/PDFQuoteGenerator';
import { FileText, ChevronRight } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  delivery_time_days: number;
  created_at: string;
  request_id: string;
  client_approval_status: string;
}

interface RequestDetails {
  title: string;
  category: string;
  client_name?: string;
}

export const QuoteGeneratorPage = () => {
  const { isRTL } = useLanguage();
  const { userProfile } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(null);

  useEffect(() => {
    loadOffers();
  }, [userProfile?.id]);

  const loadOffers = async () => {
    if (!userProfile?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('vendor_id', userProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error('Error loading offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRequestDetails = async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          title,
          category,
          user_profiles:client_id (
            company_name,
            full_name
          )
        `)
        .eq('id', requestId)
        .single();

      if (error) throw error;

      setRequestDetails({
        title: data.title,
        category: data.category,
        client_name: data.user_profiles?.company_name || data.user_profiles?.full_name || 'Client',
      });
    } catch (error) {
      console.error('Error loading request details:', error);
    }
  };

  const handleSelectOffer = async (offer: Offer) => {
    setSelectedOffer(offer);
    await loadRequestDetails(offer.request_id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (selectedOffer) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => {
            setSelectedOffer(null);
            setRequestDetails(null);
          }}
          className="mb-4"
        >
          {isRTL ? '← العودة إلى العروض' : '← Back to Offers'}
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {isRTL ? 'إنشاء عرض سعر PDF' : 'Generate PDF Quote'}
          </h1>
          <p className="text-muted-foreground">
            {isRTL
              ? 'قم بإنشاء عرض سعر احترافي بصيغة PDF لإرساله إلى العملاء'
              : 'Create a professional PDF quote to send to clients'}
          </p>
        </div>

        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isRTL ? 'تفاصيل العرض' : 'Offer Details'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {isRTL ? 'العنوان:' : 'Title:'}
                </span>
                <span className="text-sm font-medium">{selectedOffer.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {isRTL ? 'السعر:' : 'Price:'}
                </span>
                <span className="text-sm font-medium">
                  {selectedOffer.price.toLocaleString()} {selectedOffer.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {isRTL ? 'وقت التسليم:' : 'Delivery:'}
                </span>
                <span className="text-sm font-medium">
                  {selectedOffer.delivery_time_days} {isRTL ? 'أيام' : 'days'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {isRTL ? 'الحالة:' : 'Status:'}
                </span>
                <Badge
                  variant={
                    selectedOffer.client_approval_status === 'approved'
                      ? 'default'
                      : selectedOffer.client_approval_status === 'rejected'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {selectedOffer.client_approval_status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <PDFQuoteGenerator offer={selectedOffer} requestDetails={requestDetails || undefined} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {isRTL ? 'مولد عروض الأسعار' : 'Quote Generator'}
        </h1>
        <p className="text-muted-foreground">
          {isRTL
            ? 'قم بإنشاء عروض أسعار احترافية بصيغة PDF من عروضك'
            : 'Generate professional PDF quotes from your offers'}
        </p>
      </div>

      {offers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              {isRTL
                ? 'لا توجد عروض متاحة. قم بتقديم عرض لطلب أولاً.'
                : 'No offers available. Submit an offer to a request first.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <Card
              key={offer.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleSelectOffer(offer)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{offer.title}</CardTitle>
                  <Badge
                    variant={
                      offer.client_approval_status === 'approved'
                        ? 'default'
                        : offer.client_approval_status === 'rejected'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {offer.client_approval_status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {isRTL ? 'السعر' : 'Price'}
                    </span>
                    <span className="font-bold">
                      {offer.price.toLocaleString()} {offer.currency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {isRTL ? 'التسليم' : 'Delivery'}
                    </span>
                    <span className="font-medium">
                      {offer.delivery_time_days} {isRTL ? 'أيام' : 'days'}
                    </span>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" className="w-full gap-2" size="sm">
                      <FileText className="h-4 w-4" />
                      {isRTL ? 'إنشاء عرض سعر PDF' : 'Generate PDF Quote'}
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuoteGeneratorPage;
