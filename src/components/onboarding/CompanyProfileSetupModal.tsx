import React, { useState, useEffect } from 'react';
import { Building2, Upload, Users, MapPin, CheckCircle, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToastFeedback } from '@/hooks/useToastFeedback';
import { useCategories } from '@/hooks/useCategories';
import { supabase } from '@/integrations/supabase/client';
import { resendConfirmationEmail } from '@/utils/resendConfirmation';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CRDocumentUpload } from '@/components/verification/CRDocumentUpload';

interface CompanyProfileSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

interface ProfileData {
  companyName: string;
  website: string;
  companySize: string;
  description: string;
  categories: string[];
  industryPreferences: string[];
  coverageLocations: string[];
  bankName: string;
  bankAccountNumber: string;
  iban: string;
  establishedYear: string;
  employeeCount: string;
  teamSize: string;
  experience: string;
}

const BUSINESS_SIZES = [
  { value: 'freelancer', label: 'Freelancer / Individual' },
  { value: 'small', label: 'Small Business (2-10 employees)' },
  { value: 'medium', label: 'Medium Business (11-50 employees)' },
  { value: 'large', label: 'Large Enterprise (50+ employees)' }
];

const CLIENT_INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Education',
  'Government',
  'Non-profit',
  'Real Estate',
  'Hospitality'
];

const COVERAGE_LOCATIONS = [
  'Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina', 
  'Taif', 'Khobar', 'Abha', 'Tabuk', 'Najran',
  'Nationwide Coverage'
];

