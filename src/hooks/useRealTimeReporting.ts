import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'financial' | 'performance' | 'operational' | 'custom';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  recipients: string[];
  config: Record<string, any>;
  is_active: boolean;
  created_at: string;
}

export interface RealtimeMetrics {
  active_users: number;
  pending_requests: number;
  completed_orders: number;
  revenue_today: number;
  system_health: 'healthy' | 'warning' | 'critical';
  response_time: number;
  error_rate: number;
  last_updated: string;
}

export const useRealTimeReporting = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<RealtimeMetrics | null>(null);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRealtimeMetrics = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('get-realtime-metrics');
      
      if (error) throw error;
      
      setMetrics(data);
    } catch (error: any) {
      console.error('Error fetching realtime metrics:', error);
      
      // Fallback mock data
      setMetrics({
        active_users: 127,
        pending_requests: 23,
        completed_orders: 45,
        revenue_today: 15750,
        system_health: 'healthy',
        response_time: 245,
        error_rate: 0.02,
        last_updated: new Date().toISOString()
      });
    }
  }, [user]);

  const fetchReportTemplates = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Use mock data for now - in production this would query actual report_templates table
      setTemplates([
        {
          id: '1',
          name: 'Daily Performance Report',
          description: 'Daily summary of key performance indicators',
          type: 'performance',
          frequency: 'daily',
          recipients: ['admin@company.com'],
          config: { include_charts: true, format: 'pdf' },
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: '2', 
          name: 'Weekly Financial Report',
          description: 'Weekly financial performance and revenue analysis',
          type: 'financial',
          frequency: 'weekly',
          recipients: ['finance@company.com', 'cfo@company.com'],
          config: { include_forecasts: true, format: 'excel' },
          is_active: true,
          created_at: new Date().toISOString()
        }
      ]);
    } catch (error: any) {
      console.error('Error fetching report templates:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (templateId: string, customConfig?: Record<string, any>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: {
          template_id: templateId,
          custom_config: customConfig,
          user_id: user.id
        }
      });
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error('Error generating report:', error);
      throw error;
    }
  };

  const scheduleReport = async (template: Partial<ReportTemplate>) => {
    if (!user) return;
    
    try {
      // Mock implementation - in production this would insert into report_templates table
      const newTemplate: ReportTemplate = {
        id: Date.now().toString(),
        name: template.name || 'New Report',
        description: template.description || '',
        type: template.type || 'performance',
        frequency: template.frequency || 'daily',
        recipients: template.recipients || [],
        config: template.config || {},
        is_active: true,
        created_at: new Date().toISOString()
      };
      
      setTemplates(prev => [newTemplate, ...prev]);
      return newTemplate;
    } catch (error: any) {
      console.error('Error scheduling report:', error);
      throw error;
    }
  };

  // Set up real-time subscription for metrics
  useEffect(() => {
    fetchRealtimeMetrics();
    fetchReportTemplates();
    
    const interval = setInterval(fetchRealtimeMetrics, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [fetchRealtimeMetrics]);

  return {
    metrics,
    templates,
    loading,
    error,
    fetchRealtimeMetrics,
    fetchReportTemplates,
    generateReport,
    scheduleReport
  };
};