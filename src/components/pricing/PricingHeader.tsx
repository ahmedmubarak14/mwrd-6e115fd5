
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

interface PricingHeaderProps {
  isRTL: boolean;
}

export const PricingHeader = ({ isRTL }: PricingHeaderProps) => {
  return (
    <div className="text-center mb-12 lg:mb-20 animate-fade-in">
      <Badge 
        variant="outline" 
        className="mb-4 lg:mb-6 px-4 py-2 text-sm bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors"
      >
        <Zap className="w-4 h-4 mr-2 text-primary" />
        {isRTL ? 'خطط الاشتراك' : 'Subscription Plans'}
      </Badge>
      
      <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6 gradient-text leading-tight">
        {isRTL ? 'اختر الخطة المناسبة لك' : 'Choose Your Perfect Plan'}
      </h1>
      
      <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
        {isRTL 
          ? 'خطط مرنة تناسب جميع أحجام الشركات مع أفضل قيمة مقابل المال وضمان النجاح'
          : 'Flexible plans that scale with your business needs and deliver exceptional value with guaranteed success'
        }
      </p>
    </div>
  );
};
