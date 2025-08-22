import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Phone, Video, MoreVertical, PhoneCall, VideoIcon, Mic, MicOff, PhoneOff, Paperclip, Smile } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { dummyApi } from "@/utils/dummyApi";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'supplier';
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  type?: 'text' | 'file' | 'image';
}

interface EnhancedChatModalProps {
  children: React.ReactNode;
  supplierName: string;
  supplierId: string;
  supplierAvatar?: string;
}

export const EnhancedChatModal = ({ children, supplierName, supplierId, supplierAvatar }: EnhancedChatModalProps) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useLocalStorage<Message[]>(`chat-${supplierId}`, []);
  const [newMessage, setNewMessage] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isSupplierTyping, setIsSupplierTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline] = useState(Math.random() > 0.3); // 70% chance supplier is online
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize with welcome message if no messages exist
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: `msg-${Date.now()}`,
        text: `Hello! Thank you for reaching out to ${supplierName}. How can I help you with your event requirements?`,
        sender: 'supplier',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length, supplierName, setMessages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    try {
      // Simulate sending message
      const response = await dummyApi.sendChatMessage(newMessage, supplierId);
      
      if (response.success) {
        // Update message status to sent
        setMessages(prev => prev.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
        ));

        // Simulate supplier response if provided
        if (response.data?.response) {
          setIsTyping(true);
          setTimeout(() => {
            const supplierResponse: Message = {
              id: `msg-${Date.now()}-supplier`,
              text: response.data!.response!,
              sender: 'supplier',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'read'
            };
            setMessages(prev => [...prev, supplierResponse]);
            setIsTyping(false);
          }, 1500);
        }
      } else {
        // Update message status to failed
        setMessages(prev => prev.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: 'sent', text: msg.text + ' (Failed to send)' } : msg
        ));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartCall = async () => {
    setIsLoading(true);
    try {
      const response = await dummyApi.initiateVideoCall(supplierName);
      
      if (response.success) {
        setIsCallActive(true);
        setCallDuration(0);
        
        // Simulate call timer
        const timer = setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
        
        // Store timer for cleanup
        (window as any).callTimer = timer;
      }
    } catch (error) {
      console.error('Failed to start call:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartVideo = async () => {
    setIsVideoActive(true);
    await handleStartCall();
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setIsVideoActive(false);
    setIsMuted(false);
    
    // Clear timer
    if ((window as any).callTimer) {
      clearInterval((window as any).callTimer);
    }
    
    setCallDuration(0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const getMessageStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return '⏳';
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      default:
        return '';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">
                  {supplierName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-lg">{supplierName}</DialogTitle>
                <DialogDescription className="text-sm flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  {isOnline ? 'Online - Usually responds within 2 hours' : 'Offline - Will respond when available'}
                  {isTyping && (
                    <span className="text-primary animate-pulse">Typing...</span>
                  )}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isCallActive ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 hover:bg-primary/10"
                    onClick={handleStartCall}
                    disabled={isLoading}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 hover:bg-primary/10"
                    onClick={handleStartVideo}
                    disabled={isLoading}
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`p-2 ${isMuted ? 'bg-red-100 text-red-600' : 'hover:bg-primary/10'}`}
                    onClick={toggleMute}
                  >
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 bg-red-100 text-red-600 hover:bg-red-200"
                    onClick={handleEndCall}
                  >
                    <PhoneOff className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Call/Video Interface */}
        {isCallActive && (
          <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isVideoActive ? <VideoIcon className="h-5 w-5 text-primary" /> : <PhoneCall className="h-5 w-5 text-primary" />}
                <div>
                  <p className="font-medium">{isVideoActive ? 'Video Call' : 'Voice Call'} in progress</p>
                  <p className="text-sm text-muted-foreground">Duration: {formatCallDuration(callDuration)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isMuted ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></span>
                <span className="text-sm text-muted-foreground">
                  {isMuted ? 'Muted' : 'Connected'}
                </span>
              </div>
            </div>
            {isVideoActive && (
              <div className="mt-3 p-3 bg-black/10 rounded-lg">
                <p className="text-sm text-center text-muted-foreground">
                  📹 Video feed simulation - Call active with {supplierName}
                </p>
              </div>
            )}
          </div>
        )}

        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <Card className={`max-w-[70%] p-3 ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <div className={`flex items-center justify-between mt-1 ${
                    message.sender === 'user' 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}>
                    <p className="text-xs">{message.timestamp}</p>
                    {message.sender === 'user' && (
                      <span className="text-xs">
                        {getMessageStatusIcon(message.status)}
                      </span>
                    )}
                  </div>
                </Card>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <Card className="max-w-[70%] p-3 bg-muted">
                  <div className="flex items-center gap-1">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">typing...</span>
                  </div>
                </Card>
              </div>
            )}
            {isLoading && (
              <div className="flex justify-center">
                <LoadingSpinner size="sm" text="Sending..." />
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background">
          <div className="flex gap-2 items-end">
            <Button variant="ghost" size="sm" className="p-2">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Smile className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isLoading}
              className="px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-muted-foreground">
              Press Enter to send • Shift + Enter for new line
            </p>
            {isOnline && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                Secure messaging via MWRD
              </Badge>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};