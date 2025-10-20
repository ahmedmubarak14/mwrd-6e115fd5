import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useKYV, KYVFormData } from '@/hooks/useKYV';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { KYVBasicInfo } from './KYVBasicInfo';
import { KYVBankingDetails } from './KYVBankingDetails';
import { KYVProductDetails } from './KYVProductDetails';
import { KYVCompliance } from './KYVCompliance';
import { KYVDeclaration } from './KYVDeclaration';
import { useLanguage } from '@/contexts/LanguageContext';

interface EnhancedKYVFormProps {
  onComplete?: () => void;
}

export const EnhancedKYVForm: React.FC<EnhancedKYVFormProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { uploadFile } = useFileUpload();
  const { submitKYV, loading } = useKYV();
  const { t } = useLanguage();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<KYVFormData>({
    numberOfEmployees: '',
    bankName: '',
    accountHolderName: '',
    ibanNumber: '',
    bankConfirmationLetterUrl: '',
    deliverySLADays: 7,
    paymentTerms: '',
    declarationAccepted: false,
  });

  const totalSteps = 6;

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (field: string, file: File | File[]) => {
    try {
      if (Array.isArray(file)) {
        // Multiple files - upload to kyv-documents bucket
        const uploadPromises = file.map((f) => uploadFile(f, 'kyv-documents'));
        const results = await Promise.all(uploadPromises);
        const urls = results.filter((r) => r?.url).map((r) => r!.url);
        
        if (field === 'qualityCertificates') {
          handleChange('qualityCertificatesUrls', urls);
        } else if (field === 'safetyCertificates') {
          handleChange('safetyCertificatesUrls', urls);
        } else if (field === 'insuranceLicenses') {
          handleChange('insuranceLicenseUrls', urls);
        }
      } else {
        // Single file - upload to kyv-documents bucket
        const result = await uploadFile(file, 'kyv-documents');
        if (result?.url) {
          const fieldMap: Record<string, string> = {
            zakatCertificate: 'zakatCertificateUrl',
            chamberCommerceCertificate: 'chamberCommerceCertificateUrl',
            companyLogo: 'companyLogoUrl',
            bankConfirmationLetter: 'bankConfirmationLetterUrl',
            productCatalog: 'productCatalogUrl',
            priceList: 'priceListUrl',
            vendorSignature: 'vendorSignatureUrl',
            companyStamp: 'companyStampUrl',
          };
          
          const targetField = fieldMap[field] || field;
          handleChange(targetField, result.url);
          
          toast({
            title: t('kyv.fileUploaded'),
            description: t('kyv.fileUploadedDesc').replace('{fileName}', file.name),
          });
        }
      }
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: t('kyv.uploadFailed'),
        description: t('kyv.uploadFailedDesc'),
        variant: 'destructive',
      });
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.numberOfEmployees;
      case 2:
        return !!(
          formData.bankName &&
          formData.accountHolderName &&
          formData.ibanNumber &&
          formData.bankConfirmationLetterUrl &&
          /^SA[0-9]{22}$/.test(formData.ibanNumber)
        );
      case 3:
        return !!(formData.deliverySLADays && formData.paymentTerms);
      case 4:
        return true; // Optional certificates
      case 5:
        return !!(
          formData.declarationAccepted &&
          formData.vendorSignatureUrl &&
          formData.companyStampUrl
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: 'Incomplete information',
        description: 'Please fill in all required fields before continuing',
        variant: 'destructive',
      });
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!user || !validateStep(5)) {
      toast({
        title: 'Cannot submit',
        description: 'Please complete all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      await submitKYV(formData, user.id);
      setCurrentStep(6); // Success step
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <KYVBasicInfo formData={formData} onChange={handleChange} onFileUpload={handleFileUpload} />;
      case 2:
        return <KYVBankingDetails formData={formData} onChange={handleChange} onFileUpload={handleFileUpload} />;
      case 3:
        return <KYVProductDetails formData={formData} onChange={handleChange} onFileUpload={handleFileUpload} />;
      case 4:
        return <KYVCompliance onFileUpload={handleFileUpload} />;
      case 5:
        return <KYVDeclaration formData={formData} onChange={handleChange} onFileUpload={handleFileUpload} />;
      case 6:
        return (
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-center">Vendor Verification Submitted!</CardTitle>
              <CardDescription className="text-center">
                Your vendor verification has been submitted successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Our team will review your submission and get back to you within 3-5 business days.
                You will receive an email notification once your verification status is updated.
              </p>
              <Button onClick={onComplete || (() => navigate('/vendor/dashboard'))}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  const stepTitles = [
    'Basic Information',
    'Banking Details',
    'Products & Services',
    'Compliance',
    'Declaration',
    'Complete',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Vendor Verification (KYV)</h1>
        <p className="text-muted-foreground">
          Complete your vendor profile to start receiving opportunities
        </p>
      </div>

      {currentStep < 6 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep} of {totalSteps - 1}</span>
            <span>{stepTitles[currentStep - 1]}</span>
          </div>
          <Progress value={(currentStep / (totalSteps - 1)) * 100} />
        </div>
      )}

      {renderStep()}

      {currentStep < 6 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep < 5 ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Verification'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
