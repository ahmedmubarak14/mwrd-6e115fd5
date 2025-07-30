import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Key, User, Mail, Building, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export const Profile = () => {
  const { userProfile, loading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: userProfile?.full_name || '',
    company_name: userProfile?.company_name || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(formData)
        .eq('id', userProfile?.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB.",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${userProfile?.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: publicUrl.publicUrl })
        .eq('id', userProfile?.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile picture updated successfully.",
      });

      // Refresh the page to show new avatar
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password changed successfully.",
      });

      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password.",
        variant: "destructive",
      });
    }
  };

  const getUserInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar userRole={userProfile?.role} />
        </SheetContent>
      </Sheet>

      <div className="flex">
        <div className="hidden lg:block">
          <Sidebar userRole={userProfile?.role} />
        </div>
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header - Salla/Zid Style */}
            <Card className="border-0 bg-gradient-to-r from-primary/10 via-accent/10 to-lime/10">
              <CardContent className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24 lg:h-32 lg:w-32 border-4 border-white shadow-lg">
                      <AvatarImage src={userProfile?.avatar_url} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {getUserInitials(userProfile?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full h-10 w-10 p-0 shadow-lg"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                      {userProfile?.full_name || userProfile?.email?.split('@')[0] || 'Welcome'}
                    </h1>
                    <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          userProfile?.role === 'admin' ? 'bg-red-100 text-red-800' :
                          userProfile?.role === 'supplier' ? 'bg-lime-100 text-lime-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          <Shield className="h-3 w-3 inline mr-1" />
                          {userProfile?.role}
                        </div>
                        {userProfile?.company_name && (
                          <div className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                            <Building className="h-3 w-3 inline mr-1" />
                            {userProfile.company_name}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                      <Mail className="h-4 w-4" />
                      {userProfile?.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Information Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <CardTitle>Personal Information</CardTitle>
                  </div>
                  <CardDescription>
                    Manage your personal details and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">📧 Email</Label>
                    <Input
                      id="email"
                      value={userProfile?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="full_name">👤 Full Name</Label>
                    <Input
                      id="full_name"
                      value={isEditing ? formData.full_name : userProfile?.full_name || ''}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>

                  {userProfile?.role === 'supplier' && (
                    <div className="space-y-2">
                      <Label htmlFor="company_name">🏢 Company Name</Label>
                      <Input
                        id="company_name"
                        value={isEditing ? formData.company_name : userProfile?.company_name || ''}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="role">🛡️ Role</Label>
                    <Input
                      id="role"
                      value={userProfile?.role || ''}
                      disabled
                      className="bg-muted capitalize"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} className="w-full">
                        ✏️ Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button onClick={handleSave} className="flex-1">
                          💾 Save Changes
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              full_name: userProfile?.full_name || '',
                              company_name: userProfile?.company_name || ''
                            });
                          }}
                          className="flex-1"
                        >
                          ❌ Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" />
                    <CardTitle>Security Settings</CardTitle>
                  </div>
                  <CardDescription>
                    Manage your account security and password.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Key className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Password Protection</p>
                        <p className="text-sm text-muted-foreground">Your account is secured with a password</p>
                      </div>
                    </div>
                  </div>

                  <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        🔐 Change Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                          Enter your new password below. Make sure it's at least 6 characters long.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handlePasswordChange} className="flex-1">
                            Update Password
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setIsChangingPassword(false);
                              setPasswordData({
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: ''
                              });
                            }}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};