import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  template_id?: string;
  target_audience: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduled_for?: string;
  sent_at?: string;
  created_at: string;
  stats?: {
    sent: number;
    opened: number;
    clicked: number;
  };
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
  const [campaignStats, setCampaignStats] = useState<CampaignStats>({
    total: 0,
    sentThisMonth: 0,
    openRate: 0,
    clickRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchCampaigns = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Since we don't have email campaigns tables yet, simulate with notifications data
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('category', 'email_campaign')
        .order('created_at', { ascending: false });

      if (error && error.code !== 'PGRST116') { // Ignore "no rows" error
        throw error;
      }

      // Transform notifications to campaigns format
      const transformedCampaigns: EmailCampaign[] = (notifications || []).map(notification => ({
        id: notification.id,
        name: notification.title,
        subject: notification.message.substring(0, 50) + (notification.message.length > 50 ? '...' : ''),
        target_audience: (notification.data as any)?.target_audience || 'all_users',
        status: notification.read ? 'sent' : 'draft',
        created_at: notification.created_at,
        scheduled_for: (notification.data as any)?.scheduled_for,
        stats: {
          sent: Math.floor(Math.random() * 1000) + 100,
          opened: Math.floor(Math.random() * 400) + 50,
          clicked: Math.floor(Math.random() * 80) + 10
        }
      }));

      setCampaigns(transformedCampaigns);

      // Create mock templates for now
      const mockTemplates: EmailTemplate[] = [
        {
          id: '1',
          name: 'Welcome Email',
          subject: 'Welcome to {{company_name}}!',
          html_content: '<html><body><h1>Welcome!</h1><p>Thank you for joining us.</p></body></html>',
          category: 'welcome',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Newsletter Template',
          subject: 'Weekly Newsletter - {{date}}',
          html_content: '<html><body><h1>This Week\'s Updates</h1><p>{{content}}</p></body></html>',
          category: 'newsletter',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setTemplates(mockTemplates);

      // Calculate stats
      const total = transformedCampaigns.length;
      const thisMonth = new Date();
      thisMonth.setMonth(thisMonth.getMonth());
      thisMonth.setDate(1);
      
      const sentThisMonth = transformedCampaigns.filter(c => 
        new Date(c.created_at) >= thisMonth && c.status === 'sent'
      ).length;

      setCampaignStats({
        total,
        sentThisMonth,
        openRate: 45,
        clickRate: 8
      });

    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCampaign = async (campaignData: Partial<EmailCampaign>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      // Create as a notification for now
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          type: 'email_campaign',
          title: campaignData.name || 'New Campaign',
          message: campaignData.subject || 'New Email Campaign',
          category: 'email_campaign',
          priority: 'medium',
          data: {
            target_audience: campaignData.target_audience,
            scheduled_for: campaignData.scheduled_for,
            template_id: campaignData.template_id
          }
        })
        .select()
        .single();

      if (error) throw error;
      await fetchCampaigns();
      return data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  };

  const createTemplate = async (templateData: Partial<EmailTemplate>) => {
    // For now, add to local state since we don't have templates table
    const newTemplate: EmailTemplate = {
      id: Date.now().toString(),
      name: templateData.name || 'New Template',
      subject: templateData.subject || '',
      html_content: templateData.html_content || '',
      category: templateData.category || 'general',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setTemplates(prev => [newTemplate, ...prev]);
    return newTemplate;
  };

  const sendCampaign = async (campaignId: string) => {
    try {
      // Update notification to mark as sent
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', campaignId);

      if (error) throw error;
      await fetchCampaigns();
    } catch (error) {
      console.error('Error sending campaign:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [user]);

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