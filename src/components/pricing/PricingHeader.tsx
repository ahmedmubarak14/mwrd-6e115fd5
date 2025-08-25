
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

interface PricingHeaderProps {
  isRTL: boolean;
}

export const PricingHeader = ({ isRTL }: PricingHeaderProps) => {
  return (
    <div className="text-center mb-20 animate-fade-in">
      <Badge 
        variant="outline" 
        className="mb-6 px-6 py-3 text-sm font-medium bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 text-primary hover:bg-gradient-to-r hover:from-primary/20 hover:to-accent/20 transition-all duration-300"
      >
        <Zap className="w-4 h-4 mr-2 text-primary" />
        {isRTL ? 'خطط الاشتراك' : 'Subscription Plans'}
      </Badge>
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
        {isRTL ? 'اختر الخطة المناسبة لك' : 'Choose Your Perfect Plan'}
      </h1>
      
      <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
        {isRTL 
          ? 'خطط مرنة تناسب جميع أحجام الشركات مع أفضل قيمة مقابل المال وضمان النجاح'
          : 'Flexible plans that scale with your business needs and deliver exceptional value with guaranteed success'
        }
      </p>
    </div>
  );
};