export const CompanyProfileSetupModal = ({ 
  open, 
  onOpenChange, 
  onComplete 
}: CompanyProfileSetupModalProps) => {
  const { userProfile, updateProfile } = useAuth();
  const { t } = useLanguage();
  const { showSuccess, showError } = useToastFeedback();
  const { categories, loading: categoriesLoading } = useCategories();

  // Resend confirmation email on component mount
  useEffect(() => {
    const handleResendConfirmation = async () => {
      try {
        const { success, error } = await resendConfirmationEmail('ahmedmubaraks@icloud.com');
        if (success) {
          showSuccess('Confirmation email sent successfully to ahmedmubaraks@icloud.com');
        } else {
          showError(`Failed to resend confirmation: ${error}`);
        }
      } catch (error) {
        console.error('Error resending confirmation:', error);
        showError('Unexpected error while resending confirmation email');
      }
    };

    if (open) {
      handleResendConfirmation();
    }
  }, [open, showSuccess, showError]);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [crUploaded, setCrUploaded] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    companyName: '',
    website: '',
    companySize: '',
    description: '',
    categories: [],
    industryPreferences: [],
    coverageLocations: [],
    bankName: '',
    bankAccountNumber: '',
    iban: '',
    establishedYear: '',
    employeeCount: '',
    teamSize: '',
    experience: ''
  });

  const isVendor = userProfile?.role === 'vendor';
  const isClient = userProfile?.role === 'client';
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setProfileData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleIndustryToggle = (industry: string) => {
    setProfileData(prev => ({
      ...prev,
      industryPreferences: prev.industryPreferences.includes(industry)
        ? prev.industryPreferences.filter(i => i !== industry)
        : [...prev.industryPreferences, industry]
    }));
  };

  const handleLocationToggle = (location: string) => {
    setProfileData(prev => ({
      ...prev,
      coverageLocations: prev.coverageLocations.includes(location)
        ? prev.coverageLocations.filter(l => l !== location)
        : [...prev.coverageLocations, location]
    }));
  };

  const handleComplete = async () => {
    if (!crUploaded) {
      showError('Please upload your Commercial Registration to complete setup');
      return;
    }

    setLoading(true);
    try {
      // Update main profile - use context method now that types are fixed
      const success = await updateProfile({
        company_name: profileData.companyName,
        bio: profileData.description,
        portfolio_url: profileData.website,
        categories: isVendor ? profileData.categories : undefined,
        industry_preferences: isClient ? profileData.industryPreferences : undefined,
        bank_name: profileData.bankName,
        bank_account_number: profileData.bankAccountNumber,
        iban: profileData.iban
      });

      if (success) {
        // Handle vendor-specific extended profile
        if (isVendor) {
          const { error } = await supabase
            .from('vendor_profiles_extended')
            .insert({
              vendor_id: userProfile?.id,
              business_size: profileData.companySize,
              established_year: parseInt(profileData.establishedYear) || null,
              employee_count: profileData.employeeCount,
              team_size: profileData.teamSize,
              experience_years: parseInt(profileData.experience) || null,
              coverage_locations: profileData.coverageLocations
            });

          if (error) {
            // Try update if insert fails
            await supabase
              .from('vendor_profiles_extended')
              .update({
                business_size: profileData.companySize,
                established_year: parseInt(profileData.establishedYear) || null,
                employee_count: profileData.employeeCount,
                team_size: profileData.teamSize,
                experience_years: parseInt(profileData.experience) || null,
                coverage_locations: profileData.coverageLocations
              })
              .eq('vendor_id', userProfile?.id);
          }
        }

        // Handle client-specific extended profile
        if (isClient) {
          await supabase
            .from('client_profiles_extended')
            .insert({
              client_id: userProfile?.id,
              budget_range: profileData.companySize,
              procurement_frequency: 'monthly',
              business_requirements: {
                industries: profileData.industryPreferences,
                company_size: profileData.companySize
              }
            });
        }

        showSuccess('Company profile setup completed successfully! Your profile is now under review.');
        onComplete?.();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Profile setup error:', error);
      showError('Failed to setup company profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onOpenChange(false);
    onComplete?.();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Building2 className="h-12 w-12 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Company Information</h2>
              <p className="text-muted-foreground">Tell us about your company</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Company Name *</Label>
                <Input
                  placeholder="Enter your company name"
                  value={profileData.companyName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, companyName: e.target.value }))}
                />
              </div>

              <div>
                <Label>Company Size *</Label>
                <Select 
                  value={profileData.companySize} 
                  onValueChange={(value) => setProfileData(prev => ({ ...prev, companySize: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Established Year</Label>
                  <Input
                    type="number"
                    placeholder="2020"
                    value={profileData.establishedYear}
                    onChange={(e) => setProfileData(prev => ({ ...prev, establishedYear: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Employee Count</Label>
                  <Select 
                    value={profileData.employeeCount}
                    onValueChange={(value) => setProfileData(prev => ({ ...prev, employeeCount: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 (Just me)</SelectItem>
                      <SelectItem value="2-5">2-5 employees</SelectItem>
                      <SelectItem value="6-10">6-10 employees</SelectItem>
                      <SelectItem value="11-25">11-25 employees</SelectItem>
                      <SelectItem value="26-50">26-50 employees</SelectItem>
                      <SelectItem value="50+">50+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Website (Optional)</Label>
                <Input
                  type="url"
                  placeholder="https://www.yourcompany.com"
                  value={profileData.website}
                  onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                />
              </div>

              <div>
                <Label>Company Description</Label>
                <textarea
                  className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                  placeholder="Describe your company and services..."
                  value={profileData.description}
                  onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              {isVendor ? <Users className="h-12 w-12 mx-auto text-primary" /> : <Building2 className="h-12 w-12 mx-auto text-primary" />}
              <h2 className="text-2xl font-bold">
                {isVendor ? 'Service Categories' : 'Industry Preferences'}
              </h2>
              <p className="text-muted-foreground">
                {isVendor ? 'Select the services you provide' : 'Select industries you work with'}
              </p>
            </div>

            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  {isVendor 
                    ? 'Select all categories that match your business. This helps us match you with relevant opportunities.'
                    : 'Select industries you frequently work with to receive relevant requests.'
                  }
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {(isVendor ? 
                  (categoriesLoading ? [] : categories.map(cat => cat.name_en).filter(Boolean)) 
                  : CLIENT_INDUSTRIES).map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={item}
                      checked={isVendor 
                        ? profileData.categories.includes(item)
                        : profileData.industryPreferences.includes(item)
                      }
                      onCheckedChange={() => 
                        isVendor ? handleCategoryToggle(item) : handleIndustryToggle(item)
                      }
                    />
                    <Label htmlFor={item} className="text-sm font-normal">
                      {item}
                    </Label>
                  </div>
                ))}
              </div>

              {isVendor && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Team Size for Projects</Label>
                      <Select
                        value={profileData.teamSize}
                        onValueChange={(value) => setProfileData(prev => ({ ...prev, teamSize: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select team size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2">1-2 people</SelectItem>
                          <SelectItem value="3-5">3-5 people</SelectItem>
                          <SelectItem value="6-10">6-10 people</SelectItem>
                          <SelectItem value="11-20">11-20 people</SelectItem>
                          <SelectItem value="20+">20+ people</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Years of Experience</Label>
                      <Input
                        type="number"
                        placeholder="5"
                        value={profileData.experience}
                        onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <CreditCard className="h-12 w-12 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Banking Information</h2>
              <p className="text-muted-foreground">Add your bank account details for payments</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Bank Name *</Label>
                <Input
                  placeholder="e.g., Al Rajhi Bank"
                  value={profileData.bankName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bankName: e.target.value }))}
                />
              </div>

              <div>
                <Label>Bank Account Number *</Label>
                <Input
                  placeholder="Enter your account number"
                  value={profileData.bankAccountNumber}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bankAccountNumber: e.target.value }))}
                />
              </div>

              <div>
                <Label>IBAN *</Label>
                <Input
                  placeholder="SA00 0000 0000 0000 0000 0000"
                  value={profileData.iban}
                  onChange={(e) => setProfileData(prev => ({ ...prev, iban: e.target.value }))}
                />
              </div>

              {isVendor && (
                <div>
                  <Label>Service Coverage Areas</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 max-h-40 overflow-y-auto">
                    {COVERAGE_LOCATIONS.map((location) => (
                      <div key={location} className="flex items-center space-x-2">
                        <Checkbox
                          id={location}
                          checked={profileData.coverageLocations.includes(location)}
                          onCheckedChange={() => handleLocationToggle(location)}
                        />
                        <Label htmlFor={location} className="text-sm font-normal">
                          {location}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Upload className="h-12 w-12 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Document Verification</h2>
              <p className="text-muted-foreground">Upload your Commercial Registration</p>
            </div>

            <CRDocumentUpload
              onUploadSuccess={() => setCrUploaded(true)}
              isRequired={true}
            />

            {crUploaded && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Commercial Registration uploaded successfully! You can now complete your setup.
                </AlertDescription>
              </Alert>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Company Profile</DialogTitle>
          <DialogDescription>
            Step {currentStep} of {totalSteps} - Set up your {isVendor ? 'vendor' : 'client'} profile
          </DialogDescription>
        </DialogHeader>
      <div className="space-y-6">
        <Progress value={progress} className="w-full" />
        
        {renderStep()}

        <div className="flex justify-between pt-6">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              onClick={handleSkip}
            >
              Skip for now
            </Button>
          </div>

          {currentStep === totalSteps ? (
            <Button
              onClick={handleComplete}
              disabled={!crUploaded || loading}
            >
              {loading ? 'Completing...' : 'Complete Setup'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !profileData.companyName) ||
                (currentStep === 3 && (!profileData.bankName || !profileData.bankAccountNumber || !profileData.iban))
              }
            >
              Next
            </Button>
          )}
        </div>
      </div>
      </DialogContent>
    </Dialog>
  );
};