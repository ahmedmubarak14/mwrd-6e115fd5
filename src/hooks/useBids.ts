import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Bid {
  id: string;
  rfq_id: string;
  vendor_id: string;
  total_price: number;
  currency: string;
  delivery_timeline_days: number;
  proposal: string;
  technical_specifications?: any;
  warranty_period_months?: number;
  payment_terms?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'withdrawn';
  submitted_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBidData {
  rfq_id: string;
  total_price: number;
  currency?: string;
  delivery_timeline_days: number;
  proposal: string;
  technical_specifications?: any;
  warranty_period_months?: number;
  payment_terms?: string;
}

export const useBids = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchBids = async (rfqId?: string) => {
    if (!user) return;

    try {
      setLoading(true);
      let query = (supabase as any)
        .from('bids')
        .select('*')
        .order('created_at', { ascending: false });

      if (rfqId) {
        query = query.eq('rfq_id', rfqId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching bids:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch bids',
          variant: 'destructive'
        });
        return;
      }

      setBids((data as Bid[]) || []);
    } catch (error) {
      console.error('Error in fetchBids:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createBid = async (bidData: CreateBidData): Promise<Bid | null> => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a bid',
        variant: 'destructive'
      });
      return null;
    }

    try {
      // Check if user already has a bid for this RFQ
      const { data: existingBids } = await (supabase as any)
        .from('bids')
        .select('id')
        .eq('rfq_id', bidData.rfq_id)
        .eq('vendor_id', user.id);

      if (existingBids && existingBids.length > 0) {
        toast({
          title: 'Error',
          description: 'You have already submitted a bid for this RFQ',
          variant: 'destructive'
        });
        return null;
      }

      const { data, error } = await (supabase as any)
        .from('bids')
        .insert([{
          rfq_id: bidData.rfq_id,
          vendor_id: user.id,
          total_price: bidData.total_price,
          currency: bidData.currency || 'SAR',
          delivery_timeline_days: bidData.delivery_timeline_days,
          proposal: bidData.proposal,
          technical_specifications: bidData.technical_specifications || {},
          warranty_period_months: bidData.warranty_period_months,
          payment_terms: bidData.payment_terms,
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating bid:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to create bid',
          variant: 'destructive'
        });
        return null;
      }

      toast({
        title: 'Success',
        description: 'Bid submitted successfully',
      });

      // Refresh the bids list
      fetchBids();
      
      return data as Bid;
    } catch (error) {
      console.error('Error in createBid:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while creating the bid',
        variant: 'destructive'
      });
      return null;
    }
  };

  const updateBid = async (id: string, updates: Partial<CreateBidData>): Promise<boolean> => {
    try {
      const { error } = await (supabase as any)
        .from('bids')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating bid:', error);
        toast({
          title: 'Error',
          description: 'Failed to update bid',
          variant: 'destructive'
        });
        return false;
      }

      toast({
        title: 'Success',
        description: 'Bid updated successfully',
      });

      // Refresh the bids list
      fetchBids();
      return true;
    } catch (error) {
      console.error('Error in updateBid:', error);
      return false;
    }
  };

  const withdrawBid = async (id: string): Promise<boolean> => {
    try {
      const { error } = await (supabase as any)
        .from('bids')
        .update({
          status: 'withdrawn',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error withdrawing bid:', error);
        toast({
          title: 'Error',
          description: 'Failed to withdraw bid',
          variant: 'destructive'
        });
        return false;
      }

      toast({
        title: 'Success',
        description: 'Bid withdrawn successfully',
      });

      // Refresh the bids list
      fetchBids();
      return true;
    } catch (error) {
      console.error('Error in withdrawBid:', error);
      return false;
    }
  };

  const getBidsByRFQ = async (rfqId: string): Promise<Bid[]> => {
    try {
      const { data, error } = await (supabase as any)
        .from('bids')
        .select('*')
        .eq('rfq_id', rfqId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bids for RFQ:', error);
        return [];
      }

      return (data as Bid[]) || [];
    } catch (error) {
      console.error('Error in getBidsByRFQ:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchBids();
  }, [user]);

  return {
    bids,
    loading,
    createBid,
    updateBid,
    withdrawBid,
    getBidsByRFQ,
    refreshBids: fetchBids
  };
};