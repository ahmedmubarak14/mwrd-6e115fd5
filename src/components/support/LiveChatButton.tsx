
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, AlertCircle } from "lucide-react";
import { QuickChatModal } from "@/components/conversations/QuickChatModal";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useToastFeedback } from "@/hooks/useToastFeedback";
import { getAvailableAdmins, selectRandomAdmin } from "@/utils/adminUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const LiveChatButton = () => {
  const { userProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const { showError, showSuccess } = useToastFeedback();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Safe fallback for translation
  const t = languageContext?.t || ((key: string) => key.split('.').pop() || key);

  const handleStartChat = async () => {
    console.log('LiveChat: Button clicked');
    setErrorMessage(null);
    
    if (!userProfile) {
      const error = 'Please log in to start a chat';
      console.log('LiveChat: No user profile found');
      setErrorMessage(error);
      showError(error);
      return;
    }

    console.log('LiveChat: Starting chat for user:', userProfile.user_id);
    setIsLoading(true);

    try {
      console.log('LiveChat: Getting available admins...');
      const admins = await getAvailableAdmins();
      console.log('LiveChat: Received admins data:', admins);
      
      if (!admins || admins.length === 0) {
        const error = 'No support agents are currently available. Please create a support ticket instead.';
        console.log('LiveChat: No admins available');
        setErrorMessage(error);
        showError(error);
        return;
      }

      console.log('LiveChat: Found', admins.length, 'admins');
      const admin = selectRandomAdmin(admins);
      
      if (!admin) {
        const error = 'Failed to connect to support agent. Please try again.';
        console.log('LiveChat: Failed to select admin');
        setErrorMessage(error);
        showError(error);
        return;
      }

      console.log('LiveChat: Selected admin:', admin);
      
      // Validate admin has required fields
      if (!admin.user_id) {
        const error = 'Invalid admin data. Please contact support directly.';
        console.error('LiveChat: Admin missing user_id:', admin);
        setErrorMessage(error);
        showError(error);
        return;
      }

      setSelectedAdmin(admin);
      setIsModalOpen(true);
      showSuccess('Connecting you to a support agent...');
      
    } catch (error) {
      const errorMsg = 'Failed to start chat. Please try again or contact support directly.';
      console.error('LiveChat: Error starting chat:', error);
      setErrorMessage(errorMsg);
      showError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    console.log('LiveChat: Modal closing');
    setIsModalOpen(false);
    setSelectedAdmin(null);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-3">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
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
    </div>
  );
};
