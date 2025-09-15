import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClientPageContainer } from '@/components/layout/ClientPageContainer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRFQs, RFQ } from '@/hooks/useRFQs';
import { useBids, Bid } from '@/hooks/useBids';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Calendar,
  DollarSign,
  MapPin,
  FileText,
  Users,
  Award,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { BidEvaluationInterface } from '@/components/rfq/BidEvaluationInterface';
import { PurchaseOrderGenerator } from '@/components/rfq/PurchaseOrderGenerator';

export default function RFQDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { rfqs, loading: rfqLoading } = useRFQs();
  const { getBidsByRFQ } = useBids();
  const { toast } = useToast();
  
  const [rfq, setRfq] = useState<RFQ | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const acceptedBid = useMemo(() => bids.find(b => b.status === 'accepted'), [bids]);

  useEffect(() => {
    const loadRFQDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Find RFQ from loaded data
        const foundRFQ = rfqs?.find(r => r.id === id);
        if (foundRFQ) {
          setRfq(foundRFQ);
        }
        
        // Load bids for this RFQ
        const rfqBids = await getBidsByRFQ(id);
        setBids(rfqBids);
        
      } catch (error) {
        console.error('Error loading RFQ details:', error);
        toast({
          title: language === 'ar' ? 'خطأ' : 'Error',
          description: language === 'ar' ? 'فشل في تحميل تفاصيل الطلب' : 'Failed to load RFQ details',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    if (!rfqLoading) {
      loadRFQDetails();
    }
  }, [id, rfqs, rfqLoading, getBidsByRFQ, language, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'published': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700';
      case 'evaluation': return 'bg-purple-100 text-purple-700';
      case 'awarded': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'draft': language === 'ar' ? 'مسودة' : 'Draft',
      'published': language === 'ar' ? 'منشور' : 'Published',
      'in_progress': language === 'ar' ? 'قيد التنفيذ' : 'In Progress',
      'evaluation': language === 'ar' ? 'تحت التقييم' : 'Evaluation',
      'awarded': language === 'ar' ? 'تم الترسية' : 'Awarded',
      'cancelled': language === 'ar' ? 'ملغي' : 'Cancelled',
      'completed': language === 'ar' ? 'مكتمل' : 'Completed'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const formatBudget = (rfq: RFQ) => {
    if (!rfq.budget_min && !rfq.budget_max) {
      return language === 'ar' ? 'قابل للتفاوض' : 'Negotiable';
    }
    if (rfq.budget_min && rfq.budget_max) {
      return `${rfq.budget_min.toLocaleString()} - ${rfq.budget_max.toLocaleString()} ${rfq.currency}`;
    }
    if (rfq.budget_min) {
      return `${language === 'ar' ? 'من' : 'From'} ${rfq.budget_min.toLocaleString()} ${rfq.currency}`;
    }
    if (rfq.budget_max) {
      return `${language === 'ar' ? 'حتى' : 'Up to'} ${rfq.budget_max.toLocaleString()} ${rfq.currency}`;
    }
    return language === 'ar' ? 'قابل للتفاوض' : 'Negotiable';
  };

  if (loading || rfqLoading) {
    return (
      <ClientPageContainer>
        <LoadingSpinner />
      </ClientPageContainer>
    );
  }

  if (!rfq) {
    return (
      <ClientPageContainer>
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {language === 'ar' ? 'لم يتم العثور على الطلب' : 'RFQ Not Found'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {language === 'ar' ? 'الطلب المطلوب غير موجود أو تم حذفه' : 'The requested RFQ does not exist or has been deleted'}
            </p>
            <Button onClick={() => navigate('/client/rfq-management')}>
              {language === 'ar' ? 'العودة إلى إدارة الطلبات' : 'Back to RFQ Management'}
            </Button>
          </CardContent>
        </Card>
      </ClientPageContainer>
    );
  }

  return (
    <ClientPageContainer>
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/client/rfq-management')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === 'ar' ? 'العودة إلى إدارة الطلبات' : 'Back to RFQ Management'}
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">{rfq.title}</h1>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(rfq.status)}>
                {getStatusText(rfq.status)}
              </Badge>
              <Badge variant="outline" className={`${rfq.priority === 'urgent' ? 'border-red-500 text-red-600' : ''}`}>
                {rfq.priority.charAt(0).toUpperCase() + rfq.priority.slice(1)}
              </Badge>
            </div>
            <p className="text-muted-foreground">{rfq.description}</p>
          </div>
        </div>
      </div>

      {/* Key Information */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'الميزانية' : 'Budget'}
                </p>
                <p className="font-semibold">{formatBudget(rfq)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'الموعد النهائي' : 'Deadline'}
                </p>
                <p className="font-semibold">
                  {format(new Date(rfq.submission_deadline), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'العروض' : 'Bids'}
                </p>
                <p className="font-semibold">{bids.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {rfq.delivery_location && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MapPin className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'موقع التسليم' : 'Location'}
                  </p>
                  <p className="font-semibold text-sm">{rfq.delivery_location}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            {language === 'ar' ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="requirements">
            {language === 'ar' ? 'المتطلبات' : 'Requirements'}
          </TabsTrigger>
          <TabsTrigger value="bids">
            {language === 'ar' ? 'العروض' : 'Bids'} ({bids.length})
          </TabsTrigger>
          <TabsTrigger value="evaluation">
            {language === 'ar' ? 'التقييم' : 'Evaluation'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {language === 'ar' ? 'تفاصيل الطلب' : 'RFQ Details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">
                    {language === 'ar' ? 'الوصف' : 'Description'}
                  </h4>
                  <p className="text-muted-foreground">{rfq.description}</p>
                </div>
                
                {rfq.project_start_date && (
                  <div>
                    <h4 className="font-medium mb-2">
                      {language === 'ar' ? 'بداية المشروع' : 'Project Start'}
                    </h4>
                    <p className="text-muted-foreground">
                      {format(new Date(rfq.project_start_date), 'PPP')}
                    </p>
                  </div>
                )}
                
                {rfq.project_end_date && (
                  <div>
                    <h4 className="font-medium mb-2">
                      {language === 'ar' ? 'نهاية المشروع' : 'Project End'}
                    </h4>
                    <p className="text-muted-foreground">
                      {format(new Date(rfq.project_end_date), 'PPP')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {language === 'ar' ? 'إحصائيات' : 'Statistics'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>{language === 'ar' ? 'إجمالي العروض' : 'Total Bids'}</span>
                  <span className="font-semibold">{bids.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'ar' ? 'العروض المقدمة' : 'Submitted Bids'}</span>
                  <span className="font-semibold">
                    {bids.filter(b => b.status === 'submitted').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'ar' ? 'العروض المقبولة' : 'Accepted Bids'}</span>
                  <span className="font-semibold">
                    {bids.filter(b => b.status === 'accepted').length}
                  </span>
                </div>
                {bids.length > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? 'أقل سعر' : 'Lowest Price'}</span>
                      <span className="font-semibold">
                        {Math.min(...bids.map(b => b.total_price)).toLocaleString()} {rfq.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? 'متوسط السعر' : 'Average Price'}</span>
                      <span className="font-semibold">
                        {Math.round(bids.reduce((sum, b) => sum + b.total_price, 0) / bids.length).toLocaleString()} {rfq.currency}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'المتطلبات التفصيلية' : 'Detailed Requirements'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {rfq.requirements?.description && (
                <div>
                  <h4 className="font-medium mb-2">
                    {language === 'ar' ? 'متطلبات إضافية' : 'Additional Requirements'}
                  </h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {rfq.requirements.description}
                  </p>
                </div>
              )}
              
              {rfq.evaluation_criteria?.description && (
                <div>
                  <h4 className="font-medium mb-2">
                    {language === 'ar' ? 'معايير التقييم' : 'Evaluation Criteria'}
                  </h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {rfq.evaluation_criteria.description}
                  </p>
                </div>
              )}
              
              {rfq.terms_and_conditions && (
                <div>
                  <h4 className="font-medium mb-2">
                    {language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
                  </h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {rfq.terms_and_conditions}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bids" className="space-y-6">
          {bids.length > 0 ? (
            <div className="grid gap-4">
              {bids.map((bid) => (
                <Card key={bid.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold">
                          {language === 'ar' ? 'عرض من مورد' : 'Bid from Vendor'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {language === 'ar' ? 'مقدم في' : 'Submitted on'} {format(new Date(bid.created_at), 'PPP')}
                        </p>
                      </div>
                      <Badge variant={bid.status === 'accepted' ? 'default' : 'secondary'}>
                        {bid.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {language === 'ar' ? 'السعر الإجمالي' : 'Total Price'}
                        </p>
                        <p className="font-semibold">
                          {bid.total_price.toLocaleString()} {bid.currency}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {language === 'ar' ? 'مدة التسليم' : 'Delivery Time'}
                        </p>
                        <p className="font-semibold">
                          {bid.delivery_timeline_days} {language === 'ar' ? 'يوم' : 'days'}
                        </p>
                      </div>
                      {bid.warranty_period_months && (
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {language === 'ar' ? 'فترة الضمان' : 'Warranty'}
                          </p>
                          <p className="font-semibold">
                            {bid.warranty_period_months} {language === 'ar' ? 'شهر' : 'months'}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        {language === 'ar' ? 'العرض' : 'Proposal'}
                      </p>
                      <p className="text-sm">{bid.proposal}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'ar' ? 'لا توجد عروض' : 'No Bids Yet'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'ar' ? 'لم يتم تقديم أي عروض لهذا الطلب حتى الآن' : 'No bids have been submitted for this RFQ yet'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="evaluation" className="space-y-6">
          <BidEvaluationInterface 
            rfqId={rfq.id} 
            bids={bids} 
            onAwarded={async () => {
              const rfqBids = await getBidsByRFQ(rfq.id);
              setBids(rfqBids);
            }}
          />
          {acceptedBid && (
            <PurchaseOrderGenerator rfq={rfq} winningBid={acceptedBid} />
          )}
        </TabsContent>
      </Tabs>
    </ClientPageContainer>
  );
}