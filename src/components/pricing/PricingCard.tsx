
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  priceId: string;
  features: string[];
  popular: boolean;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface PricingCardProps {
  plan: PricingPlan;
  onSubscribe: (priceId: string, planName: string) => Promise<void>;
  loading: boolean;
  isRTL: boolean;
}

export const PricingCard = ({ plan, onSubscribe, loading, isRTL }: PricingCardProps) => {
  const IconComponent = plan.icon;

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 group h-full backdrop-blur-sm border ${
        plan.popular 
          ? 'border-2 border-white/50 shadow-2xl shadow-white/25 scale-105 bg-white/10' 
          : 'border-white/30 bg-white/5 hover:border-white/50'
      }`}
    >
      {plan.popular && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary via-accent to-primary text-white text-center py-3 text-sm font-bold z-10 shadow-lg">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 font-bold">
            {isRTL ? 'الأكثر شعبية' : 'Most Popular'}
          </Badge>
        </div>
      )}
      
      <CardHeader className={`text-center pb-6 ${plan.popular ? 'pt-16' : 'pt-8'} px-8`}>
        <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300`}>
          <IconComponent className="w-10 h-10 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold mb-3 text-white">{plan.name}</h3>
        <p className="text-white/70 mb-6">{plan.description}</p>
        
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl lg:text-5xl font-bold text-white">{plan.price}</span>
            {plan.period && <span className="text-white/70 text-lg">{plan.period}</span>}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 px-8 pb-8 flex flex-col flex-1">
        <ul className="space-y-4 mb-8 flex-1">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 border border-green-500/50">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-white/90 leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button
          className={`w-full h-14 font-semibold text-lg transition-all duration-300 shadow-lg ${
            plan.popular 
              ? 'bg-gradient-to-r from-primary via-accent to-primary hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.02] text-white' 
              : 'border-2 border-white/30 hover:border-white text-white hover:bg-white/10 hover:shadow-lg bg-transparent'
          }`}
          variant={plan.popular ? 'default' : 'outline'}
          onClick={() => onSubscribe(plan.priceId, plan.name)}
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              {isRTL ? 'اختر هذه الخطة' : 'Choose Plan'}
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
