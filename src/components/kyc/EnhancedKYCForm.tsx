import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { FileText, Building2, CreditCard, MapPin, User, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { uploadDocument } from '@/utils/documentStorage';

interface KYCFormData {
  companyLegalName: string;
  crNumber: string;
  crIssuingDate: string;
  crIssuingCity: string;
  crValidityDate: string;
  crDocumentFile: File | null;
  vatNumber: string;
  vatCertificateFile: File | null;
  addressCity: string;
  addressArea: string;
  addressPostalCode: string;
  addressStreetName: string;
  addressBuildingNumber: string;
  addressUnitNumber: string;
  addressCertificateFile: File | null;
  organizationType: string;
  natureOfBusiness: string;
  signatoryFirstName: string;
  signatoryLastName: string;
  signatoryDesignation: string;
  signatoryEmail: string;
  signatoryPhone: string;
  accountType: 'cash' | 'credit';
  creditCeiling?: number;
  paymentPeriodDays?: number;
  serviceCategories: string[];
}

export const EnhancedKYCForm = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<KYCFormData>({
    companyLegalName: '',
    crNumber: '',
    crIssuingDate: '',
    crIssuingCity: '',
    crValidityDate: '',
    crDocumentFile: null,
    vatNumber: '',
    vatCertificateFile: null,
    addressCity: '',
    addressArea: '',
    addressPostalCode: '',
    addressStreetName: '',
    addressBuildingNumber: '',
    addressUnitNumber: '',
    addressCertificateFile: null,
    organizationType: '',
    natureOfBusiness: '',
    signatoryFirstName: '',
    signatoryLastName: '',
    signatoryDesignation: '',
    signatoryEmail: '',
    signatoryPhone: '',
    accountType: 'cash',
    serviceCategories: []
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const handleFileChange = (field: 'crDocumentFile' | 'vatCertificateFile' | 'addressCertificateFile', file: File | null) => {
    if (file && file.type !== 'application/pdf') {
      toast({
        title: "Invalid File Type",
        description: "Only PDF files are allowed for official documents",
        variant: "destructive"
      });
      return;
    }
    setFormData({ ...formData, [field]: file });
  };

  const handleSubmit = async () => {
    const validationErrors: string[] = [];

    // Comprehensive validation
    if (!formData.companyLegalName) validationErrors.push('Company legal name is required');
    if (!formData.crNumber) validationErrors.push('CR number is required');
    if (!formData.crIssuingDate) validationErrors.push('CR issuing date is required');
    if (!formData.crIssuingCity) validationErrors.push('CR issuing city is required');
    if (!formData.crValidityDate) validationErrors.push('CR validity date is required');
    if (!formData.crDocumentFile) validationErrors.push('CR certificate must be uploaded');
    
    if (new Date(formData.crIssuingDate) > new Date()) {
      validationErrors.push('CR issuing date cannot be in the future');
    }
    if (new Date(formData.crValidityDate) <= new Date()) {
      validationErrors.push('CR validity date must be in the future');
    }

    if (!formData.vatNumber || !/^[0-9]{15}$/.test(formData.vatNumber)) {
      validationErrors.push('VAT number must be exactly 15 digits');
    }
    if (!formData.vatCertificateFile) validationErrors.push('VAT certificate must be uploaded');

    if (!formData.addressCity || !formData.addressArea || !formData.addressPostalCode ||
        !formData.addressStreetName || !formData.addressBuildingNumber) {
      validationErrors.push('All address fields are required');
    }
    if (!formData.addressCertificateFile) validationErrors.push('National Address certificate must be uploaded');

    if (!formData.organizationType) validationErrors.push('Organization type is required');
    if (!formData.natureOfBusiness) validationErrors.push('Nature of business is required');

    if (!formData.signatoryFirstName || !formData.signatoryLastName ||
        !formData.signatoryDesignation || !formData.signatoryEmail || !formData.signatoryPhone) {
      validationErrors.push('All authorized signatory fields are required');
    }

    if (formData.accountType === 'credit') {
      if (!formData.creditCeiling || formData.creditCeiling <= 0) {
        validationErrors.push('Credit ceiling must be greater than 0');
      }
      if (!formData.paymentPeriodDays || formData.paymentPeriodDays <= 0) {
        validationErrors.push('Payment period must be greater than 0');
      }
    }

    if (validationErrors.length > 0) {
      toast({
        title: "Validation Errors",
        description: validationErrors.join('; '),
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get main info from session storage
      const mainInfoStr = sessionStorage.getItem('mainInfoData');
      const mainInfo = mainInfoStr ? JSON.parse(mainInfoStr) : {};

      // Upload documents with detailed error logging - ALL to kyv-documents bucket
      console.log('=== KYC DOCUMENT UPLOAD DEBUG ===');
      console.log('CR File:', formData.crDocumentFile?.name, 'Size:', formData.crDocumentFile?.size);
      const crUpload = await uploadDocument(formData.crDocumentFile!, user.id, 'cr', 'kyv-documents');
      console.log('CR Upload result:', { success: crUpload.success, filePath: crUpload.filePath, error: crUpload.error });
      if (!crUpload.success) {
        console.error('CR upload failed:', crUpload.error);
      }
      
      console.log('VAT File:', formData.vatCertificateFile?.name, 'Size:', formData.vatCertificateFile?.size);
      const vatUpload = await uploadDocument(formData.vatCertificateFile!, user.id, 'vat', 'kyv-documents');
      console.log('VAT Upload result:', { success: vatUpload.success, filePath: vatUpload.filePath, error: vatUpload.error });
      if (!vatUpload.success) {
        console.error('VAT upload failed:', vatUpload.error);
      }
      
      console.log('Address File:', formData.addressCertificateFile?.name, 'Size:', formData.addressCertificateFile?.size);
      const addressUpload = await uploadDocument(formData.addressCertificateFile!, user.id, 'address', 'kyv-documents');
      console.log('Address Upload result:', { success: addressUpload.success, filePath: addressUpload.filePath, error: addressUpload.error });
      if (!addressUpload.success) {
        console.error('Address upload failed:', addressUpload.error);
      }
      console.log('=================================');

      if (!crUpload.success || !vatUpload.success || !addressUpload.success) {
        throw new Error(`Document upload failed: CR=${crUpload.error || 'OK'}, VAT=${vatUpload.error || 'OK'}, Address=${addressUpload.error || 'OK'}`);
      }

      // Insert KYC submission
      const { data: kycData, error: kycError } = await supabase
        .from('kyc_submissions')
        .insert({
          user_id: user.id,
          // Focal contact from main info
          focal_first_name: mainInfo.firstName || '',
          focal_last_name: mainInfo.lastName || '',
          focal_designation: mainInfo.designation || '',
          focal_email: mainInfo.email || '',
          focal_phone: mainInfo.phoneNumber || '',
          focal_phone_verified: true,
          // Company Legal
          company_legal_name: formData.companyLegalName,
          cr_number: formData.crNumber,
          cr_issuing_date: formData.crIssuingDate,
          cr_issuing_city: formData.crIssuingCity,
          cr_validity_date: formData.crValidityDate,
          cr_document_url: `kyv-documents/${crUpload.filePath!}`,
          // Tax
          vat_number: formData.vatNumber,
          vat_certificate_url: `kyv-documents/${vatUpload.filePath!}`,
          // Address
          address_city: formData.addressCity,
          address_area: formData.addressArea,
          address_postal_code: formData.addressPostalCode,
          address_street_name: formData.addressStreetName,
          address_building_number: formData.addressBuildingNumber,
          address_unit_number: formData.addressUnitNumber,
          address_certificate_url: `kyv-documents/${addressUpload.filePath!}`,
          // Organization
          organization_type: formData.organizationType,
          nature_of_business: formData.natureOfBusiness,
          // Signatory
          signatory_first_name: formData.signatoryFirstName,
          signatory_last_name: formData.signatoryLastName,
          signatory_designation: formData.signatoryDesignation,
          signatory_email: formData.signatoryEmail,
          signatory_phone: formData.signatoryPhone,
          // Account
          account_type: formData.accountType,
          credit_ceiling: formData.creditCeiling,
          payment_period_days: formData.paymentPeriodDays,
          service_categories: formData.serviceCategories,
          // Status
          submission_status: 'submitted',
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (kycError) throw kycError;

      // Trigger document validation
      await supabase.functions.invoke('validate-kyc-documents', {
        body: { kycSubmissionId: kycData.id }
      });

      // Clear session storage
      sessionStorage.removeItem('mainInfoData');

      toast({
        title: "Success",
        description: "KYC submission complete! Your documents will be reviewed within 24-48 hours."
      });
      
      onComplete();
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || 'Failed to submit KYC',
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Company & Legal Information
              </CardTitle>
              <CardDescription>Provide your company's official registration details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyLegalName">Company Legal Name (as per CR) *</Label>
                <Input
                  id="companyLegalName"
                  value={formData.companyLegalName}
                  onChange={(e) => setFormData({ ...formData, companyLegalName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crNumber">CR Number *</Label>
                  <Input
                    id="crNumber"
                    value={formData.crNumber}
                    onChange={(e) => setFormData({ ...formData, crNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crIssuingCity">CR Issuing City *</Label>
                  <Input
                    id="crIssuingCity"
                    value={formData.crIssuingCity}
                    onChange={(e) => setFormData({ ...formData, crIssuingCity: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crIssuingDate">CR Issuing Date *</Label>
                  <Input
                    id="crIssuingDate"
                    type="date"
                    value={formData.crIssuingDate}
                    onChange={(e) => setFormData({ ...formData, crIssuingDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crValidityDate">CR Validity/Expiry Date *</Label>
                  <Input
                    id="crValidityDate"
                    type="date"
                    value={formData.crValidityDate}
                    onChange={(e) => setFormData({ ...formData, crValidityDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="crDocument">Upload CR Certificate (PDF only) *</Label>
                <Input
                  id="crDocument"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange('crDocumentFile', e.target.files?.[0] || null)}
                  required
                />
                {formData.crDocumentFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {formData.crDocumentFile.name}
                  </p>
                )}
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Ensure the company name matches exactly with your CR certificate. Any mismatch will delay verification.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Tax Information
              </CardTitle>
              <CardDescription>Provide your VAT registration details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vatNumber">VAT Number (15 digits) *</Label>
                <Input
                  id="vatNumber"
                  value={formData.vatNumber}
                  onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value.replace(/\D/g, '').slice(0, 15) })}
                  placeholder="300000000000003"
                  maxLength={15}
                  required
                />
                <p className="text-xs text-muted-foreground">Enter exactly 15 digits</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vatCertificate">Upload VAT Certificate (PDF only) *</Label>
                <Input
                  id="vatCertificate"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange('vatCertificateFile', e.target.files?.[0] || null)}
                  required
                />
                {formData.vatCertificateFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {formData.vatCertificateFile.name}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                National Address
              </CardTitle>
              <CardDescription>Provide your official national address details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="addressCity">City *</Label>
                  <Input
                    id="addressCity"
                    value={formData.addressCity}
                    onChange={(e) => setFormData({ ...formData, addressCity: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressArea">Area/District *</Label>
                  <Input
                    id="addressArea"
                    value={formData.addressArea}
                    onChange={(e) => setFormData({ ...formData, addressArea: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="addressPostalCode">Postal Code *</Label>
                  <Input
                    id="addressPostalCode"
                    value={formData.addressPostalCode}
                    onChange={(e) => setFormData({ ...formData, addressPostalCode: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressStreetName">Street Name *</Label>
                  <Input
                    id="addressStreetName"
                    value={formData.addressStreetName}
                    onChange={(e) => setFormData({ ...formData, addressStreetName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="addressBuildingNumber">Building Number *</Label>
                  <Input
                    id="addressBuildingNumber"
                    value={formData.addressBuildingNumber}
                    onChange={(e) => setFormData({ ...formData, addressBuildingNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressUnitNumber">Unit Number (Optional)</Label>
                  <Input
                    id="addressUnitNumber"
                    value={formData.addressUnitNumber}
                    onChange={(e) => setFormData({ ...formData, addressUnitNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressCertificate">Upload National Address Certificate (PDF only) *</Label>
                <Input
                  id="addressCertificate"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange('addressCertificateFile', e.target.files?.[0] || null)}
                  required
                />
                {formData.addressCertificateFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {formData.addressCertificateFile.name}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Organization & Authorized Signatory
              </CardTitle>
              <CardDescription>Provide organization details and authorized signatory information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organizationType">Organization Type *</Label>
                  <Select value={formData.organizationType} onValueChange={(value) => setFormData({ ...formData, organizationType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llc">Limited Liability Company</SelectItem>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="natureOfBusiness">Nature of Business *</Label>
                  <Input
                    id="natureOfBusiness"
                    value={formData.natureOfBusiness}
                    onChange={(e) => setFormData({ ...formData, natureOfBusiness: e.target.value })}
                    placeholder="e.g., Trading, Manufacturing, Services"
                    required
                  />
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold mb-4">Authorized Signatory</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signatoryFirstName">First Name *</Label>
                    <Input
                      id="signatoryFirstName"
                      value={formData.signatoryFirstName}
                      onChange={(e) => setFormData({ ...formData, signatoryFirstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signatoryLastName">Last Name *</Label>
                    <Input
                      id="signatoryLastName"
                      value={formData.signatoryLastName}
                      onChange={(e) => setFormData({ ...formData, signatoryLastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="signatoryDesignation">Designation *</Label>
                  <Input
                    id="signatoryDesignation"
                    value={formData.signatoryDesignation}
                    onChange={(e) => setFormData({ ...formData, signatoryDesignation: e.target.value })}
                    placeholder="e.g., CEO, Managing Director"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signatoryEmail">Email *</Label>
                    <Input
                      id="signatoryEmail"
                      type="email"
                      value={formData.signatoryEmail}
                      onChange={(e) => setFormData({ ...formData, signatoryEmail: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signatoryPhone">Phone *</Label>
                    <Input
                      id="signatoryPhone"
                      value={formData.signatoryPhone}
                      onChange={(e) => setFormData({ ...formData, signatoryPhone: e.target.value })}
                      placeholder="+966512345678"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Account Type & Services
              </CardTitle>
              <CardDescription>Select your account type and services needed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type *</Label>
                <Select value={formData.accountType} onValueChange={(value: 'cash' | 'credit') => setFormData({ ...formData, accountType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash Account</SelectItem>
                    <SelectItem value="credit">Credit Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.accountType === 'credit' && (
                <div className="border p-4 rounded-lg space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="creditCeiling">Credit Ceiling (SAR) *</Label>
                      <Input
                        id="creditCeiling"
                        type="number"
                        value={formData.creditCeiling || ''}
                        onChange={(e) => setFormData({ ...formData, creditCeiling: parseFloat(e.target.value) })}
                        min="0"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentPeriodDays">Payment Period (Days) *</Label>
                      <Input
                        id="paymentPeriodDays"
                        type="number"
                        value={formData.paymentPeriodDays || ''}
                        onChange={(e) => setFormData({ ...formData, paymentPeriodDays: parseInt(e.target.value) })}
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Service Categories *</Label>
                <Textarea
                  placeholder="List the service categories you're interested in (comma-separated)"
                  value={formData.serviceCategories.join(', ')}
                  onChange={(e) => setFormData({ ...formData, serviceCategories: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>KYC Submission - Step {currentStep} of {totalSteps}</CardTitle>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
      </Card>

      {renderStep()}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1 || submitting}
        >
          Previous
        </Button>
        {currentStep < totalSteps ? (
          <Button onClick={() => setCurrentStep(currentStep + 1)}>
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit KYC'}
          </Button>
        )}
      </div>
    </div>
  );
};
