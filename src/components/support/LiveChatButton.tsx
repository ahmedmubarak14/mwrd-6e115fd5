
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { QuickChatModal } from "@/components/conversations/QuickChatModal";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useToastFeedback } from "@/hooks/useToastFeedback";
import { getAvailableAdmins, selectRandomAdmin } from "@/utils/adminUtils";

export const LiveChatButton = () => {
  const { userProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const { showError, showSuccess } = useToastFeedback();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Safe fallback for translation
  const t = languageContext?.t || ((key: string) => key.split('.').pop() || key);

  const handleStartChat = async () => {
    console.log('LiveChat: Button clicked');
    
    if (!userProfile) {
      console.log('LiveChat: No user profile found');
      showError('Please log in to start a chat');
      return;
    }

    console.log('LiveChat: Starting chat for user:', userProfile.user_id);
    setIsLoading(true);

    try {
      console.log('LiveChat: Getting available admins...');
      const admins = await getAvailableAdmins();
      
      if (admins.length === 0) {
        console.log('LiveChat: No admins available');
        showError('No support agents are currently available. Please create a support ticket instead.');
        return;
      }

      console.log('LiveChat: Found', admins.length, 'admins');
      const admin = selectRandomAdmin(admins);
      
      if (!admin) {
        console.log('LiveChat: Failed to select admin');
        showError('Failed to connect to support agent. Please try again.');
        return;
      }

      console.log('LiveChat: Selected admin:', admin.full_name);
      setSelectedAdmin(admin);
      setIsModalOpen(true);
      showSuccess('Connecting you to a support agent...');
      
    } catch (error) {
      console.error('LiveChat: Error starting chat:', error);
      showError('Failed to start chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    console.log('LiveChat: Modal closing');
    setIsModalOpen(false);
    setSelectedAdmin(null);
  };

  return (
    <>
      <Button
        onClick={handleStartChat}
        disabled={isLoading}
        className="w-full flex items-center gap-2 bg-primary hover:bg-primary/90"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <MessageSquare className="h-4 w-4" />
        )}
        {isLoading ? 'Connecting...' : t('support.startLiveChat') || 'Start Live Chat'}
      </Button>

      <QuickChatModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        recipientId={selectedAdmin?.user_id || ''}
        recipientName={selectedAdmin?.full_name || 'Support Agent'}
      />
    </>
  );
};
