import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video,
  MoreHorizontal,
  Users,
  Search,
  Filter
} from "lucide-react";
import { useRealTimeChat } from "@/hooks/useRealTimeChat";
import type { Conversation, Message } from "@/hooks/useRealTimeChat";
import { EmojiPicker } from "@/components/chat/EmojiPicker";

export const RealTimeChatSystem = () => {
  const { 
    conversations, 
    messages, 
    activeConversation,
    setActiveConversation,
    sendMessage,
    loading: isLoading 
  } = useRealTimeChat();

  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeConversation) return;

    try {
      const conversation = conversations?.find(c => c.id === activeConversation);
      if (conversation) {
        await sendMessage(activeConversation, messageInput, conversation.vendor_id || conversation.client_id);
      }
      setMessageInput("");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeConversation) {
      // Handle file upload logic here
      console.log('File selected:', file);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const filteredConversations = conversations?.filter(conv => 
    conv.last_message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    }
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit' 
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
      {/* Conversations Sidebar */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Conversations</CardTitle>
            <Badge variant="secondary">{filteredConversations.length}</Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-3 p-3">
                      <div className="w-10 h-10 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No conversations</p>
                <p className="text-muted-foreground text-sm">
                  {searchTerm ? "No conversations match your search" : "Conversations will appear here"}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      activeConversation === conversation.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>
                            {getInitials(`Chat ${conversation.id.slice(0, 8)}`)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm truncate">
                            Chat {conversation.id.slice(0, 8)}
                          </h4>
                          {conversation.created_at && (
                            <span className="text-xs text-muted-foreground">
                              {formatMessageTime(conversation.created_at)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.last_message || 'No messages yet'}
                        </p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {conversation.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="lg:col-span-2 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    {getInitials(`Chat ${activeConversation?.slice(0, 8) || 'Unknown'}`)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    Chat {activeConversation?.slice(0, 8)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Video className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {/* Messages Area */}
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[450px] p-4">
                <div className="space-y-4">
                  {!activeConversation || !messages[activeConversation] || messages[activeConversation].length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                      <p>No messages in this conversation</p>
                    </div>
                  ) : (
                    messages[activeConversation]?.map((message, index) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === 'admin' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender_id === 'admin'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender_id === 'admin' 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`}>
                            {formatMessageTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>

            {/* Message Input */}
            <CardContent className="border-t p-4">
              <div className="flex items-center space-x-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="relative flex-1">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="pr-10"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-12 right-0 z-10">
                      <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                    </div>
                  )}
                </div>
                <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
              <p>Choose a conversation from the sidebar to start chatting</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};