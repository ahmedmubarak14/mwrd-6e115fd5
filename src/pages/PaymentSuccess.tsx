import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { language } = useLanguage();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const isArabic = language === 'ar';

  useEffect(() => {
    // In a real implementation, you would verify the payment with Stripe
    // and update the order status in your database
    if (sessionId) {
      setOrderDetails({
        sessionId,
        status: "paid",
        timestamp: new Date().toLocaleString()
      });
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            {isArabic ? "تم الدفع بنجاح!" : "Payment Successful!"}
          </CardTitle>
          <CardDescription>
            {isArabic 
              ? "شكراً لك على شراء خطتك. يمكنك الآن الاستفادة من جميع المميزات."
              : "Thank you for your purchase. You can now enjoy all the features of your plan."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderDetails && (
            <div className="bg-muted/50 p-4 rounded-lg text-sm">
              <p className="font-medium">
                {isArabic ? "رقم الجلسة:" : "Session ID:"}
              </p>
              <p className="font-mono text-xs break-all">{orderDetails.sessionId}</p>
              <p className="mt-2 text-muted-foreground">
                {isArabic ? "وقت الدفع:" : "Payment Time:"} {orderDetails.timestamp}
              </p>
            </div>
          )}
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link to="/dashboard">
                {isArabic ? "انتقل إلى لوحة التحكم" : "Go to Dashboard"}
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

export default PaymentSuccess;