import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Building2, MapPin, Users, Award, Upload, CheckCircle } from 'lucide-react';
import { CRDocumentUpload } from '@/components/verification/CRDocumentUpload';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToastFeedback } from '@/hooks/useToastFeedback';

interface VendorOnboardingProps {
  onComplete?: () => void;
}

interface OnboardingData {
  businessSize: string;
  companyInfo: {
    establishedYear: string;
    employeeCount: string;
    website: string;
    description: string;
  };
  serviceAreas: string[];
  categories: string[];
  capabilities: {
    teamSize: string;
    equipment: string[];
    certifications: string[];
    experience: string;
  };
  coverageLocations: string[];
}

const BUSINESS_SIZES = [
  { value: 'freelancer', label: 'Freelancer / Individual', description: '1 person operation' },
  { value: 'small', label: 'Small Business', description: '2-10 employees' },
  { value: 'medium', label: 'Medium Business', description: '11-50 employees' },
  { value: 'large', label: 'Large Enterprise', description: '50+ employees' }
];

const SERVICE_CATEGORIES = [
  'Audio Visual Equipment (AVL)',
  'Hospitality Services',
  'Booth & Exhibition Stands',
  'Photography & Videography',
  'Security Services',
  'Transportation & Logistics',
  'Catering & Food Services',
  'Decoration & Flowers',
  'Entertainment & Shows'
];

const COVERAGE_LOCATIONS = [
  'Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina', 
  'Taif', 'Khobar', 'Abha', 'Tabuk', 'Najran',
  'Nationwide Coverage'
];

