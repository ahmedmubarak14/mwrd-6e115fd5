import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToastFeedback } from './useToastFeedback';

interface EmailNotification {
  to: string;
  subject: string;
  message: string;
  type: 'offer' | 'request_approval' | 'offer_status' | 'general';
  data?: any;
}

export const useEmailNotifications = () => {
  const [sending, setSending] = useState(false);
  const { showError, showSuccess } = useToastFeedback();

  const sendNotificationEmail = async (notification: EmailNotification): Promise<boolean> => {
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-notification-email', {
        body: notification
      });

      if (error) {
        console.error('Email notification error:', error);
        showError('Failed to send email notification');
        return false;
      }

      if (data?.success) {
        console.log('Email notification sent:', data.emailId);
        return true;
      } else {
        showError('Email sending failed');
        return false;
      }
    } catch (error: any) {
      console.error('Error sending email notification:', error);
      showError('Failed to send email notification');
      return false;
    } finally {
      setSending(false);
    }
  };

  const sendOfferNotification = async (
    recipientEmail: string,
    offerData: {
      request_title: string;
      vendor_name: string;
      price: number;
      currency?: string;
      delivery_time_days?: number;
    }
  ) => {
    return sendNotificationEmail({
      to: recipientEmail,
      subject: `New Offer: ${offerData.request_title}`,
      message: `${offerData.vendor_name} has submitted an offer for your request "${offerData.request_title}".`,
      type: 'offer',
      data: {
        price: offerData.price,
        currency: offerData.currency,
        delivery_time_days: offerData.delivery_time_days,
        platform_url: window.location.origin
      }
    });
  };

  const sendRequestApprovalNotification = async (
    recipientEmail: string,
    requestData: {
      title: string;
      status: string;
    }
  ) => {
    return sendNotificationEmail({
      to: recipientEmail,
      subject: `Request ${requestData.status}: ${requestData.title}`,
      message: `Your procurement request "${requestData.title}" has been ${requestData.status.toLowerCase()}.`,
      type: 'request_approval',
      data: {
        request_title: requestData.title,
        status: requestData.status,
        platform_url: window.location.origin
      }
    });
  };

  const sendOfferStatusNotification = async (
    recipientEmail: string,
    offerData: {
      title: string;
      status: string;
    }
  ) => {
    return sendNotificationEmail({
      to: recipientEmail,
      subject: `Offer ${offerData.status}: ${offerData.title}`,
      message: `Your offer "${offerData.title}" has been ${offerData.status.toLowerCase()}.`,
      type: 'offer_status',
      data: {
        offer_title: offerData.title,
        status: offerData.status,
        platform_url: window.location.origin
      }
    });
  };

  return {
    sending,
    sendNotificationEmail,
    sendOfferNotification,
    sendRequestApprovalNotification,
    sendOfferStatusNotification
  };
};