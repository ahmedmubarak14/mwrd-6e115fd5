import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Shield, Globe, CreditCard, Key } from "lucide-react";

export const Settings = () => {
  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const { toast } = useToast();

  const handleSaveProfile = () => {
    toast({
      title: isRTL ? "تم الحفظ" : "Saved",
      description: isRTL ? "تم حفظ إعدادات الملف الشخصي" : "Profile settings have been saved",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: isRTL ? "تم الحفظ" : "Saved",
      description: isRTL ? "تم حفظ إعدادات الإشعارات" : "Notification settings have been saved",
    });
  };

  const handleSaveSecurity = () => {
    toast({
      title: isRTL ? "تم الحفظ" : "Saved", 
      description: isRTL ? "تم حفظ إعدادات الأمان" : "Security settings have been saved",
    });
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      <Header />
      <div className="flex">
        <Sidebar userRole={userProfile?.role as any} />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h1 className="text-3xl font-bold mb-2">
                {isRTL ? "الإعدادات" : "Settings"}
              </h1>
              <p className="text-muted-foreground">
                {isRTL ? "إدارة حسابك وتفضيلاتك" : "Manage your account and preferences"}
              </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <User className="h-4 w-4" />
                  {isRTL ? "الملف الشخصي" : "Profile"}
                </TabsTrigger>
                <TabsTrigger value="notifications" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Bell className="h-4 w-4" />
                  {isRTL ? "الإشعارات" : "Notifications"}
                </TabsTrigger>
                <TabsTrigger value="security" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Shield className="h-4 w-4" />
                  {isRTL ? "الأمان" : "Security"}
                </TabsTrigger>
                <TabsTrigger value="preferences" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Globe className="h-4 w-4" />
                  {isRTL ? "التفضيلات" : "Preferences"}
                </TabsTrigger>
              </TabsList>

              {/* Profile Settings */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle className={isRTL ? 'text-right' : 'text-left'}>
                      {isRTL ? "معلومات الملف الشخصي" : "Profile Information"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className={isRTL ? 'text-right' : 'text-left'}>
                          {isRTL ? "الاسم الكامل" : "Full Name"}
                        </Label>
                        <Input 
                          id="fullName" 
                          defaultValue={userProfile?.full_name || ""} 
                          className={isRTL ? 'text-right' : 'text-left'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className={isRTL ? 'text-right' : 'text-left'}>
                          {isRTL ? "البريد الإلكتروني" : "Email"}
                        </Label>
                        <Input 
                          id="email" 
                          type="email" 
                          defaultValue={userProfile?.email || ""} 
                          className={isRTL ? 'text-right' : 'text-left'}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company" className={isRTL ? 'text-right' : 'text-left'}>
                          {isRTL ? "اسم الشركة" : "Company Name"}
                        </Label>
                        <Input 
                          id="company" 
                          defaultValue={userProfile?.company_name || ""} 
                          className={isRTL ? 'text-right' : 'text-left'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role" className={isRTL ? 'text-right' : 'text-left'}>
                          {isRTL ? "الدور" : "Role"}
                        </Label>
                        <Select defaultValue={userProfile?.role || "client"}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="client">{isRTL ? "عميل" : "Client"}</SelectItem>
                            <SelectItem value="supplier">{isRTL ? "مقدم خدمة" : "Supplier"}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button onClick={handleSaveProfile} className="w-full">
                      {isRTL ? "حفظ التغييرات" : "Save Changes"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Settings */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle className={isRTL ? 'text-right' : 'text-left'}>
                      {isRTL ? "إعدادات الإشعارات" : "Notification Settings"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <Label className="text-base">
                          {isRTL ? "إشعارات البريد الإلكتروني" : "Email Notifications"}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? "تلقي إشعارات حول الطلبات والعروض" : "Receive notifications about requests and offers"}
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <Label className="text-base">
                          {isRTL ? "إشعارات الرسائل النصية" : "SMS Notifications"}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? "تلقي تحديثات مهمة عبر الرسائل النصية" : "Receive important updates via SMS"}
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <Label className="text-base">
                          {isRTL ? "إشعارات التطبيق" : "Push Notifications"}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? "تلقي إشعارات فورية في التطبيق" : "Receive instant notifications in the app"}
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Button onClick={handleSaveNotifications} className="w-full">
                      {isRTL ? "حفظ التغييرات" : "Save Changes"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle className={isRTL ? 'text-right' : 'text-left'}>
                      {isRTL ? "إعدادات الأمان" : "Security Settings"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className={isRTL ? 'text-right' : 'text-left'}>
                          {isRTL ? "كلمة المرور الحالية" : "Current Password"}
                        </Label>
                        <Input 
                          id="currentPassword" 
                          type="password" 
                          className={isRTL ? 'text-right' : 'text-left'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className={isRTL ? 'text-right' : 'text-left'}>
                          {isRTL ? "كلمة المرور الجديدة" : "New Password"}
                        </Label>
                        <Input 
                          id="newPassword" 
                          type="password" 
                          className={isRTL ? 'text-right' : 'text-left'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className={isRTL ? 'text-right' : 'text-left'}>
                          {isRTL ? "تأكيد كلمة المرور" : "Confirm New Password"}
                        </Label>
                        <Input 
                          id="confirmPassword" 
                          type="password" 
                          className={isRTL ? 'text-right' : 'text-left'}
                        />
                      </div>
                    </div>
                    <Separator />
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <Label className="text-base">
                          {isRTL ? "المصادقة الثنائية" : "Two-Factor Authentication"}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? "إضافة طبقة حماية إضافية لحسابك" : "Add an extra layer of security to your account"}
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <Button onClick={handleSaveSecurity} className="w-full">
                      {isRTL ? "حفظ التغييرات" : "Save Changes"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Settings */}
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle className={isRTL ? 'text-right' : 'text-left'}>
                      {isRTL ? "التفضيلات العامة" : "General Preferences"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="language" className={isRTL ? 'text-right' : 'text-left'}>
                          {isRTL ? "اللغة" : "Language"}
                        </Label>
                        <Select defaultValue={language}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="ar">العربية</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone" className={isRTL ? 'text-right' : 'text-left'}>
                          {isRTL ? "المنطقة الزمنية" : "Timezone"}
                        </Label>
                        <Select defaultValue="asia/riyadh">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asia/riyadh">Riyadh (GMT+3)</SelectItem>
                            <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency" className={isRTL ? 'text-right' : 'text-left'}>
                          {isRTL ? "العملة" : "Currency"}
                        </Label>
                        <Select defaultValue="sar">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sar">Saudi Riyal (SAR)</SelectItem>
                            <SelectItem value="usd">US Dollar (USD)</SelectItem>
                            <SelectItem value="eur">Euro (EUR)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Separator />
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <Label className="text-base">
                          {isRTL ? "الوضع المظلم" : "Dark Mode"}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? "تبديل إلى الوضع المظلم" : "Switch to dark theme"}
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <Button className="w-full">
                      {isRTL ? "حفظ التغييرات" : "Save Changes"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};