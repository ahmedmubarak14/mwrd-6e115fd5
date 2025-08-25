
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft } from "lucide-react";
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
      className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group ${
        plan.popular 
          ? 'border-2 border-primary shadow-xl scale-105 bg-gradient-to-br from-card/95 to-primary/5' 
          : 'border border-border/50 bg-card/80 backdrop-blur-sm'
      }`}
    >
      {plan.popular && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground text-center py-3 text-sm font-bold">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {isRTL ? 'الأكثر شعبية' : 'Most Popular'}
          </Badge>
        </div>
      )}
      
      <CardHeader className={`text-center pb-2 ${plan.popular ? 'pt-16' : 'pt-8'}`}>
        <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <IconComponent className="w-10 h-10 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold mb-2 gradient-text">{plan.name}</h3>
        <p className="text-muted-foreground mb-6 text-sm">{plan.description}</p>
        
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-foreground">{plan.price}</span>
            {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <ul className="space-y-4 mb-8">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-green-500" />
              </div>
              <span className="text-sm text-foreground/80">{feature}</span>
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
              <ArrowLeft className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
