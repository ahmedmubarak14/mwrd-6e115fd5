import { useState } from "react";
import { CleanDashboardLayout } from "@/components/layout/CleanDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToastFeedback } from "@/hooks/useToastFeedback";
import { User, Building, FileText, Settings, Tags } from "lucide-react";
import { CRDocumentUpload } from "@/components/verification/CRDocumentUpload";
import { VerificationStatus } from "@/components/verification/VerificationStatus";

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
  const { userProfile, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const { showSuccess } = useToastFeedback();

  const [formData, setFormData] = useState({
    full_name: userProfile?.full_name || "",
    company_name: userProfile?.company_name || "",
    phone: userProfile?.phone || "",
    address: userProfile?.address || "",
    bio: userProfile?.bio || "",
    portfolio_url: userProfile?.portfolio_url || "",
    categories: userProfile?.categories || [],
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const success = await updateProfile(formData);
      if (success) {
        showSuccess(t('profile.saveChanges'));
      }
    } finally {
      setLoading(false);
    }
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
        return <Badge className="bg-success">{t('profile.verified')}</Badge>;
      case 'rejected':
        return <Badge variant="destructive">{t('profile.rejected')}</Badge>;
      case 'under_review':
        return <Badge variant="outline">{t('profile.underReview')}</Badge>;
      default:
        return <Badge variant="secondary">{t('profile.pendingVerification')}</Badge>;
    }
  };

  if (!userProfile) return null;

  return (
    <CleanDashboardLayout>
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">{t('profile.title')}</h1>
              <p className="text-gray-600 text-lg">
                {t('profile.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getVerificationBadge()}
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-50">
              <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900">
                <User className="h-4 w-4" />
                {t('profile.tabs.profile')}
              </TabsTrigger>
              {userProfile.role === 'vendor' && (
                <TabsTrigger value="categories" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900">
                  <Tags className="h-4 w-4" />
                  {t('profile.tabs.categories')}
                </TabsTrigger>
              )}
              <TabsTrigger value="verification" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900">
                <FileText className="h-4 w-4" />
                {t('profile.tabs.verification')}
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900">
                <Settings className="h-4 w-4" />
                {t('profile.tabs.settings')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="grid gap-6">
                <Card className="border border-gray-200 bg-white hover:shadow-sm transition-shadow">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <User className="h-5 w-5" />
                      {t('profile.personalInfo')}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {t('profile.personalInfoDesc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-gray-900">{t('profile.fullName')}</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, full_name: e.target.value }))
                          }
                          className="border-gray-200 focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-900">{t('profile.email')}</Label>
                        <Input
                          id="email"
                          value={userProfile.email}
                          disabled
                          className="bg-gray-50 border-gray-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-900">{t('profile.phone')}</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, phone: e.target.value }))
                          }
                          className="border-gray-200 focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-gray-900">{t('profile.role')}</Label>
                        <Input
                          id="role"
                          value={userProfile.role}
                          disabled
                          className="bg-gray-50 border-gray-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-gray-900">{t('profile.address')}</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, address: e.target.value }))
                        }
                        className="border-gray-200 focus:border-blue-500"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 bg-white hover:shadow-sm transition-shadow">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Building className="h-5 w-5" />
                      {t('profile.companyInfo')}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {t('profile.companyInfoDesc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <div className="space-y-2">
                      <Label htmlFor="company_name" className="text-gray-900">{t('profile.companyName')}</Label>
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, company_name: e.target.value }))
                        }
                        className="border-gray-200 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-gray-900">
                        {userProfile.role === 'vendor' ? t('profile.bio') : t('profile.bioClient')}
                      </Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, bio: e.target.value }))
                        }
                        placeholder={
                          userProfile.role === 'vendor' 
                            ? t('profile.bioPlaceholder')
                            : t('profile.bioPlaceholderClient')
                        }
                        rows={4}
                        className="border-gray-200 focus:border-blue-500"
                      />
                    </div>

                    {userProfile.role === 'vendor' && (
                      <div className="space-y-2">
                        <Label htmlFor="portfolio_url" className="text-gray-900">{t('profile.portfolioUrl')}</Label>
                        <Input
                          id="portfolio_url"
                          value={formData.portfolio_url}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, portfolio_url: e.target.value }))
                          }
                          placeholder="https://your-portfolio.com"
                          className="border-gray-200 focus:border-blue-500"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? t('profile.saving') : t('profile.saveChanges')}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {userProfile.role === 'vendor' && (
              <TabsContent value="categories">
                <Card className="border border-gray-200 bg-white hover:shadow-sm transition-shadow">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Tags className="h-5 w-5" />
                      {t('profile.serviceCategories')}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {t('profile.serviceCategoriesDesc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {SERVICE_CATEGORIES.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={formData.categories.includes(category)}
                            onCheckedChange={(checked) => 
                              handleCategoryChange(category, checked as boolean)
                            }
                          />
                          <Label 
                            htmlFor={category} 
                            className="text-sm font-normal cursor-pointer text-gray-700"
                          >
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                    
                    {formData.categories.length > 0 && (
                      <div className="mt-4">
                        <Label className="text-sm font-medium text-gray-900">{t('profile.selectedCategories')}</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.categories.map((category) => (
                            <Badge key={category} variant="secondary" className="bg-gray-100 text-gray-700">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end mt-6">
                      <Button 
                        onClick={handleSave} 
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {loading ? t('profile.saving') : t('profile.saveCategories')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            <TabsContent value="verification">
              <div className="space-y-6">
                <VerificationStatus />
                
                {(userProfile.verification_status === 'pending' || 
                  userProfile.verification_status === 'rejected' || 
                  !userProfile.verification_status) && (
                  <CRDocumentUpload
                    onUploadSuccess={() => window.location.reload()}
                    isRequired={true}
                  />
                )}

                {userProfile.role === 'vendor' && (
                  <Card className="border border-gray-200 bg-white hover:shadow-sm transition-shadow">
                    <CardHeader className="border-b border-gray-100">
                      <CardTitle className="text-gray-900">{t('profile.verificationRequirements')}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {t('profile.verificationDesc')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-2 text-sm text-gray-700">
                        <p>✓ Commercial Registration (CR) certificate</p>
                        <p>✓ Valid business license</p>
                        <p>✓ Company profile and service categories</p>
                        <p className="text-gray-500 mt-3">
                          Once verified, you'll be able to bid on requests, receive orders, and access full messaging capabilities.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="border border-gray-200 bg-white hover:shadow-sm transition-shadow">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-gray-900">{t('profile.accountSettings')}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {t('profile.accountSettingsDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-900">{t('profile.accountStatus')}</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={userProfile.status === 'approved' ? 'default' : 'secondary'}>
                          {userProfile.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-gray-900">{t('profile.subscriptionPlan')}</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="border-gray-200 text-gray-700">
                          {userProfile.subscription_plan}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-900">{t('profile.memberSince')}</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(userProfile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </CleanDashboardLayout>
  );
};

export default Profile;
