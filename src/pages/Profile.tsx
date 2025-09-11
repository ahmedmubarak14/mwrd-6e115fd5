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
import { CRDocumentUpload } from "@/components/verification/CRDocumentUpload";
import { UnifiedVerificationStatus } from "@/components/verification/UnifiedVerificationStatus";
import { MetricCard } from "@/components/ui/MetricCard";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { CompanyProfileSetupModal } from "@/components/onboarding/CompanyProfileSetupModal";
import { cn } from "@/lib/utils";

// Service categories for vendors
const SERVICE_CATEGORIES = [
  "Construction & Building",
  "Electrical Services",
  "Plumbing & HVAC",
  "Interior Design",
  "Landscaping",
  "Cleaning Services",
  "Security Services",
  "IT & Technology",
  "Catering & Food Services",
  "Transportation & Logistics",
  "Professional Services",
  "Marketing & Advertising"
];

const ProfilePage = memo(() => {
  const { userProfile, updateProfile, loading } = useAuth();
  const { t, isRTL } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
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
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowSetupModal(true)}
                  variant="default"
                  className="w-full md:w-auto"
                >
                  <Building className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                  Company Setup
                </Button>
                <Button 
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="w-full md:w-auto"
                >
                  <Edit className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                  {t('profile.editProfile')}
                </Button>
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
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
            
            {/* Allow document upload for non-verified users */}
            {(userProfile.verification_status === 'pending' || 
              userProfile.verification_status === 'rejected' || 
              !userProfile.verification_status) && (
              <div className="mt-6">
                <CRDocumentUpload
                  onUploadSuccess={() => window.location.reload()}
                  isRequired={true}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <CompanyProfileSetupModal 
          open={showSetupModal}
          onOpenChange={setShowSetupModal}
          onComplete={() => {
            setShowSetupModal(false);
            window.location.reload();
          }}
        />
      </div>
    </ErrorBoundary>
  );
});

ProfilePage.displayName = 'ProfilePage';

export default ProfilePage;