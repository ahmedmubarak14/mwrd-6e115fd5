import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  category: string;
  affected_systems?: string;
  reported_by?: string;
  created_at: string;
  updated_at: string;
}

export const useSecurityIncidents = () => {
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchIncidents = async () => {
    try {
      // Mock security incidents data
      const mockIncidents: SecurityIncident[] = [
        {
          id: '1',
          title: 'Unusual Login Pattern Detected',
          description: 'Multiple failed login attempts from various IP addresses targeting admin accounts',
          severity: 'high',
          status: 'investigating',
          category: 'unauthorized_access',
          affected_systems: 'Authentication Service',
          reported_by: 'Security System',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          title: 'Suspicious API Activity',
          description: 'Automated bot behavior detected making rapid API calls',
          severity: 'medium',
          status: 'open',
          category: 'security_breach',
          affected_systems: 'API Gateway',
          reported_by: 'Monitor System',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          title: 'Phishing Email Attempt',
          description: 'Employee reported suspicious email attempting to steal credentials',
          severity: 'medium',
          status: 'resolved',
          category: 'phishing',
          reported_by: 'John Doe',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
        }
      ];

      setIncidents(mockIncidents);
    } catch (error) {
      console.error('Error fetching security incidents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createIncident = async (incidentData: Partial<SecurityIncident>) => {
    try {
      const newIncident: SecurityIncident = {
        id: Math.random().toString(36).substr(2, 9),
        title: incidentData.title || '',
        description: incidentData.description || '',
        severity: incidentData.severity || 'medium',
        status: 'open',
        category: incidentData.category || 'security_breach',
        affected_systems: incidentData.affected_systems,
        reported_by: incidentData.reported_by,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setIncidents(prev => [newIncident, ...prev]);
      return newIncident;
    } catch (error) {
      console.error('Error creating security incident:', error);
      throw error;
    }
  };

  const updateIncident = async (incidentId: string, updates: Partial<SecurityIncident>) => {
    try {
      setIncidents(prev => prev.map(incident => 
        incident.id === incidentId 
          ? { ...incident, ...updates, updated_at: new Date().toISOString() }
          : incident
      ));
    } catch (error) {
      console.error('Error updating security incident:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  return {
    incidents,
    isLoading,
    createIncident,
    updateIncident,
    refreshIncidents: fetchIncidents
  };
};