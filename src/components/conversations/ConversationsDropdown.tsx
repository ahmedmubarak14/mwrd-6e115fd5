import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ConversationsDropdownProps {
  children: React.ReactNode;
}

export const ConversationsDropdown = ({ children }: ConversationsDropdownProps) => {
  const { user } = useAuth();

  // Mock unread count - replace with real logic when chat system is implemented
  const unreadCount = 0;

  const handleConversationClick = () => {
    console.log("Opening conversation - chat system not implemented yet");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          {children}
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Messages
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="p-4 text-center text-muted-foreground">
          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No conversations yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Chat functionality coming soon
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};