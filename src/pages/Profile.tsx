import { useState } from "react";
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
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useToastFeedback } from "@/hooks/useToastFeedback";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
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
import { VerificationStatus } from "@/components/verification/VerificationStatus";
import { MetricCard } from "@/components/ui/MetricCard";
import { AvatarUpload } from "@/components/profile/AvatarUpload";

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

const Profile = () => {
  const { userProfile, updateProfile, loading } = useAuth();
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { t: (key: string) => key, isRTL: false };
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
        showSuccess(t('settings.profileUpdated'));
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
        return <Badge variant="default" className="bg-green-100 text-green-800">{t('settings.verified')}</Badge>;
      case 'rejected':
        return <Badge variant="destructive">{t('settings.rejected')}</Badge>;
      case 'under_review':
        return <Badge variant="outline">{t('settings.underReview')}</Badge>;
      default:
        return <Badge variant="secondary">{t('settings.notVerified')}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!userProfile) return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <p className="text-muted-foreground">{t('settings.profileNotFound')}</p>
        </div>
      </CardContent>
    </Card>
  );

  const userInitials = userProfile.full_name
    ? userProfile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : userProfile.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`flex flex-col gap-4 md:flex-row md:justify-between md:items-start mb-8 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
            {t('settings.title')}
          </h1>
          <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
            {t('settings.subtitle')}
          </p>
        </div>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {getVerificationBadge()}
          {!isEditing && (
            <Button 
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="w-full md:w-auto"
            >
              <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('profile.editProfile')}
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="profile" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <User className="h-4 w-4" />
            {t('settings.profile')}
          </TabsTrigger>
          <TabsTrigger value="verification" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Shield className="h-4 w-4" />
            {t('settings.verification')}
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
                  <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                    <CardTitle className="text-xl">{userProfile.full_name}</CardTitle>
                    {getVerificationBadge()}
                  </div>
                  <CardDescription className="text-base">
                    {userProfile.company_name || userProfile.email}
                  </CardDescription>
                   <div className={`flex items-center gap-2 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                   <CardTitle>{t('profile.profileInformation')}</CardTitle>
                   <CardDescription>
                     {t('profile.profileInfoDescription')}
                   </CardDescription>
                 </div>
                
                 {isEditing && (
                   <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={handleCancel}
                     >
                       <X className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                       {t('profile.cancel')}
                     </Button>
                     <Button
                       size="sm"
                       onClick={handleSave}
                       disabled={isSaving}
                     >
                       {isSaving ? (
                         <LoadingSpinner size="sm" className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
                       ) : (
                         <Save className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
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
                   <Label htmlFor="full_name" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                     <User className="h-4 w-4" />
                     {t('profile.fullName')}
                   </Label>
                   {isEditing ? (
                     <Input
                       id="full_name"
                       value={formData.full_name}
                       onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                       className={isRTL ? 'text-right' : ''}
                     />
                   ) : (
                     <p className={`text-sm py-2 ${isRTL ? 'text-right' : ''}`}>{userProfile.full_name || t('profile.notProvided')}</p>
                   )}
                 </div>

                 <div className="space-y-2">
                   <Label htmlFor="email" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                     <Mail className="h-4 w-4" />
                     {t('profile.email')}
                   </Label>
                   <p className={`text-sm py-2 ${isRTL ? 'text-right' : ''}`}>{userProfile.email}</p>
                 </div>

                 <div className="space-y-2">
                   <Label htmlFor="phone" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                     <Phone className="h-4 w-4" />
                     {t('profile.phone')}
                   </Label>
                   {isEditing ? (
                     <Input
                       id="phone"
                       value={formData.phone}
                       onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                       className={isRTL ? 'text-right' : ''}
                     />
                   ) : (
                     <p className={`text-sm py-2 ${isRTL ? 'text-right' : ''}`}>{userProfile.phone || t('profile.notProvided')}</p>
                   )}
                 </div>

                 <div className="space-y-2">
                   <Label htmlFor="company_name" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                     <Building className="h-4 w-4" />
                     {t('profile.companyName')}
                   </Label>
                   {isEditing ? (
                     <Input
                       id="company_name"
                       value={formData.company_name}
                       onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                       className={isRTL ? 'text-right' : ''}
                     />
                   ) : (
                     <p className={`text-sm py-2 ${isRTL ? 'text-right' : ''}`}>{userProfile.company_name || t('profile.notProvided')}</p>
                   )}
                 </div>

                 <div className="space-y-2">
                   <Label htmlFor="address" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                     <MapPin className="h-4 w-4" />
                     {t('profile.address')}
                   </Label>
                   {isEditing ? (
                     <Input
                       id="address"
                       value={formData.address}
                       onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                       className={isRTL ? 'text-right' : ''}
                     />
                   ) : (
                     <p className={`text-sm py-2 ${isRTL ? 'text-right' : ''}`}>{userProfile.address || t('profile.notProvided')}</p>
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
                     className={isRTL ? 'text-right' : ''}
                   />
                 ) : (
                   <p className={`text-sm py-2 min-h-[80px] bg-muted/50 rounded-md p-3 ${isRTL ? 'text-right' : ''}`}>
                     {userProfile.bio || t('profile.noBioProvided')}
                   </p>
                 )}
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <Card>
             <CardHeader>
               <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                 <Shield className="h-5 w-5" />
                 {t('profile.accountVerification')}
               </CardTitle>
               <CardDescription>
                 {t('profile.verificationDescription')}
               </CardDescription>
             </CardHeader>
            <CardContent>
              <VerificationStatus />
              
              {/* Allow both clients and vendors to upload CR documents */}
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;