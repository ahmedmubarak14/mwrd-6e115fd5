
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";

interface PricingCTAProps {
  isRTL: boolean;
}

export const PricingCTA = ({ isRTL }: PricingCTAProps) => {
  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="bg-white/10 rounded-3xl p-12 backdrop-blur-sm border border-white/20 shadow-2xl mx-4 lg:mx-0 hover:shadow-3xl hover:bg-white/15 transition-all duration-500">
        <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white">
          {isRTL ? 'لست متأكداً من الخطة المناسبة؟' : 'Not sure which plan is right for you?'}
        </h2>
        
        <p className="text-xl lg:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
          {isRTL 
            ? 'تحدث مع فريقنا المتخصص للحصول على استشارة مجانية ومخصصة لاحتياجاتك'
            : 'Talk to our expert team for a free personalized consultation tailored to your needs'
          }
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-lg mx-auto">
          <Button asChild size="lg" className="flex-1 h-14 text-lg bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:scale-[1.02] text-white">
            <Link to="/landing" className="flex items-center justify-center">
              {isRTL ? 'العودة للصفحة الرئيسية' : 'Back to Home'}
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="flex-1 h-14 text-lg border-2 border-white/30 hover:border-white text-white hover:bg-white/10 hover:shadow-lg transition-all duration-300 bg-transparent">
            <Link to="/support" className="flex items-center justify-center">
              <Phone className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'تواصل مع المبيعات' : 'Contact Sales'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
