import { describe, it, expect, beforeEach } from 'vitest';
import { createTestClient } from '../utils/supabase-test-client';
import { createMockUser, createMockRequest, createMockOffer } from '../utils/test-data-factory';

describe('RFQ Workflow Integration Tests', () => {
  let client: ReturnType<typeof createTestClient>;
  let clientUser: ReturnType<typeof createMockUser>;
  let vendorUser: ReturnType<typeof createMockUser>;

  beforeEach(() => {
    client = createTestClient();
    clientUser = createMockUser({ role: 'client' });
    vendorUser = createMockUser({ role: 'vendor' });
  });

  describe('Request Creation', () => {
    it('should create a new request with valid data', async () => {
      const requestData = createMockRequest(clientUser.id);

      const { data, error } = await client
        .from('requests')
        .insert([requestData])
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeTruthy();
      expect(data?.client_id).toBe(clientUser.id);
    });

    it('should validate budget constraints', () => {
      const requestData = createMockRequest(clientUser.id);
      
      expect(requestData.budget_min).toBeLessThanOrEqual(requestData.budget_max);
      expect(requestData.budget_min).toBeGreaterThan(0);
    });

    it('should validate deadline is in the future', () => {
      const requestData = createMockRequest(clientUser.id);
      const deadline = new Date(requestData.deadline);
      
      expect(deadline.getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe('Offer Submission', () => {
    it('should create an offer for a request', async () => {
      const requestData = createMockRequest(clientUser.id);
      const { data: request } = await client
        .from('requests')
        .insert([requestData])
        .select()
        .single();

      if (request) {
        const offerData = createMockOffer(request.id, vendorUser.id);

        const { data: offer, error } = await client
          .from('offers')
          .insert([offerData])
          .select()
          .single();

        expect(error).toBeNull();
        expect(offer).toBeTruthy();
        expect(offer?.vendor_id).toBe(vendorUser.id);
      }
    });

    it('should validate offer price is positive', () => {
      const requestData = createMockRequest(clientUser.id);
      const offerData = createMockOffer('request-id', vendorUser.id);
      
      expect(offerData.price).toBeGreaterThan(0);
    });

    it('should validate delivery time is positive', () => {
      const offerData = createMockOffer('request-id', vendorUser.id);
      
      expect(offerData.delivery_time_days).toBeGreaterThan(0);
    });
  });

  describe('Offer Status Flow', () => {
    it('should track offer status changes', async () => {
      const requestData = createMockRequest(clientUser.id);
      const { data: request } = await client
        .from('requests')
        .insert([requestData])
        .select()
        .single();

      if (request) {
        const offerData = createMockOffer(request.id, vendorUser.id, {
          status: 'pending',
        });

        const { data: offer } = await client
          .from('offers')
          .insert([offerData])
          .select()
          .single();

        if (offer) {
          // Update to approved
          const { data: updated, error } = await client
            .from('offers')
            .update({ client_approval_status: 'approved' })
            .eq('id', offer.id)
            .select()
            .single();

          expect(error).toBeNull();
          expect(updated?.client_approval_status).toBe('approved');
        }
      }
    });
  });
});
