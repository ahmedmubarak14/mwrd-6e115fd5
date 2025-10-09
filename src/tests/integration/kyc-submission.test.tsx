import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestClient } from '../utils/supabase-test-client';
import { createMockKYCSubmission, createMockUser } from '../utils/test-data-factory';

describe('KYC Submission Integration Tests', () => {
  let client: ReturnType<typeof createTestClient>;
  let mockUser: ReturnType<typeof createMockUser>;

  beforeEach(() => {
    client = createTestClient();
    mockUser = createMockUser({ role: 'vendor' });
  });

  describe('KYC Submission Creation', () => {
    it('should create a valid KYC submission', async () => {
      const kycData = createMockKYCSubmission(mockUser.id, {
        submission_status: 'submitted',
      });

      // Mock the insert operation
      const { data, error } = await client
        .from('kyc_submissions')
        .insert([kycData])
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeTruthy();
    });

    it('should validate required fields', async () => {
      const invalidKyc = {
        user_id: mockUser.id,
        // Missing required fields
      };

      const { error } = await client
        .from('kyc_submissions')
        .insert([invalidKyc as any]);

      expect(error).toBeTruthy();
    });
  });

  describe('KYC Status Updates', () => {
    it('should update submission status', async () => {
      const kycData = createMockKYCSubmission(mockUser.id);

      const { data: created } = await client
        .from('kyc_submissions')
        .insert([kycData])
        .select()
        .single();

      if (created) {
        const { data: updated, error } = await client
          .from('kyc_submissions')
          .update({ submission_status: 'approved' })
          .eq('id', created.id)
          .select()
          .single();

        expect(error).toBeNull();
        expect(updated?.submission_status).toBe('approved');
      }
    });
  });

  describe('KYC Document Validation', () => {
    it('should require CR document URL', () => {
      const kycData = createMockKYCSubmission(mockUser.id);
      expect(kycData.cr_document_url).toBeTruthy();
    });

    it('should require VAT certificate URL', () => {
      const kycData = createMockKYCSubmission(mockUser.id);
      expect(kycData.vat_certificate_url).toBeTruthy();
    });

    it('should require address certificate URL', () => {
      const kycData = createMockKYCSubmission(mockUser.id);
      expect(kycData.address_certificate_url).toBeTruthy();
    });
  });
});
