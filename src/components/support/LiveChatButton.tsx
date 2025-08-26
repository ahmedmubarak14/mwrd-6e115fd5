
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Users } from "lucide-react";
import { QuickChatModal } from "@/components/conversations/QuickChatModal";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToastFeedback } from "@/hooks/useToastFeedback";
import { getAvailableAdmins, selectRandomAdmin } from "@/utils/adminUtils";

export const LiveChatButton = () => {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const { showError, showInfo } = useToastFeedback();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

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
      setSelectedAdmin(admin);
      showInfo('Connecting you to a support agent...');
    } catch (error) {
      console.error('Error starting chat:', error);
      showError('Failed to start chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
        {isLoading ? 'Connecting...' : t('support.startLiveChat')}
      </Button>

      {selectedAdmin && (
        <QuickChatModal
          recipientId={selectedAdmin.user_id}
          recipientName={selectedAdmin.full_name || 'Support Agent'}
        >
          <div className="flex items-center gap-2 p-4 border-b">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold">Support Chat</h3>
              <p className="text-sm text-muted-foreground">
                Connected to: {selectedAdmin.full_name || 'Support Agent'}
              </p>
            </div>
          </div>
        </QuickChatModal>
      )}
    </>
  );
};
