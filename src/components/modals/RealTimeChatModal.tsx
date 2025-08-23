import { QuickChatModal } from "@/components/conversations/QuickChatModal";

interface RealTimeChatModalProps {
  children: React.ReactNode;
  recipientId: string;
  recipientName?: string;
  requestId?: string;
  offerId?: string;
}

export const RealTimeChatModal = (props: RealTimeChatModalProps) => {
  // For now, this is just a wrapper around QuickChatModal
  // In the future, this could include real-time functionality with Supabase realtime
  return <QuickChatModal {...props} />;
};