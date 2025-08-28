import React from 'react';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Play, Pause, Reply } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: {
    id: string;
    sender_id: string;
    content: string;
    message_type?: string;
    attachment_url?: string;
    file_name?: string;
    file_size?: number;
    read_at?: string;
    created_at: string;
  };
  isOwn: boolean;
  showAvatar: boolean;
  otherParticipant?: any;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showAvatar,
  otherParticipant
}) => {
  const handleFileDownload = () => {
    if (message.attachment_url) {
      const link = document.createElement('a');
      link.href = message.attachment_url;
      link.download = message.file_name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderMessageContent = () => {
    switch (message.message_type) {
      case 'image':
        return (
          <div className="space-y-2">
            {message.content !== '📷 Image' && (
              <p className="text-sm">{message.content}</p>
            )}
            <img
              src={message.attachment_url}
              alt="Shared image"
              className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.attachment_url, '_blank')}
            />
          </div>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <p className="text-sm">{message.content}</p>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium">{message.file_name || 'File'}</p>
                {message.file_size && (
                  <p className="text-xs text-muted-foreground">
                    {(message.file_size / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFileDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 'voice':
        return (
          <div className="space-y-2">
            <p className="text-sm">{message.content}</p>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Button variant="ghost" size="sm">
                <Play className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <div className="h-2 bg-primary/20 rounded-full">
                  <div className="h-full w-0 bg-primary rounded-full transition-all duration-300"></div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">0:00</span>
            </div>
          </div>
        );

      default:
        return <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>;
    }
  };

  return (
    <div className={cn(
      "flex gap-3 max-w-[80%]",
      isOwn ? "ml-auto flex-row-reverse" : "mr-auto"
    )}>
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
          {otherParticipant?.avatar_url ? (
            <img 
              src={otherParticipant.avatar_url} 
              alt="Avatar" 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-xs text-primary font-medium">
              {(otherParticipant?.company_name || otherParticipant?.full_name || 'U')[0].toUpperCase()}
            </span>
          )}
        </div>
      )}

      {/* Message Content */}
      <div className={cn(
        "flex flex-col gap-1",
        !showAvatar && !isOwn && "ml-11"
      )}>
        <div className={cn(
          "rounded-2xl px-4 py-2 max-w-md break-words",
          isOwn 
            ? "bg-primary text-primary-foreground rounded-br-md" 
            : "bg-muted rounded-bl-md"
        )}>
          {renderMessageContent()}
        </div>

        {/* Message Info */}
        <div className={cn(
          "flex items-center gap-2 text-xs text-muted-foreground px-2",
          isOwn ? "justify-end" : "justify-start"
        )}>
          <span>{format(new Date(message.created_at), 'HH:mm')}</span>
          {isOwn && (
            <Badge variant={message.read_at ? "default" : "secondary"} className="h-4 text-xs">
              {message.read_at ? "Read" : "Sent"}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};