import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Send, Phone, Video, MoreVertical, PhoneCall, VideoIcon, Mic, MicOff, PhoneOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

interface ChatModalProps {
  children: React.ReactNode;
  supplierName: string;
  supplierAvatar?: string;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'supplier';
  timestamp: string;
}

export const ChatModal = ({ children, supplierName, supplierAvatar }: ChatModalProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! Thank you for reaching out. How can I help you with your event requirements?",
      sender: 'supplier',
      timestamp: '10:30 AM'
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage: Message = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages([...messages, userMessage]);
      setNewMessage("");

      // Simulate supplier response after a delay
      setTimeout(() => {
        const supplierResponse: Message = {
          id: messages.length + 2,
          text: "I've received your message. Let me review your requirements and get back to you with a detailed proposal shortly.",
          sender: 'supplier',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, supplierResponse]);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartCall = () => {
    setIsCallActive(true);
    setCallDuration(0);
    toast({
      title: "Call Started",
      description: `Connecting with ${supplierName}...`,
    });
    
    // Simulate call timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    // Store timer for cleanup
    (window as any).callTimer = timer;
  };

  const handleStartVideo = () => {
    setIsVideoActive(true);
    setIsCallActive(true);
    setCallDuration(0);
    toast({
      title: "Video Call Started",
      description: `Video calling ${supplierName}...`,
    });
    
    // Simulate call timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    // Store timer for cleanup
    (window as any).callTimer = timer;
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setIsVideoActive(false);
    setIsMuted(false);
    
    // Clear timer
    if ((window as any).callTimer) {
      clearInterval((window as any).callTimer);
    }
    
    const duration = Math.floor(callDuration / 60) + ':' + String(callDuration % 60).padStart(2, '0');
    toast({
      title: "Call Ended",
      description: `Call duration: ${duration}`,
    });
    
    setCallDuration(0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Microphone Unmuted" : "Microphone Muted",
      description: isMuted ? "You can now speak" : "Your microphone is muted",
    });
  };

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
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
                <DialogDescription className="text-sm">
                  <span className="inline-flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Online - Usually responds within 2 hours
                  </span>
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
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 hover:bg-primary/10"
                    onClick={handleStartVideo}
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
              <Button variant="ghost" size="sm" className="p-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
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
                  📹 Video feed would appear here
                </p>
              </div>
            )}
          </div>
        )}

        <ScrollArea className="flex-1 p-4">
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
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}>
                    {message.timestamp}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};