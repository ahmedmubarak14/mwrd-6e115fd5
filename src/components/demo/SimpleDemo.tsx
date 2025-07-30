import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { Play, ArrowRight, CheckCircle, FileText, Users, BarChart3, Plus } from 'lucide-react';

interface SimpleDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimpleDemo = ({ isOpen, onClose }: SimpleDemoProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      titleEn: "Dashboard Overview",
      titleAr: "نظرة عامة على لوحة التحكم",
      descEn: "See all your requests, suppliers, and analytics in one place",
      descAr: "اطلع على جميع طلباتك والموردين والتحليلات في مكان واحد",
      component: <DashboardStep />
    },
    {
      titleEn: "Create Request",
      titleAr: "إنشاء طلب",
      descEn: "Request any event service with a simple form",
      descAr: "اطلب أي خدمة فعاليات من خلال نموذج بسيط",
      component: <RequestStep />
    },
    {
      titleEn: "Get Offers",
      titleAr: "احصل على عروض",
      descEn: "Receive competitive offers from verified suppliers",
      descAr: "احصل على عروض تنافسية من موردين معتمدين",
      component: <OffersStep />
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] h-[85vh] p-0">
        <DialogHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              {isRTL ? 'جولة سريعة في Supplify' : 'Quick Supplify Tour'}
            </DialogTitle>
            <Badge variant="outline">{currentStep + 1} / {steps.length}</Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              {isRTL ? currentStepData.titleAr : currentStepData.titleEn}
            </h3>
            <p className="text-muted-foreground">
              {isRTL ? currentStepData.descAr : currentStepData.descEn}
            </p>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 min-h-[400px]">
            {currentStepData.component}
          </div>
        </div>

        <div className="p-6 border-t flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            {isRTL ? 'السابق' : 'Previous'}
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button onClick={() => setCurrentStep(currentStep + 1)}>
              {isRTL ? 'التالي' : 'Next'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={onClose} className="bg-primary">
              {isRTL ? 'ابدأ الآن' : 'Get Started'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Simple mockup components
const DashboardStep = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      <Card className="bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {isRTL ? 'طلباتي' : 'My Requests'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">12</div>
          <div className="text-xs text-muted-foreground">
            {isRTL ? '3 في الانتظار' : '3 pending'}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-accent/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            {isRTL ? 'الموردين' : 'Suppliers'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">45</div>
          <div className="text-xs text-muted-foreground">
            {isRTL ? 'موردين نشطين' : 'active suppliers'}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-lime/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {isRTL ? 'التوفير' : 'Savings'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-lime">25%</div>
          <div className="text-xs text-muted-foreground">
            {isRTL ? 'توفير هذا الشهر' : 'this month'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RequestStep = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {isRTL ? 'طلب خدمة جديد' : 'New Service Request'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">
            {isRTL ? 'نوع الخدمة' : 'Service Type'}
          </label>
          <div className="mt-1 p-2 border rounded bg-background">
            {isRTL ? 'أكشاك العرض' : 'Exhibition Booths'}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">
            {isRTL ? 'الوصف' : 'Description'}
          </label>
          <div className="mt-1 p-2 border rounded bg-background h-20">
            {isRTL ? 'نحتاج 5 أكشاك عرض لمعرض تقني...' : 'Need 5 exhibition booths for tech expo...'}
          </div>
        </div>
        <Button className="w-full bg-primary">
          {isRTL ? 'إرسال الطلب' : 'Submit Request'}
        </Button>
      </CardContent>
    </Card>
  );
};

const OffersStep = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  return (
    <div className="space-y-4 h-full">
      <h4 className="font-medium">{isRTL ? 'العروض المستلمة' : 'Received Offers'}</h4>
      
      <Card className="border-primary/20">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-medium">{isRTL ? 'شركة المعارض المتقدمة' : 'Advanced Exhibitions Co.'}</div>
              <div className="text-sm text-muted-foreground">⭐ 4.9 ({isRTL ? '50 تقييم' : '50 reviews'})</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-primary">15,000 {isRTL ? 'ريال' : 'SAR'}</div>
              <Badge variant="outline" className="text-xs">
                {isRTL ? '3 أيام تسليم' : '3 days delivery'}
              </Badge>
            </div>
          </div>
          <Button size="sm" className="w-full">
            <CheckCircle className="h-4 w-4 mr-2" />
            {isRTL ? 'قبول العرض' : 'Accept Offer'}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-medium">{isRTL ? 'شركة الفعاليات الذهبية' : 'Golden Events Co.'}</div>
              <div className="text-sm text-muted-foreground">⭐ 4.7 ({isRTL ? '32 تقييم' : '32 reviews'})</div>
            </div>
            <div className="text-right">
              <div className="font-bold">18,500 {isRTL ? 'ريال' : 'SAR'}</div>
              <Badge variant="outline" className="text-xs">
                {isRTL ? '2 أيام تسليم' : '2 days delivery'}
              </Badge>
            </div>
          </div>
          <Button size="sm" variant="outline" className="w-full">
            {isRTL ? 'عرض التفاصيل' : 'View Details'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};