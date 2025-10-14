import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface KYVFormData {
  // Basic Info
  tradeName?: string;
  numberOfEmployees: string;
  
  // Tax & Legal
  zakatCertificateUrl?: string;
  chamberCommerceCertificateUrl?: string;
  companyLogoUrl?: string;
  
  // Banking Details
  bankName: string;
  accountHolderName: string;
  ibanNumber: string;
  bankBranch?: string;
  bankConfirmationLetterUrl: string;
  
  // Product & Service Details
  productCatalogUrl?: string;
  priceListUrl?: string;
  minimumOrderValue?: number;
  deliverySLADays: number;
  paymentTerms: string;
  
  // Compliance & Certification
  qualityCertificatesUrls?: string[];
  safetyCertificatesUrls?: string[];
  insuranceLicenseUrls?: string[];
  
  // Declaration
  vendorSignatureUrl?: string;
  companyStampUrl?: string;
  declarationAccepted: boolean;
}

export const useKYV = () => {
  const [kyvData, setKYVData] = useState<KYVFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchKYVData = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kyv_submissions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setKYVData({
          tradeName: data.trade_name,
          numberOfEmployees: data.number_of_employees,
          zakatCertificateUrl: data.zakat_certificate_url,
          chamberCommerceCertificateUrl: data.chamber_commerce_certificate_url,
          companyLogoUrl: data.company_logo_url,
          bankName: data.bank_name,
          accountHolderName: data.account_holder_name,
          ibanNumber: data.iban_number,
          bankBranch: data.bank_branch,
          bankConfirmationLetterUrl: data.bank_confirmation_letter_url,
          productCatalogUrl: data.product_catalog_url,
          priceListUrl: data.price_list_url,
          minimumOrderValue: data.minimum_order_value,
          deliverySLADays: data.delivery_sla_days,
          paymentTerms: data.payment_terms,
          qualityCertificatesUrls: data.quality_certificates_urls,
          safetyCertificatesUrls: data.safety_certificates_urls,
          insuranceLicenseUrls: data.insurance_license_urls,
          vendorSignatureUrl: data.vendor_signature_url,
          companyStampUrl: data.company_stamp_url,
          declarationAccepted: data.declaration_accepted,
        });
      }

      return data;
    } catch (error) {
      console.error('Error fetching KYV data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch vendor verification data',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const submitKYV = async (formData: KYVFormData, userId: string) => {
    try {
      setLoading(true);

      const submissionData = {
        user_id: userId,
        trade_name: formData.tradeName,
        number_of_employees: formData.numberOfEmployees,
        zakat_certificate_url: formData.zakatCertificateUrl,
        chamber_commerce_certificate_url: formData.chamberCommerceCertificateUrl,
        company_logo_url: formData.companyLogoUrl,
        bank_name: formData.bankName,
        account_holder_name: formData.accountHolderName,
        iban_number: formData.ibanNumber,
        bank_branch: formData.bankBranch,
        bank_confirmation_letter_url: formData.bankConfirmationLetterUrl,
        product_catalog_url: formData.productCatalogUrl,
        price_list_url: formData.priceListUrl,
        minimum_order_value: formData.minimumOrderValue,
        delivery_sla_days: formData.deliverySLADays,
        payment_terms: formData.paymentTerms,
        quality_certificates_urls: formData.qualityCertificatesUrls,
        safety_certificates_urls: formData.safetyCertificatesUrls,
        insurance_license_urls: formData.insuranceLicenseUrls,
        vendor_signature_url: formData.vendorSignatureUrl,
        company_stamp_url: formData.companyStampUrl,
        declaration_accepted: formData.declarationAccepted,
        declaration_date: new Date().toISOString(),
        submission_status: 'submitted',
        submitted_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('kyv_submissions')
        .insert([submissionData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Vendor verification submitted successfully',
      });

      return data;
    } catch (error) {
      console.error('Error submitting KYV:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit vendor verification',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateKYV = async (updates: Partial<KYVFormData>, userId: string) => {
    try {
      setLoading(true);

      const updateData: any = {};
      if (updates.tradeName !== undefined) updateData.trade_name = updates.tradeName;
      if (updates.numberOfEmployees !== undefined) updateData.number_of_employees = updates.numberOfEmployees;
      if (updates.bankName !== undefined) updateData.bank_name = updates.bankName;
      if (updates.accountHolderName !== undefined) updateData.account_holder_name = updates.accountHolderName;
      if (updates.ibanNumber !== undefined) updateData.iban_number = updates.ibanNumber;
      if (updates.deliverySLADays !== undefined) updateData.delivery_sla_days = updates.deliverySLADays;
      if (updates.paymentTerms !== undefined) updateData.payment_terms = updates.paymentTerms;

      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('kyv_submissions')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Vendor verification updated successfully',
      });

      return data;
    } catch (error) {
      console.error('Error updating KYV:', error);
      toast({
        title: 'Error',
        description: 'Failed to update vendor verification',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { kyvData, loading, fetchKYVData, submitKYV, updateKYV };
};
