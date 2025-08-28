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
  const { t } = languageContext || { t: (key: string) => key };
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
  });

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
      position: userProfile?.position || "",
      email: userProfile?.email || "",
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
        return <Badge variant="default" className="bg-green-100 text-green-800">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive">{t('profile.rejected')}</Badge>;
      case 'under_review':
        return <Badge variant="outline">Under Review</Badge>;
      default:
        return <Badge variant="secondary">Not Verified</Badge>;
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
          <p className="text-muted-foreground">Profile not found</p>
        </div>
      </CardContent>
    </Card>
  );

  const userInitials = userProfile.full_name
    ? userProfile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : userProfile.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your account information and verification status</p>
        </div>
        
        <div className="flex items-center gap-2">
          {getVerificationBadge()}
          {!isEditing && (
            <Button 
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="w-full md:w-auto"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="verification" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Verification
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Overview Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userProfile.avatar_url} alt={userProfile.full_name} />
                  <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                    <CardTitle className="text-xl">{userProfile.full_name}</CardTitle>
                    {getVerificationBadge()}
                  </div>
                  <CardDescription className="text-base">
                    {userProfile.position && userProfile.company_name 
                      ? `${userProfile.position} at ${userProfile.company_name}`
                      : userProfile.company_name || userProfile.email
                    }
                  </CardDescription>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <Calendar className="h-4 w-4" />
                    Member since {new Date(userProfile.created_at || '').toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Profile Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal and company information
                  </CardDescription>
                </div>
                
                {isEditing && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <LoadingSpinner size="sm" className="mr-2" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">
                    <User className="inline mr-2 h-4 w-4" />
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm py-2">{userProfile.full_name || 'Not provided'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="inline mr-2 h-4 w-4" />
                    Email
                  </Label>
                  <p className="text-sm py-2">{userProfile.email}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="inline mr-2 h-4 w-4" />
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm py-2">{userProfile.phone || 'Not provided'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_name">
                    <Building className="inline mr-2 h-4 w-4" />
                    Company Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm py-2">{userProfile.company_name || 'Not provided'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position/Title</Label>
                  {isEditing ? (
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm py-2">{userProfile.position || 'Not provided'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    <MapPin className="inline mr-2 h-4 w-4" />
                    Address
                  </Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm py-2">{userProfile.address || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                ) : (
                  <p className="text-sm py-2 min-h-[80px] bg-muted/50 rounded-md p-3">
                    {userProfile.bio || 'No bio provided'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Verification
              </CardTitle>
              <CardDescription>
                Verify your account to access all platform features
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