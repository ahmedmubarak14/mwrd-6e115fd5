import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface ApprovalResult {
  success: boolean;
  message: string;
  error?: string;
}

export const useApprovalWorkflow = () => {
  const { toast } = useToast();
  const { isRTL, t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);

  /**
   * Submit a request for internal approval
   */
  const submitForApproval = useCallback(async (
    requestId: string,
    approverId?: string
  ): Promise<ApprovalResult> => {
    setSubmitting(true);
    try {
      const { data, error } = await supabase.rpc('submit_request_for_internal_approval', {
        p_request_id: requestId,
        p_approver_id: approverId || null,
      });

      if (error) throw error;

      const result = data as ApprovalResult;

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit for approval');
      }

      toast({
        title: t('approval.submitted'),
        description: result.message,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit for approval';

      toast({
        title: t('common.error'),
        description: errorMessage,
        variant: 'destructive',
      });

      return {
        success: false,
        message: '',
        error: errorMessage,
      };
    } finally {
      setSubmitting(false);
    }
  }, [toast, isRTL, t]);

  /**
   * Approve a request
   */
  const approveRequest = useCallback(async (
    requestId: string,
    notes?: string
  ): Promise<ApprovalResult> => {
    setSubmitting(true);
    try {
      const { data, error } = await supabase.rpc('approve_internal_request', {
        p_request_id: requestId,
        p_notes: notes || null,
      });

      if (error) throw error;

      const result = data as ApprovalResult;

      if (!result.success) {
        throw new Error(result.error || 'Failed to approve request');
      }

      toast({
        title: t('approval.approved'),
        description: result.message,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to approve request';

      toast({
        title: t('common.error'),
        description: errorMessage,
        variant: 'destructive',
      });

      return {
        success: false,
        message: '',
        error: errorMessage,
      };
    } finally {
      setSubmitting(false);
    }
  }, [toast, isRTL, t]);

  /**
   * Reject a request
   */
  const rejectRequest = useCallback(async (
    requestId: string,
    notes: string
  ): Promise<ApprovalResult> => {
    if (!notes || !notes.trim()) {
      toast({
        title: t('common.error'),
        description: t('approval.rejectionReasonRequired'),
        variant: 'destructive',
      });
      return {
        success: false,
        message: '',
        error: 'Rejection reason is required',
      };
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.rpc('reject_internal_request', {
        p_request_id: requestId,
        p_notes: notes,
      });

      if (error) throw error;

      const result = data as ApprovalResult;

      if (!result.success) {
        throw new Error(result.error || 'Failed to reject request');
      }

      toast({
        title: t('approval.rejected'),
        description: result.message,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reject request';

      toast({
        title: t('common.error'),
        description: errorMessage,
        variant: 'destructive',
      });

      return {
        success: false,
        message: '',
        error: errorMessage,
      };
    } finally {
      setSubmitting(false);
    }
  }, [toast, isRTL, t]);

  /**
   * Request changes to a request
   */
  const requestChanges = useCallback(async (
    requestId: string,
    notes: string
  ): Promise<ApprovalResult> => {
    if (!notes || !notes.trim()) {
      toast({
        title: t('common.error'),
        description: t('approval.changeDetailsRequired'),
        variant: 'destructive',
      });
      return {
        success: false,
        message: '',
        error: 'Change details are required',
      };
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.rpc('request_changes_internal_request', {
        p_request_id: requestId,
        p_notes: notes,
      });

      if (error) throw error;

      const result = data as ApprovalResult;

      if (!result.success) {
        throw new Error(result.error || 'Failed to request changes');
      }

      toast({
        title: t('approval.changesRequested'),
        description: result.message,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to request changes';

      toast({
        title: t('common.error'),
        description: errorMessage,
        variant: 'destructive',
      });

      return {
        success: false,
        message: '',
        error: errorMessage,
      };
    } finally {
      setSubmitting(false);
    }
  }, [toast, isRTL, t]);

  /**
   * Get pending approvals for the current user
   */
  const getPendingApprovals = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_pending_approvals_for_user', {
        p_user_id: userId,
      });

      if (error) throw error;

      return {
        success: true,
        data: data || [],
      };
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch pending approvals',
      };
    }
  }, []);

  /**
   * Get approval history for a request
   */
  const getApprovalHistory = useCallback(async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from('request_approval_history')
        .select(`
          *,
          actor:user_profiles!request_approval_history_actor_id_fkey(full_name)
        `)
        .eq('request_id', requestId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const historyWithNames = data?.map((item: any) => ({
        ...item,
        actor_name: item.actor?.full_name || 'Unknown User',
      })) || [];

      return {
        success: true,
        data: historyWithNames,
      };
    } catch (error) {
      console.error('Error fetching approval history:', error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch approval history',
      };
    }
  }, []);

  /**
   * Check if a request can be submitted for approval
   */
  const canSubmitForApproval = useCallback((requestStatus: string) => {
    return requestStatus === 'draft';
  }, []);

  /**
   * Check if a request needs approval
   */
  const needsApproval = useCallback((internalApprovalStatus: string) => {
    return internalApprovalStatus === 'pending' || internalApprovalStatus === 'changes_requested';
  }, []);

  return {
    submitForApproval,
    approveRequest,
    rejectRequest,
    requestChanges,
    getPendingApprovals,
    getApprovalHistory,
    canSubmitForApproval,
    needsApproval,
    submitting,
  };
};
