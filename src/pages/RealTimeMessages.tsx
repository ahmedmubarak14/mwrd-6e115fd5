import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Users, Zap } from 'lucide-react';
import { RealTimeChatInterface } from '@/components/chat/RealTimeChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { useRealTimeChat } from '@/hooks/useRealTimeChat';

const RealTimeMessages: React.FC = () => {
  const { userProfile } = useAuth();
  const { conversations, loading } = useRealTimeChat();

  // Calculate stats
  const totalConversations = conversations.length;
  const activeConversations = conversations.filter(c => c.status === 'active').length;
  const businessConversations = conversations.filter(c => c.conversation_type === 'business').length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
            <p className="text-muted-foreground">
              Real-time messaging with clients and vendors
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-2">
              <Zap className="h-3 w-3" />
              Real-time
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Total Conversations</h3>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalConversations}</div>
              <p className="text-xs text-muted-foreground">
                All your conversations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Active Chats</h3>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeConversations}</div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Business Chats</h3>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{businessConversations}</div>
              <p className="text-xs text-muted-foreground">
                Business related
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Chat Interface</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Online</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <RealTimeChatInterface height="calc(100vh - 400px)" />
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Real-time Messaging</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Messages are delivered instantly with real-time updates and notifications.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold">File Sharing</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Share images, documents, and other files securely with participants.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold">Business Context</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Conversations are linked to requests, offers, and support tickets for context.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMessages;