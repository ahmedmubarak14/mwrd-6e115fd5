
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
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
        showSuccess("Profile updated successfully");
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
        return <Badge className="bg-success">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'under_review':
        return <Badge variant="outline">Under Review</Badge>;
      default:
        return <Badge variant="secondary">Pending Verification</Badge>;
    }
  };

  if (!userProfile) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your account information and verification status
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getVerificationBadge()}
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            {userProfile.role === 'vendor' && (
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <Tags className="h-4 w-4" />
                Categories
              </TabsTrigger>
            )}
            <TabsTrigger value="verification" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Verification
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, full_name: e.target.value }))
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={userProfile.email}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, phone: e.target.value }))
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={userProfile.role}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, address: e.target.value }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Company Information
                  </CardTitle>
                  <CardDescription>
                    Company details and business information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, company_name: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">
                      {userProfile.role === 'vendor' ? 'Company Description & Services' : 'Company Description'}
                    </Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, bio: e.target.value }))
                      }
                      placeholder={
                        userProfile.role === 'vendor' 
                          ? "Describe your company, services, and expertise..."
                          : "Describe your company and business..."
                      }
                      rows={4}
                    />
                  </div>

                  {userProfile.role === 'vendor' && (
                    <div className="space-y-2">
                      <Label htmlFor="portfolio_url">Portfolio URL</Label>
                      <Input
                        id="portfolio_url"
                        value={formData.portfolio_url}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, portfolio_url: e.target.value }))
                        }
                        placeholder="https://your-portfolio.com"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </TabsContent>

          {userProfile.role === 'vendor' && (
            <TabsContent value="categories">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tags className="h-5 w-5" />
                    Service Categories
                  </CardTitle>
                  <CardDescription>
                    Select the categories of services you provide. This helps clients find you for relevant requests.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                          className="text-sm font-normal cursor-pointer"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  {formData.categories.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium">Selected Categories:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.categories.map((category) => (
                          <Badge key={category} variant="secondary">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end mt-6">
                    <Button onClick={handleSave} disabled={loading}>
                      {loading ? "Saving..." : "Save Categories"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="verification">
            <div className="space-y-6">
              <VerificationStatus />
              
              {/* Allow both clients and vendors to upload CR documents */}
              {(userProfile.verification_status === 'pending' || 
                userProfile.verification_status === 'rejected' || 
                !userProfile.verification_status) && (
                <CRDocumentUpload
                  onUploadSuccess={() => window.location.reload()}
                  isRequired={true}
                />
              )}

              {/* Additional information for vendors */}
              {userProfile.role === 'vendor' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Vendor Verification Requirements</CardTitle>
                    <CardDescription>
                      As a vendor, verification is required to access bidding and order management features
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p>✓ Commercial Registration (CR) certificate</p>
                      <p>✓ Valid business license</p>
                      <p>✓ Company profile and service categories</p>
                      <p className="text-muted-foreground mt-3">
                        Once verified, you'll be able to bid on requests, receive orders, and access full messaging capabilities.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Account Status</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={userProfile.status === 'approved' ? 'default' : 'secondary'}>
                        {userProfile.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Subscription Plan</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">
                        {userProfile.subscription_plan}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Member Since</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(userProfile.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
