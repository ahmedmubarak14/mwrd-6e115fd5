import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { kycSubmissionId } = await req.json();

    console.log('Validating KYC documents for submission:', kycSubmissionId);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch KYC submission
    const { data: kyc, error: kycError } = await supabaseClient
      .from('kyc_submissions')
      .select('*')
      .eq('id', kycSubmissionId)
      .single();

    if (kycError || !kyc) {
      console.error('KYC fetch error:', kycError);
      throw new Error('KYC submission not found');
    }

    console.log('KYC submission found for user:', kyc.user_id);

    const validationResults = {
      cr_document: { valid: false, issues: [] as string[] },
      vat_certificate: { valid: false, issues: [] as string[] },
      address_certificate: { valid: false, issues: [] as string[] },
      overall_valid: false
    };

    // Validate CR Document
    try {
      // TODO: Integrate OCR API (e.g., Google Vision, AWS Textract, Azure Computer Vision)
      // For now, basic file existence check
      const { data: crFile, error: crFileError } = await supabaseClient.storage
        .from('chat-files')
        .download(kyc.cr_document_url);

      if (crFileError || !crFile) {
        console.error('CR file error:', crFileError);
        validationResults.cr_document.issues.push('CR document file not found or inaccessible');
      } else {
        console.log('CR document validated');
        validationResults.cr_document.valid = true;
        // TODO: OCR validation - extract text, match company name, CR number, dates
      }
    } catch (error) {
      console.error('CR validation error:', error);
      validationResults.cr_document.issues.push(`CR validation error: ${error.message}`);
    }

    // Validate VAT Certificate
    try {
      const { data: vatFile, error: vatFileError } = await supabaseClient.storage
        .from('chat-files')
        .download(kyc.vat_certificate_url);

      if (vatFileError || !vatFile) {
        console.error('VAT file error:', vatFileError);
        validationResults.vat_certificate.issues.push('VAT certificate not found');
      } else {
        console.log('VAT certificate validated');
        validationResults.vat_certificate.valid = true;
        // TODO: OCR - extract VAT number, match with submitted value
      }
    } catch (error) {
      console.error('VAT validation error:', error);
      validationResults.vat_certificate.issues.push(`VAT validation error: ${error.message}`);
    }

    // Validate National Address Certificate
    try {
      const { data: addressFile, error: addressFileError } = await supabaseClient.storage
        .from('chat-files')
        .download(kyc.address_certificate_url);

      if (addressFileError || !addressFile) {
        console.error('Address file error:', addressFileError);
        validationResults.address_certificate.issues.push('Address certificate not found');
      } else {
        console.log('Address certificate validated');
        validationResults.address_certificate.valid = true;
        // TODO: OCR - extract address components
      }
    } catch (error) {
      console.error('Address validation error:', error);
      validationResults.address_certificate.issues.push(`Address validation error: ${error.message}`);
    }

    // Overall validation
    validationResults.overall_valid = 
      validationResults.cr_document.valid &&
      validationResults.vat_certificate.valid &&
      validationResults.address_certificate.valid;

    console.log('Validation results:', validationResults);

    // Update KYC submission with validation results
    await supabaseClient
      .from('kyc_submissions')
      .update({
        submission_status: validationResults.overall_valid ? 'under_review' : 'draft',
        updated_at: new Date().toISOString()
      })
      .eq('id', kycSubmissionId);

    console.log('KYC submission status updated');

    return new Response(
      JSON.stringify({ 
        success: true, 
        validationResults
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in validate-kyc-documents:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