export const VendorOnboarding = ({ onComplete }: VendorOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    businessSize: '',
    companyInfo: {
      establishedYear: '',
      employeeCount: '',
      website: '',
      description: ''
    },
    serviceAreas: [],
    categories: [],
    capabilities: {
      teamSize: '',
      equipment: [],
      certifications: [],
      experience: ''
    },
    coverageLocations: []
  });
  const [crUploaded, setCrUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userProfile, updateProfile } = useAuth();
  const { showSuccess, showError } = useToastFeedback();
  const { t } = useLanguage();

  const totalSteps = 5;
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
    setOnboardingData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleLocationToggle = (location: string) => {
    setOnboardingData(prev => ({
      ...prev,
      coverageLocations: prev.coverageLocations.includes(location)
        ? prev.coverageLocations.filter(l => l !== location)
        : [...prev.coverageLocations, location]
    }));
  };

  const handleComplete = async () => {
    if (!crUploaded) {
      showError('Please upload your Commercial Registration to complete onboarding');
      return;
    }

    setLoading(true);
    try {
      const success = await updateProfile({
        categories: onboardingData.categories,
        verification_status: 'pending',
        bio: onboardingData.companyInfo.description,
        portfolio_url: onboardingData.companyInfo.website,
      });

      if (success) {
        // Use direct table insertion to the vendor_profiles_extended table
        const { error } = await supabase
          .from('vendor_profiles_extended')
          .insert({
            vendor_id: userProfile?.id,
            business_size: onboardingData.businessSize,
            established_year: parseInt(onboardingData.companyInfo.establishedYear) || null,
            employee_count: onboardingData.companyInfo.employeeCount,
            team_size: onboardingData.capabilities.teamSize,
            experience_years: parseInt(onboardingData.capabilities.experience) || null,
            coverage_locations: onboardingData.coverageLocations,
            equipment: onboardingData.capabilities.equipment,
            certifications: onboardingData.capabilities.certifications
          });

        if (error) {
          // If insert fails, try update (in case record already exists)
          const { error: updateError } = await supabase
            .from('vendor_profiles_extended')
            .update({
              business_size: onboardingData.businessSize,
              established_year: parseInt(onboardingData.companyInfo.establishedYear) || null,
              employee_count: onboardingData.companyInfo.employeeCount,
              team_size: onboardingData.capabilities.teamSize,
              experience_years: parseInt(onboardingData.capabilities.experience) || null,
              coverage_locations: onboardingData.coverageLocations,
              equipment: onboardingData.capabilities.equipment,
              certifications: onboardingData.capabilities.certifications
            })
            .eq('vendor_id', userProfile?.id);

          if (updateError) {
            console.error('Error saving vendor extended profile:', updateError);
            throw updateError;
          }
        }

        showSuccess('Onboarding completed successfully! Your profile is now under review.');
        onComplete?.();
      }
    } catch (error) {
      console.error('Onboarding completion error:', error);
      showError('Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Building2 className="h-12 w-12 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Business Information</h2>
              <p className="text-muted-foreground">Tell us about your business</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Business Size *</Label>
                <Select 
                  value={onboardingData.businessSize} 
                  onValueChange={(value) => setOnboardingData(prev => ({ ...prev, businessSize: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('forms.selectBusinessSize')} />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        <div>
                          <div className="font-medium">{size.label}</div>
                          <div className="text-sm text-muted-foreground">{size.description}</div>
                        </div>
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
                    value={onboardingData.companyInfo.establishedYear}
                    onChange={(e) => setOnboardingData(prev => ({
                      ...prev,
                      companyInfo: { ...prev.companyInfo, establishedYear: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label>Current Employee Count</Label>
                  <Select 
                    value={onboardingData.companyInfo.employeeCount}
                    onValueChange={(value) => setOnboardingData(prev => ({
                      ...prev,
                      companyInfo: { ...prev.companyInfo, employeeCount: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('forms.selectRange')} />
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
                  placeholder={t('forms.websiteExample')}
                  value={onboardingData.companyInfo.website}
                  onChange={(e) => setOnboardingData(prev => ({
                    ...prev,
                    companyInfo: { ...prev.companyInfo, website: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Award className="h-12 w-12 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Service Categories</h2>
              <p className="text-muted-foreground">Select the services you provide</p>
            </div>

            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Select all categories that match your business. This helps us match you with relevant opportunities.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SERVICE_CATEGORIES.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={onboardingData.categories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    />
                    <Label htmlFor={category} className="text-sm font-normal">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>

              {onboardingData.categories.length === 0 && (
                <Alert>
                  <AlertDescription>
                    Please select at least one service category to continue.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <MapPin className="h-12 w-12 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Service Coverage</h2>
              <p className="text-muted-foreground">Where do you provide your services?</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {COVERAGE_LOCATIONS.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={location}
                      checked={onboardingData.coverageLocations.includes(location)}
                      onCheckedChange={() => handleLocationToggle(location)}
                    />
                    <Label htmlFor={location} className="text-sm font-normal">
                      {location}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Users className="h-12 w-12 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Capabilities & Experience</h2>
              <p className="text-muted-foreground">Help clients understand your capacity</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Team Size for Projects</Label>
                  <Select
                    value={onboardingData.capabilities.teamSize}
                    onValueChange={(value) => setOnboardingData(prev => ({
                      ...prev,
                      capabilities: { ...prev.capabilities, teamSize: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('forms.selectTeamSize')} />
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
                    value={onboardingData.capabilities.experience}
                    onChange={(e) => setOnboardingData(prev => ({
                      ...prev,
                      capabilities: { ...prev.capabilities, experience: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label>Company Description</Label>
                <textarea
                  className="w-full min-h-[100px] p-3 border rounded-md"
                  placeholder={t('forms.companyDescription')}
                  value={onboardingData.companyInfo.description}
                  onChange={(e) => setOnboardingData(prev => ({
                    ...prev,
                    companyInfo: { ...prev.companyInfo, description: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Upload className="h-12 w-12 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Verification Documents</h2>
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
                  Commercial Registration uploaded successfully! You can now complete your onboarding.
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
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="text-center">
              <CardTitle className="text-2xl">Vendor Onboarding</CardTitle>
              <CardDescription>
                Step {currentStep} of {totalSteps} - Complete your vendor profile
              </CardDescription>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStep()}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              {t('common.previous')}
            </Button>

            {currentStep === totalSteps ? (
              <Button
                onClick={handleComplete}
                disabled={!crUploaded || loading}
              >
                {loading ? t('common.completing') : t('common.completeOnboarding')}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !onboardingData.businessSize) ||
                  (currentStep === 2 && onboardingData.categories.length === 0) ||
                  (currentStep === 3 && onboardingData.coverageLocations.length === 0)
                }
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
