import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values?: any;
  new_values?: any;
  created_at: string;
}

export const useAuditTrail = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching audit logs:', error);
        return;
      }

      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportAuditLog = async (filters?: {
    startDate?: string;
    endDate?: string;
    action?: string;
    entityType?: string;
  }) => {
    try {
      let query = supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate);
      }
      if (filters?.action) {
        query = query.eq('action', filters.action);
      }
      if (filters?.entityType) {
        query = query.eq('entity_type', filters.entityType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error exporting audit logs:', error);
        throw error;
      }

      // Create CSV content
      const headers = ['Timestamp', 'User ID', 'Action', 'Entity Type', 'Entity ID', 'Details'];
      const csvContent = [
        headers.join(','),
        ...(data || []).map(log => [
          new Date(log.created_at).toISOString(),
          log.user_id || 'System',
          log.action,
          log.entity_type,
          log.entity_id,
          `"${JSON.stringify({ old: log.old_values, new: log.new_values }).replace(/"/g, '""')}"`
        ].join(','))
      ].join('\n');

      // Download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `audit_log_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

    } catch (error) {
      console.error('Error exporting audit logs:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchAuditLogs();

    // Set up real-time subscription for audit logs
    const setupRealtimeSubscription = async () => {
      try {
        const channel = supabase
          .channel('audit_log_changes')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'audit_log'
            },
            (payload) => {
              setAuditLogs(prev => [payload.new as AuditLog, ...prev.slice(0, 99)]);
            }
          )
          .subscribe((status, error) => {
            if (error) {
              console.error('Audit log realtime subscription error:', error);
              console.log('Audit log realtime disabled - app will work without live updates');
            } else {
              console.log('Audit log realtime subscription status:', status);
            }
          });

        return () => {
          try {
            supabase.removeChannel(channel);
          } catch (cleanupError) {
            console.warn('Error cleaning up audit log realtime channel:', cleanupError);
          }
        };
      } catch (error) {
        console.error('Failed to setup audit log realtime subscription:', error);
        return () => {}; // Return empty cleanup function
      }
    };

    const cleanup = setupRealtimeSubscription();
    
    return () => {
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then(cleanupFn => cleanupFn && cleanupFn());
      }
    };
  }, []);

  return {
    auditLogs,
    isLoading,
    exportAuditLog,
    refreshAuditLogs: fetchAuditLogs
  };
};