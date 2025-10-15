-- Migration to normalize existing KYC/KYV document URLs to kyv-documents bucket format
-- This fixes historical data that was stored in wrong buckets or with wrong URL formats

-- Update KYC submissions: Normalize document URLs to bucket-prefixed relative paths
UPDATE kyc_submissions
SET 
  cr_document_url = CASE 
    -- If already has kyv-documents prefix, keep as-is
    WHEN cr_document_url LIKE 'kyv-documents/%' THEN cr_document_url
    -- If it's a full HTTP URL, extract relative path and add kyv-documents prefix
    WHEN cr_document_url LIKE 'http%' THEN 
      'kyv-documents/' || regexp_replace(cr_document_url, '^https?://[^/]+/storage/v1/object/(public|sign)/[^/]+/', '')
    -- If it's a relative path without bucket prefix, add kyv-documents prefix
    ELSE 'kyv-documents/' || cr_document_url
  END,
  vat_certificate_url = CASE 
    WHEN vat_certificate_url LIKE 'kyv-documents/%' THEN vat_certificate_url
    WHEN vat_certificate_url LIKE 'http%' THEN 
      'kyv-documents/' || regexp_replace(vat_certificate_url, '^https?://[^/]+/storage/v1/object/(public|sign)/[^/]+/', '')
    ELSE 'kyv-documents/' || vat_certificate_url
  END,
  address_certificate_url = CASE 
    WHEN address_certificate_url LIKE 'kyv-documents/%' THEN address_certificate_url
    WHEN address_certificate_url LIKE 'http%' THEN 
      'kyv-documents/' || regexp_replace(address_certificate_url, '^https?://[^/]+/storage/v1/object/(public|sign)/[^/]+/', '')
    ELSE 'kyv-documents/' || address_certificate_url
  END,
  updated_at = NOW()
WHERE submission_status IN ('submitted', 'under_review', 'approved', 'rejected');

-- Update KYV submissions: Normalize all document URLs
UPDATE kyv_submissions
SET 
  bank_confirmation_letter_url = CASE 
    WHEN bank_confirmation_letter_url LIKE 'kyv-documents/%' THEN bank_confirmation_letter_url
    WHEN bank_confirmation_letter_url LIKE 'http%' THEN 
      'kyv-documents/' || regexp_replace(bank_confirmation_letter_url, '^https?://[^/]+/storage/v1/object/(public|sign)/[^/]+/', '')
    WHEN bank_confirmation_letter_url IS NOT NULL THEN 'kyv-documents/' || bank_confirmation_letter_url
    ELSE bank_confirmation_letter_url
  END,
  zakat_certificate_url = CASE 
    WHEN zakat_certificate_url LIKE 'kyv-documents/%' THEN zakat_certificate_url
    WHEN zakat_certificate_url LIKE 'http%' THEN 
      'kyv-documents/' || regexp_replace(zakat_certificate_url, '^https?://[^/]+/storage/v1/object/(public|sign)/[^/]+/', '')
    WHEN zakat_certificate_url IS NOT NULL THEN 'kyv-documents/' || zakat_certificate_url
    ELSE zakat_certificate_url
  END,
  chamber_commerce_certificate_url = CASE 
    WHEN chamber_commerce_certificate_url LIKE 'kyv-documents/%' THEN chamber_commerce_certificate_url
    WHEN chamber_commerce_certificate_url LIKE 'http%' THEN 
      'kyv-documents/' || regexp_replace(chamber_commerce_certificate_url, '^https?://[^/]+/storage/v1/object/(public|sign)/[^/]+/', '')
    WHEN chamber_commerce_certificate_url IS NOT NULL THEN 'kyv-documents/' || chamber_commerce_certificate_url
    ELSE chamber_commerce_certificate_url
  END,
  company_logo_url = CASE 
    WHEN company_logo_url LIKE 'kyv-documents/%' THEN company_logo_url
    WHEN company_logo_url LIKE 'http%' THEN 
      'kyv-documents/' || regexp_replace(company_logo_url, '^https?://[^/]+/storage/v1/object/(public|sign)/[^/]+/', '')
    WHEN company_logo_url IS NOT NULL THEN 'kyv-documents/' || company_logo_url
    ELSE company_logo_url
  END,
  product_catalog_url = CASE 
    WHEN product_catalog_url LIKE 'kyv-documents/%' THEN product_catalog_url
    WHEN product_catalog_url LIKE 'http%' THEN 
      'kyv-documents/' || regexp_replace(product_catalog_url, '^https?://[^/]+/storage/v1/object/(public|sign)/[^/]+/', '')
    WHEN product_catalog_url IS NOT NULL THEN 'kyv-documents/' || product_catalog_url
    ELSE product_catalog_url
  END,
  price_list_url = CASE 
    WHEN price_list_url LIKE 'kyv-documents/%' THEN price_list_url
    WHEN price_list_url LIKE 'http%' THEN 
      'kyv-documents/' || regexp_replace(price_list_url, '^https?://[^/]+/storage/v1/object/(public|sign)/[^/]+/', '')
    WHEN price_list_url IS NOT NULL THEN 'kyv-documents/' || price_list_url
    ELSE price_list_url
  END,
  vendor_signature_url = CASE 
    WHEN vendor_signature_url LIKE 'kyv-documents/%' THEN vendor_signature_url
    WHEN vendor_signature_url LIKE 'http%' THEN 
      'kyv-documents/' || regexp_replace(vendor_signature_url, '^https?://[^/]+/storage/v1/object/(public|sign)/[^/]+/', '')
    WHEN vendor_signature_url IS NOT NULL THEN 'kyv-documents/' || vendor_signature_url
    ELSE vendor_signature_url
  END,
  company_stamp_url = CASE 
    WHEN company_stamp_url LIKE 'kyv-documents/%' THEN company_stamp_url
    WHEN company_stamp_url LIKE 'http%' THEN 
      'kyv-documents/' || regexp_replace(company_stamp_url, '^https?://[^/]+/storage/v1/object/(public|sign)/[^/]+/', '')
    WHEN company_stamp_url IS NOT NULL THEN 'kyv-documents/' || company_stamp_url
    ELSE company_stamp_url
  END,
  updated_at = NOW()
WHERE submission_status IN ('submitted', 'under_review', 'approved', 'rejected');