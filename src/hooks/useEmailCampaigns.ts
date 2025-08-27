import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  template_id: string;
  target_audience: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduled_for?: string;
  sent_at?: string;
  created_at: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignStats {
  total: number;
  sentThisMonth: number;
  openRate: number;
  clickRate: number;
}

export const useEmailCampaigns = () => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaignStats, setCampaignStats] = useState<CampaignStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      // Mock campaigns data
      const mockCampaigns: EmailCampaign[] = [
        {
          id: '1',
          name: 'Monthly Newsletter - June 2024',
          subject: 'Your Monthly Update from MWRD',
          template_id: '1',
          target_audience: 'all_users',
          status: 'sent',
          sent_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          name: 'New Feature Announcement',
          subject: 'Introducing Advanced Analytics Dashboard',
          template_id: '2',
          target_audience: 'clients',
          status: 'scheduled',
          scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          name: 'Vendor Onboarding Series - Part 1',
          subject: 'Welcome to MWRD - Getting Started',
          template_id: '3',
          target_audience: 'vendors',
          status: 'draft',
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      const mockTemplates: EmailTemplate[] = [
        {
          id: '1',
          name: 'Monthly Newsletter Template',
          subject: '{{company_name}} Monthly Update',
          html_content: '<!DOCTYPE html><html><body><h1>Monthly Newsletter</h1><p>{{content}}</p></body></html>',
          category: 'newsletter',
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          name: 'Feature Announcement Template',
          subject: 'New Feature: {{feature_name}}',
          html_content: '<!DOCTYPE html><html><body><h1>Exciting News!</h1><p>{{announcement}}</p></body></html>',
          category: 'announcement',
          created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          name: 'Welcome Email Template',
          subject: 'Welcome to {{company_name}}!',
          html_content: '<!DOCTYPE html><html><body><h1>Welcome!</h1><p>{{welcome_message}}</p></body></html>',
          category: 'welcome',
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      const mockStats: CampaignStats = {
        total: 42,
        sentThisMonth: 8,
        openRate: 68,
        clickRate: 12
      };

      setCampaigns(mockCampaigns);
      setTemplates(mockTemplates);
      setCampaignStats(mockStats);
    } catch (error) {
      console.error('Error fetching email campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCampaign = async (campaignData: Partial<EmailCampaign>) => {
    try {
      const newCampaign: EmailCampaign = {
        id: Math.random().toString(36).substr(2, 9),
        name: campaignData.name || '',
        subject: campaignData.subject || '',
        template_id: campaignData.template_id || '',
        target_audience: campaignData.target_audience || 'all_users',
        status: campaignData.scheduled_for ? 'scheduled' : 'draft',
        scheduled_for: campaignData.scheduled_for,
        created_at: new Date().toISOString()
      };

      setCampaigns(prev => [newCampaign, ...prev]);
      return newCampaign;
    } catch (error) {
      console.error('Error creating email campaign:', error);
      throw error;
    }
  };

  const createTemplate = async (templateData: Partial<EmailTemplate>) => {
    try {
      const newTemplate: EmailTemplate = {
        id: Math.random().toString(36).substr(2, 9),
        name: templateData.name || '',
        subject: templateData.subject || '',
        html_content: templateData.html_content || '',
        category: templateData.category || 'announcement',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setTemplates(prev => [newTemplate, ...prev]);
      return newTemplate;
    } catch (error) {
      console.error('Error creating email template:', error);
      throw error;
    }
  };

  const sendCampaign = async (campaignId: string) => {
    try {
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, status: 'sent' as const, sent_at: new Date().toISOString() }
          : campaign
      ));
    } catch (error) {
      console.error('Error sending email campaign:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return {
    campaigns,
    templates,
    campaignStats,
    isLoading,
    createCampaign,
    createTemplate,
    sendCampaign,
    refreshCampaigns: fetchCampaigns
  };
};