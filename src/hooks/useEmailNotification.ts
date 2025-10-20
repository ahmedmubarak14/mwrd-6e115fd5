import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export type EmailType = 'offer' | 'request_approval' | 'offer_status' | 'general';

interface SendEmailParams {
  to: string;
  subject: string;
  message: string;
  type: EmailType;
  data?: Record<string, any>;
}

export const useEmailNotification = () => {
  const { language, t } = useLanguage();

  const sendEmail = async (params: SendEmailParams) => {
    try {
      const { error } = await supabase.functions.invoke('send-notification-email', {
        body: {
          ...params,
          language: language, // Automatically include user's current language
        },
      });

      if (error) {
        console.error('Failed to send email:', error);
        toast.error(t('common.errors.serverError'));
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error };
    }
  };

  return { sendEmail };
};
