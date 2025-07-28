import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check, ArrowRight, Star, Users, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const Landing = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Users, title: "Vetted Suppliers", description: "Access to pre-screened, professional service providers" },
    { icon: Shield, title: "Secure Platform", description: "Safe transactions with built-in protection" },
    { icon: Zap, title: "Fast Matching", description: "Get matched with suppliers in minutes, not days" },
    { icon: Star, title: "Quality Assurance", description: "Rated suppliers with verified reviews" }
  ];

  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small events and businesses",
      features: [
        "Up to 5 service requests per month",
        "Basic supplier matching",
        "Email support",
        "Basic analytics"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$79", 
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "Up to 25 service requests per month",
        "Advanced supplier matching",
        "Priority support",
        "Advanced analytics",
        "Custom branding",
        "Dedicated account manager"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Unlimited service requests",
        "White-label solution",
        "24/7 dedicated support", 
        "Custom integrations",
        "Advanced reporting",
        "SLA guarantees"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/dbfa227c-ea00-42f4-9f7e-544c2b0bde60.png" 
              alt="Supplify Logo" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-primary">Supplify</span>
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link to="/login">
              <Button variant="ghost">{t('auth.login')}</Button>
            </Link>
            <Link to="/register">
              <Button>{t('auth.register')}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            {t('dashboard.welcome')}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('dashboard.subtitle')}
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/home">
              <Button size="lg" className="bg-lime hover:bg-lime/90 text-black font-semibold">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Supplify?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Choose Your Plan</h2>
          <p className="text-muted-foreground text-center mb-12">
            Select the perfect plan for your business needs
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-primary' : ''} hover:shadow-lg transition-shadow`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-lime shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Events?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of companies already using Supplify
          </p>
          <Link to="/home">
            <Button size="lg" className="bg-lime hover:bg-lime/90 text-black font-semibold">
              Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Supplify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};