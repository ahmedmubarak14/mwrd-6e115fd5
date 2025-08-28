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
      // Fetch real security incidents from database
      const { data: incidents, error } = await supabase
        .from('security_incidents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform to match interface
      const transformedIncidents: SecurityIncident[] = (incidents || []).map(incident => ({
        id: incident.id,
        title: incident.title,
        description: incident.description,
        severity: incident.severity as 'low' | 'medium' | 'high' | 'critical',
        status: incident.status as 'open' | 'investigating' | 'resolved' | 'closed',
        category: incident.category,
        affected_systems: incident.affected_systems,
        reported_by: incident.reported_by,
        created_at: incident.created_at,
        updated_at: incident.updated_at
      }));

      setIncidents(transformedIncidents);
    } catch (error) {
      console.error('Error fetching security incidents:', error);
      // Set empty array on error instead of mock data
      setIncidents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createIncident = async (incidentData: Partial<SecurityIncident>) => {
    try {
      // Create real security incident in database
      const { data, error } = await supabase
        .from('security_incidents')
        .insert({
          title: incidentData.title || '',
          description: incidentData.description || '',
          severity: incidentData.severity || 'medium',
          category: incidentData.category || 'security_breach',
          affected_systems: incidentData.affected_systems,
          reported_by: incidentData.reported_by
        })
        .select()
        .single();

      if (error) throw error;
      await fetchIncidents();
      return data;
    } catch (error) {
      console.error('Error creating security incident:', error);
      throw error;
    }
  };

  const updateIncident = async (incidentId: string, updates: Partial<SecurityIncident>) => {
    try {
      // Update real security incident in database
      const { error } = await supabase
        .from('security_incidents')
        .update({
          ...updates,
          resolved_at: updates.status === 'resolved' ? new Date().toISOString() : null
        })
        .eq('id', incidentId);

      if (error) throw error;
      await fetchIncidents();
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