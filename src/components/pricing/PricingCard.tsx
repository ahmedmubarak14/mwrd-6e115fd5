
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
      className={`relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group h-full ${
        plan.popular 
          ? 'border-2 border-primary shadow-xl scale-105 bg-gradient-to-br from-card to-primary/5' 
          : 'border border-border/50 bg-card backdrop-blur-sm'
      }`}
    >
      {plan.popular && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground text-center py-2 text-sm font-bold z-10">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {isRTL ? 'الأكثر شعبية' : 'Most Popular'}
          </Badge>
        </div>
      )}
      
      <CardHeader className={`text-center pb-4 ${plan.popular ? 'pt-12' : 'pt-6'} px-4 lg:px-6`}>
        <div className={`w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 lg:mb-6 rounded-2xl lg:rounded-3xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <IconComponent className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
        </div>
        
        <h3 className="text-xl lg:text-2xl font-bold mb-2 gradient-text">{plan.name}</h3>
        <p className="text-muted-foreground mb-4 lg:mb-6 text-sm">{plan.description}</p>
        
        <div className="text-center mb-4 lg:mb-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl lg:text-4xl font-bold text-foreground">{plan.price}</span>
            {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 px-4 lg:px-6 pb-6 flex flex-col flex-1">
        <ul className="space-y-3 lg:space-y-4 mb-6 lg:mb-8 flex-1">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-green-500" />
              </div>
              <span className="text-sm text-foreground/80 leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button
          className={`w-full h-12 font-semibold transition-all duration-300 ${
            plan.popular 
              ? 'bg-gradient-to-r from-primary via-accent to-primary hover:shadow-xl hover:scale-[1.02]' 
              : 'border-2 border-primary/20 hover:border-primary hover:bg-primary/5'
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
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
