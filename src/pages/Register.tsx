import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthForm } from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Register = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{t('auth.signUp')}</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthForm
            onAuthSuccess={(user) => {
              if (user.role === "admin") {
                navigate("/admin/dashboard");
              } else if (user.role === "vendor") {
                navigate("/vendor-dashboard");
              } else {
                navigate("/dashboard");
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
