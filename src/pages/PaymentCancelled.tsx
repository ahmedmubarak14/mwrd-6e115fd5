import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const PaymentCancelled = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-600">
            {isArabic ? "تم إلغاء الدفع" : "Payment Cancelled"}
          </CardTitle>
          <CardDescription>
            {isArabic 
              ? "لم يتم إكمال عملية الدفع. يمكنك المحاولة مرة أخرى في أي وقت."
              : "Your payment was not completed. You can try again anytime."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link to="/pricing">
                {isArabic ? "المحاولة مرة أخرى" : "Try Again"}
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/">
                {isArabic ? "العودة للرئيسية" : "Back to Home"}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancelled;