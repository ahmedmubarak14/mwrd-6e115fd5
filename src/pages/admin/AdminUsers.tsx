
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedUserManagement } from "@/components/admin/AdvancedUserManagement";
import { VerificationQueue } from "@/components/admin/VerificationQueue";
import { Users, FileCheck } from "lucide-react";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { cn } from "@/lib/utils";

const AdminUsers = () => {
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={cn(isRTL ? "text-right" : "text-left")}>
        <h1 className="text-3xl font-bold">{t('users.management')}</h1>
        <p className="text-muted-foreground">
          {t('users.manageDescription')}
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Users className="h-4 w-4" />
            {t('admin.users')}
          </TabsTrigger>
          <TabsTrigger value="verification" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <FileCheck className="h-4 w-4" />
            {t('users.verificationQueue')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <AdvancedUserManagement />
        </TabsContent>

        <TabsContent value="verification">
          <VerificationQueue />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminUsers;
