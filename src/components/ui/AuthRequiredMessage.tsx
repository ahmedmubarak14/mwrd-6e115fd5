import { AlertTriangle, Lock, UserCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface AuthRequiredMessageProps {
  feature: string;
  className?: string;
}

export const AuthRequiredMessage = ({ feature, className }: AuthRequiredMessageProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <Alert className={`border-amber-200 bg-amber-50 ${className}`}>
      <Lock className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800 flex items-center gap-2">
        <UserCheck className="h-4 w-4" />
        {isRTL ? 'مطلوب تسجيل الدخول' : 'Authentication Required'}
      </AlertTitle>
      <AlertDescription className="text-amber-700 space-y-3">
        <p>
          {isRTL 
            ? `لاستخدام ${feature}، يجب عليك تسجيل الدخول أولاً. هذا يساعدنا في حماية بياناتك وتقديم خدمة أفضل.`
            : `To use ${feature}, you need to sign in first. This helps us protect your data and provide better service.`
          }
        </p>
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={() => navigate('/login')}
            size="sm"
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isRTL ? 'تسجيل الدخول' : 'Sign In'}
          </Button>
          <Button 
            onClick={() => navigate('/register')}
            variant="outline"
            size="sm"
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            {isRTL ? 'إنشاء حساب جديد' : 'Create Account'}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};