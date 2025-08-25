
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";

interface PricingCTAProps {
  isRTL: boolean;
}

export const PricingCTA = ({ isRTL }: PricingCTAProps) => {
  return (
    <div className="text-center py-20 animate-fade-in">
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-12 backdrop-blur-sm border border-primary/20">
        <h2 className="text-4xl font-bold mb-6 gradient-text">
          {isRTL ? 'لست متأكداً من الخطة المناسبة؟' : 'Not sure which plan is right for you?'}
        </h2>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {isRTL 
            ? 'تحدث مع فريقنا المتخصص للحصول على استشارة مجانية ومخصصة لاحتياجاتك'
            : 'Talk to our expert team for a free personalized consultation tailored to your needs'
          }
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Button asChild size="lg" className="flex-1 h-12 bg-gradient-to-r from-primary to-accent hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <Link to="/landing" className="flex items-center justify-center">
              {isRTL ? 'العودة للصفحة الرئيسية' : 'Back to Home'}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="flex-1 h-12 border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-300">
            <Link to="/support" className="flex items-center justify-center">
              <Phone className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'تواصل مع المبيعات' : 'Contact Sales'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
