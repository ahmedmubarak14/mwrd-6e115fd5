import React, { useState, memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToastFeedback } from "@/hooks/useToastFeedback";
import { useCategories } from '@/hooks/useCategories';
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { 
  User, 
  Building, 
  FileText, 
  Settings, 
  Tags,
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Shield,
  Edit,
  Save,
  X
} from "lucide-react";
import { UnifiedVerificationStatus } from "@/components/verification/UnifiedVerificationStatus";
import { MetricCard } from "@/components/ui/MetricCard";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { SupplierPerformanceScorecard } from "@/components/vendor/SupplierPerformanceScorecard";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";


const ProfilePage = memo(() => {
  const { userProfile, updateProfile, loading } = useAuth();
  const { t, isRTL } = useLanguage();
  const { categories, loading: categoriesLoading } = useCategories();
  // Get service categories from database
  const serviceCategories = categories.map(cat => cat.name_en).filter(Boolean);
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { showSuccess } = useToastFeedback();

  const [formData, setFormData] = useState({
    full_name: userProfile?.full_name || "",
    company_name: userProfile?.company_name || "",
    phone: userProfile?.phone || "",
    address: userProfile?.address || "",
    bio: userProfile?.bio || "",
    portfolio_url: userProfile?.portfolio_url || "",
    categories: userProfile?.categories || [],
    email: userProfile?.email || "",
    avatar_url: userProfile?.avatar_url || "",
  });

  const handleAvatarUpdate = (avatarUrl: string) => {
    setFormData(prev => ({ ...prev, avatar_url: avatarUrl }));
    // Force a refresh of user profile data
    window.location.reload();
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await updateProfile(formData);
      if (success) {
        showSuccess(t('profile.saveChanges'));
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: userProfile?.full_name || "",
      company_name: userProfile?.company_name || "",
      phone: userProfile?.phone || "",
      address: userProfile?.address || "",
      bio: userProfile?.bio || "",
      portfolio_url: userProfile?.portfolio_url || "",
      categories: userProfile?.categories || [],
      email: userProfile?.email || "",
      avatar_url: userProfile?.avatar_url || "",
    });
    setIsEditing(false);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }));
  };

  const getVerificationBadge = () => {
    if (!userProfile) return null;
    
    switch (userProfile.verification_status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">{t('profile.verified')}</Badge>;
      case 'rejected':
        return <Badge variant="destructive">{t('profile.rejected')}</Badge>;
      case 'under_review':
        return <Badge variant="outline">{t('profile.underReview')}</Badge>;
      default:
        return <Badge variant="secondary">{t('profile.notVerified')}</Badge>;
    }
  };

  if (loading) {
    return (
      <ErrorBoundary>
        <div className="flex justify-center items-center min-h-[400px]" dir={isRTL ? 'rtl' : 'ltr'}>
          <LoadingSpinner size="lg" />
        </div>
      </ErrorBoundary>
    );
  }

  if (!userProfile) return (
    <ErrorBoundary>
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground">{t('profile.profileNotFound')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );

  const userInitials = userProfile.full_name
    ? userProfile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : userProfile.email?.charAt(0).toUpperCase() || 'U';

  return (
    <ErrorBoundary>
      <div className="p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        
        {/* Header */}
        <div className={cn(
          "flex flex-col gap-4 md:flex-row md:justify-between md:items-start mb-8",
          isRTL && "md:flex-row-reverse"
        )}>
          <div className={cn(isRTL && "text-right")}>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
              {t('profile.title')}
            </h1>
            <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
              {t('profile.subtitle')}
            </p>
          </div>
          <div className={cn(
            "flex items-center gap-2",
            isRTL && "flex-row-reverse"
          )}>
            {getVerificationBadge()}
            {!isEditing && (
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="w-full md:w-auto"
              >
                <Edit className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                {t('profile.editProfile')}
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className={cn(
            "grid w-full lg:w-[600px]",
            userProfile.role === 'vendor' ? "grid-cols-3" : "grid-cols-2"
          )}>
            <TabsTrigger
              value="profile"
              className={cn(
                "flex items-center gap-2",
                isRTL && "flex-row-reverse"
              )}
            >
              <User className="h-4 w-4" />
              {t('profile.title')}
            </TabsTrigger>
            <TabsTrigger
              value="verification"
              className={cn(
                "flex items-center gap-2",
                isRTL && "flex-row-reverse"
              )}
            >
              <Shield className="h-4 w-4" />
              {t('profile.verification')}
            </TabsTrigger>
            {userProfile.role === 'vendor' && (
              <TabsTrigger
                value="performance"
                className={cn(
                  "flex items-center gap-2",
                  isRTL && "flex-row-reverse"
                )}
              >
                <FileText className="h-4 w-4" />
                {isRTL ? 'بطاقة الأداء' : 'Performance'}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Avatar Upload Section */}
            <div className="grid gap-6 md:grid-cols-3">
              <AvatarUpload
                currentAvatarUrl={userProfile.avatar_url}
                userInitials={userInitials}
                onAvatarUpdate={handleAvatarUpdate}
              />
              
              {/* Profile Overview Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex flex-col space-y-4">
                    <div className={cn(
                      "flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3",
                      isRTL && "sm:flex-row-reverse sm:space-x-reverse"
                    )}>
                      <CardTitle className="text-xl">{userProfile.full_name}</CardTitle>
                      {getVerificationBadge()}
                    </div>
                    <CardDescription className="text-base">
                      {userProfile.company_name || userProfile.email}
                    </CardDescription>
                     <div className={cn(
                       "flex items-center gap-2 text-sm text-muted-foreground",
                       isRTL && "flex-row-reverse"
                     )}>
                       <Calendar className="h-4 w-4" />
                       {t('profile.memberSince')} {new Date(userProfile.created_at || '').toLocaleDateString()}
                     </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Profile Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                   <div>
                     <CardTitle>{t('profile.personalInformation')}</CardTitle>
                     <CardDescription>
                       {t('profile.personalInfoDescription')}
                     </CardDescription>
                   </div>
                  
                   {isEditing && (
                     <div className={cn(
                       "flex gap-2",
                       isRTL && "flex-row-reverse"
                     )}>
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={handleCancel}
                       >
                         <X className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                         {t('common.cancel')}
                       </Button>
                       <Button
                         size="sm"
                         onClick={handleSave}
                         disabled={isSaving}
                       >
                         {isSaving ? (
                           <LoadingSpinner size="sm" className={cn(isRTL ? "ml-2" : "mr-2")} />
                         ) : (
                           <Save className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                         )}
                         {t('profile.saveChanges')}
                       </Button>
                     </div>
                   )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                   <div className="space-y-2">
                     <Label 
                       htmlFor="full_name" 
                       className={cn(
                         "flex items-center gap-2",
                         isRTL && "flex-row-reverse"
                       )}
                     >
                       <User className="h-4 w-4" />
                       {t('profile.fullName')}
                     </Label>
                     {isEditing ? (
                       <Input
                         id="full_name"
                         value={formData.full_name}
                         onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                         className={cn(isRTL && "text-right")}
                         dir={isRTL ? 'rtl' : 'ltr'}
                       />
                     ) : (
                       <p className={cn(
                         "text-sm py-2",
                         isRTL && "text-right"
                       )}>
                         {userProfile.full_name || t('profile.notProvided')}
                       </p>
                     )}
                   </div>

                   <div className="space-y-2">
                     <Label 
                       htmlFor="email" 
                       className={cn(
                         "flex items-center gap-2",
                         isRTL && "flex-row-reverse"
                       )}
                     >
                       <Mail className="h-4 w-4" />
                       {t('profile.email')}
                     </Label>
                     <p className={cn(
                       "text-sm py-2",
                       isRTL && "text-right"
                     )}>
                       {userProfile.email}
                     </p>
                   </div>

                   <div className="space-y-2">
                     <Label 
                       htmlFor="phone" 
                       className={cn(
                         "flex items-center gap-2",
                         isRTL && "flex-row-reverse"
                       )}
                     >
                       <Phone className="h-4 w-4" />
                       {t('profile.phone')}
                     </Label>
                     {isEditing ? (
                       <Input
                         id="phone"
                         value={formData.phone}
                         onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                         className={cn(isRTL && "text-right")}
                         dir={isRTL ? 'rtl' : 'ltr'}
                       />
                     ) : (
                       <p className={cn(
                         "text-sm py-2",
                         isRTL && "text-right"
                       )}>
                         {userProfile.phone || t('profile.notProvided')}
                       </p>
                     )}
                   </div>

                   <div className="space-y-2">
                     <Label 
                       htmlFor="company_name" 
                       className={cn(
                         "flex items-center gap-2",
                         isRTL && "flex-row-reverse"
                       )}
                     >
                       <Building className="h-4 w-4" />
                       {t('profile.companyName')}
                     </Label>
                     {isEditing ? (
                       <Input
                         id="company_name"
                         value={formData.company_name}
                         onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                         className={cn(isRTL && "text-right")}
                         dir={isRTL ? 'rtl' : 'ltr'}
                       />
                     ) : (
                       <p className={cn(
                         "text-sm py-2",
                         isRTL && "text-right"
                       )}>
                         {userProfile.company_name || t('profile.notProvided')}
                       </p>
                     )}
                   </div>

                   <div className="space-y-2">
                     <Label 
                       htmlFor="address" 
                       className={cn(
                         "flex items-center gap-2",
                         isRTL && "flex-row-reverse"
                       )}
                     >
                       <MapPin className="h-4 w-4" />
                       {t('profile.address')}
                     </Label>
                     {isEditing ? (
                       <Input
                         id="address"
                         value={formData.address}
                         onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                         className={cn(isRTL && "text-right")}
                         dir={isRTL ? 'rtl' : 'ltr'}
                       />
                     ) : (
                       <p className={cn(
                         "text-sm py-2",
                         isRTL && "text-right"
                       )}>
                         {userProfile.address || t('profile.notProvided')}
                       </p>
                     )}
                   </div>
                </div>

                 <div className="space-y-2">
                   <Label htmlFor="bio">{t('profile.bio')}</Label>
                   {isEditing ? (
                     <Textarea
                       id="bio"
                       value={formData.bio}
                       onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                       placeholder={t('profile.bioPlaceholder')}
                       rows={4}
                       className={cn(isRTL && "text-right")}
                       dir={isRTL ? 'rtl' : 'ltr'}
                     />
                   ) : (
                     <p className={cn(
                       "text-sm py-2 min-h-[80px] bg-muted/50 rounded-md p-3",
                       isRTL && "text-right"
                     )}>
                       {userProfile.bio || t('profile.noBioProvided')}
                     </p>
                   )}
                 </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <UnifiedVerificationStatus showActions={true} compact={false} />
            
            {/* Redirect to KYC form for verification */}
            {(userProfile.verification_status === 'pending' || 
              userProfile.verification_status === 'rejected' || 
              !userProfile.verification_status) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Complete KYC Verification
                  </CardTitle>
                  <CardDescription>
                    Complete your Know Your Customer (KYC) verification to unlock all platform features.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => navigate('/kyc/form')}
                    className="w-full"
                  >
                    <Shield className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                    Complete KYC Form
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Performance Scorecard Tab - Only for Vendors */}
          {userProfile.role === 'vendor' && (
            <TabsContent value="performance" className="space-y-6">
              <SupplierPerformanceScorecard
                vendorId={userProfile.id}
                className="max-w-4xl"
              />

              <Card className="max-w-4xl">
                <CardHeader>
                  <CardTitle>{isRTL ? 'حول بطاقة الأداء' : 'About Performance Scorecard'}</CardTitle>
                  <CardDescription>
                    {isRTL
                      ? 'يتم حساب هذه المقاييس تلقائياً من قبل منصة MWRD بناءً على نشاطك الفعلي على المنصة. لا يمكن تعديل هذه المقاييس يدوياً.'
                      : 'These metrics are automatically calculated by the MWRD platform based on your actual activity. These metrics cannot be manually edited.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">
                          {isRTL ? 'معدل إتمام الطلبات' : 'Order Completion Rate'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {isRTL
                            ? 'نسبة الطلبات المقبولة التي أتممتها بنجاح من إجمالي الطلبات'
                            : 'Percentage of accepted orders you successfully completed'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">
                          {isRTL ? 'معدل التسليم في الوقت المحدد' : 'On-Time Delivery Rate'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {isRTL
                            ? 'نسبة الطلبات التي تم تسليمها في الموعد المحدد أو قبله'
                            : 'Percentage of orders delivered on or before the agreed date'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">
                          {isRTL ? 'متوسط وقت الرد' : 'Average Quote Response Time'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {isRTL
                            ? 'المتوسط الزمني لتقديم عروض الأسعار بعد استلام طلب عرض السعر'
                            : 'Your average time to submit quotes after receiving an RFQ'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">
                          {isRTL ? 'معدل تكرار الأعمال' : 'Repeat Business Rate'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {isRTL
                            ? 'نسبة العملاء الذين عادوا للعمل معك مرة أخرى'
                            : 'Percentage of clients who have placed more than one order with you'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg border">
                    <p className="text-sm">
                      {isRTL
                        ? '💡 نصيحة: حافظ على معدلات أداء عالية لزيادة فرصك في الفوز بعقود جديدة. العملاء يمكنهم رؤية بطاقة أدائك عند البحث عن الموردين.'
                        : '💡 Tip: Maintain high performance rates to increase your chances of winning new contracts. Clients can see your scorecard when searching for suppliers.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </ErrorBoundary>
  );
});

ProfilePage.displayName = 'ProfilePage';

export default ProfilePage;