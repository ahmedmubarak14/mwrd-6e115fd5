
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { QuickChatModal } from "@/components/conversations/QuickChatModal";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToastFeedback } from "@/hooks/useToastFeedback";
import { getAvailableAdmins, selectRandomAdmin } from "@/utils/adminUtils";

export const LiveChatButton = () => {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const { showError, showSuccess } = useToastFeedback();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleStartChat = async () => {
    if (!userProfile) {
      showError('Please log in to start a chat');
      return;
    }

    setIsLoading(true);

    try {
      const admins = await getAvailableAdmins();
      
      if (admins.length === 0) {
        showError('No support agents are currently available. Please create a support ticket instead.');
        return;
      }

      const admin = selectRandomAdmin(admins);
      
      if (!admin) {
        showError('Failed to connect to support agent. Please try again.');
        return;
      }
      
      // Validate admin has required fields
      if (!admin.user_id) {
        console.error('LiveChat: Admin missing user_id:', admin);
        showError('Invalid admin data. Please try again.');
        return;
      }

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

      {selectedAdmin && (
        <QuickChatModal
          open={isModalOpen}
          onOpenChange={handleModalClose}
          recipientId={selectedAdmin.user_id}
          recipientName={selectedAdmin.full_name || 'Support Agent'}
          conversationType="support"
        />
      )}
    </>
  );
};
