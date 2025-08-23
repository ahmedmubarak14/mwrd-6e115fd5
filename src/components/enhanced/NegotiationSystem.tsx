import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  MessageSquare, 
  DollarSign, 
  Clock, 
  Send, 
  ArrowRight, 
  ArrowLeft,
  Calendar,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  History,
  Handshake
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface NegotiationMessage {
  id: string;
  type: 'offer' | 'counter_offer' | 'message' | 'acceptance' | 'rejection';
  sender: 'client' | 'supplier';
  senderInfo: {
    name: string;
    avatar?: string;
    title?: string;
  };
  content: string;
  price?: number;
  deliveryTime?: number;
  changes?: {
    priceChange: number;
    deliveryChange: number;
  };
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

interface NegotiationThread {
  id: string;
  offerId: string;
  originalOffer: {
    price: number;
    deliveryTime: number;
    title: string;
  };
  currentOffer: {
    price: number;
    deliveryTime: number;
  };
  status: 'active' | 'completed' | 'cancelled';
  messages: NegotiationMessage[];
  createdAt: string;
  lastActivity: string;
}

interface NegotiationSystemProps {
  thread?: NegotiationThread;
  userRole: 'client' | 'supplier';
  onSendMessage?: (message: string) => void;
  onSendCounterOffer?: (price: number, deliveryTime: number, message: string) => void;
  onAcceptOffer?: () => void;
  onRejectOffer?: (reason: string) => void;
}

export const NegotiationSystem: React.FC<NegotiationSystemProps> = ({
  thread,
  userRole,
  onSendMessage,
  onSendCounterOffer,
  onAcceptOffer,
  onRejectOffer
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [newMessage, setNewMessage] = useState('');
  const [counterPrice, setCounterPrice] = useState(thread?.currentOffer.price || 0);
  const [counterDelivery, setCounterDelivery] = useState(thread?.currentOffer.deliveryTime || 0);
  const [counterMessage, setCounterMessage] = useState('');
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  // Mock data for demonstration
  const mockThread: NegotiationThread = thread || {
    id: '1',
    offerId: 'offer-1',
    originalOffer: {
      price: 15000,
      deliveryTime: 10,
      title: 'Professional Event Photography Services'
    },
    currentOffer: {
      price: 13500,
      deliveryTime: 8
    },
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    lastActivity: '2024-01-15T14:30:00Z',
    messages: [
      {
        id: '1',
        type: 'offer',
        sender: 'supplier',
        senderInfo: {
          name: 'Ahmed Al-Saudi',
          avatar: '/avatar1.jpg',
          title: 'Professional Photographer'
        },
        content: 'Initial offer for comprehensive photography coverage',
        price: 15000,
        deliveryTime: 10,
        timestamp: '2024-01-15T10:00:00Z',
        status: 'pending'
      },
      {
        id: '2',
        type: 'counter_offer',
        sender: 'client',
        senderInfo: {
          name: 'Sarah Events Co.',
          avatar: '/avatar2.jpg',
          title: 'Event Manager'
        },
        content: 'Great work portfolio! Could you adjust the price and delivery time?',
        price: 13000,
        deliveryTime: 7,
        changes: {
          priceChange: -2000,
          deliveryChange: -3
        },
        timestamp: '2024-01-15T12:30:00Z',
        status: 'pending'
      },
      {
        id: '3',
        type: 'counter_offer',
        sender: 'supplier',
        senderInfo: {
          name: 'Ahmed Al-Saudi',
          avatar: '/avatar1.jpg',
          title: 'Professional Photographer'
        },
        content: 'I can meet you halfway on the price, but need 8 days for quality delivery',
        price: 13500,
        deliveryTime: 8,
        changes: {
          priceChange: 500,
          deliveryChange: 1
        },
        timestamp: '2024-01-15T14:30:00Z',
        status: 'pending'
      }
    ]
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && onSendMessage) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleSendCounterOffer = () => {
    if (onSendCounterOffer) {
      onSendCounterOffer(counterPrice, counterDelivery, counterMessage);
      setShowCounterForm(false);
      setCounterMessage('');
    }
  };

  const handleAccept = () => {
    if (onAcceptOffer) {
      onAcceptOffer();
    }
  };

  const handleReject = () => {
    if (onRejectOffer && rejectionReason.trim()) {
      onRejectOffer(rejectionReason.trim());
      setShowRejectionForm(false);
      setRejectionReason('');
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return null;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  const renderMessage = (message: NegotiationMessage) => {
    const isOwnMessage = message.sender === userRole;
    
    return (
      <div
        key={message.id}
        className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
      >
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={message.senderInfo.avatar} />
          <AvatarFallback className="text-xs">
            {message.senderInfo.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className={`flex-1 max-w-md ${isOwnMessage ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">{message.senderInfo.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
            </span>
          </div>

          <Card className={`${isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            <CardContent className="p-3">
              {message.type === 'offer' || message.type === 'counter_offer' ? (
                <div className="space-y-3">
                  <p className="text-sm">{message.content}</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-background/20 rounded">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <DollarSign className="h-3 w-3" />
                        {message.changes?.priceChange && getChangeIcon(message.changes.priceChange)}
                      </div>
                      <div className="text-lg font-bold">
                        {message.price?.toLocaleString()} SAR
                      </div>
                      {message.changes?.priceChange && (
                        <div className={`text-xs ${getChangeColor(message.changes.priceChange)}`}>
                          {message.changes.priceChange > 0 ? '+' : ''}
                          {message.changes.priceChange.toLocaleString()}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center p-2 bg-background/20 rounded">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="h-3 w-3" />
                        {message.changes?.deliveryChange && getChangeIcon(message.changes.deliveryChange)}
                      </div>
                      <div className="text-lg font-bold">
                        {message.deliveryTime} {isRTL ? 'يوم' : 'days'}
                      </div>
                      {message.changes?.deliveryChange && (
                        <div className={`text-xs ${getChangeColor(message.changes.deliveryChange)}`}>
                          {message.changes.deliveryChange > 0 ? '+' : ''}
                          {message.changes.deliveryChange}
                        </div>
                      )}
                    </div>
                  </div>

                  {message.status === 'pending' && !isOwnMessage && (
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        onClick={handleAccept}
                        className="flex-1"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {isRTL ? 'قبول' : 'Accept'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setShowCounterForm(true)}
                        className="flex-1"
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {isRTL ? 'عرض مضاد' : 'Counter'}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Handshake className="h-5 w-5" />
                {isRTL ? 'جلسة تفاوض' : 'Negotiation Session'}
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                {mockThread.originalOffer.title}
              </p>
            </div>
            <Badge 
              variant={mockThread.status === 'active' ? 'default' : 'secondary'}
              className="gap-1"
            >
              <div className={`w-2 h-2 rounded-full ${
                mockThread.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
              }`} />
              {isRTL ? 
                (mockThread.status === 'active' ? 'نشط' : 'مكتمل') :
                (mockThread.status === 'active' ? 'Active' : 'Completed')
              }
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{isRTL ? 'السعر الأصلي' : 'Original Price'}</p>
              <p className="text-lg font-semibold">{mockThread.originalOffer.price.toLocaleString()} SAR</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{isRTL ? 'السعر الحالي' : 'Current Price'}</p>
              <p className="text-lg font-semibold text-primary">{mockThread.currentOffer.price.toLocaleString()} SAR</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{isRTL ? 'التسليم الأصلي' : 'Original Delivery'}</p>
              <p className="text-lg font-semibold">{mockThread.originalOffer.deliveryTime} {isRTL ? 'يوم' : 'days'}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{isRTL ? 'التسليم الحالي' : 'Current Delivery'}</p>
              <p className="text-lg font-semibold text-primary">{mockThread.currentOffer.deliveryTime} {isRTL ? 'يوم' : 'days'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            {isRTL ? 'تاريخ التفاوض' : 'Negotiation History'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {mockThread.messages.map(renderMessage)}
          </div>
        </CardContent>
      </Card>

      {/* Counter Offer Form */}
      {showCounterForm && (
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? 'عرض مضاد' : 'Counter Offer'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">
                  {isRTL ? 'السعر المقترح (ريال سعودي)' : 'Proposed Price (SAR)'}
                </label>
                <Input
                  type="number"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(Number(e.target.value))}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'التغيير:' : 'Change:'} {counterPrice - mockThread.currentOffer.price > 0 ? '+' : ''}
                  {(counterPrice - mockThread.currentOffer.price).toLocaleString()} SAR
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">
                  {isRTL ? 'مدة التسليم (أيام)' : 'Delivery Time (days)'}
                </label>
                <Input
                  type="number"
                  value={counterDelivery}
                  onChange={(e) => setCounterDelivery(Number(e.target.value))}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'التغيير:' : 'Change:'} {counterDelivery - mockThread.currentOffer.deliveryTime > 0 ? '+' : ''}
                  {counterDelivery - mockThread.currentOffer.deliveryTime} {isRTL ? 'يوم' : 'days'}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">
                {isRTL ? 'رسالة إضافية' : 'Additional Message'}
              </label>
              <Textarea
                value={counterMessage}
                onChange={(e) => setCounterMessage(e.target.value)}
                placeholder={isRTL ? 'اشرح سبب هذا العرض المضاد...' : 'Explain your counter offer...'}
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSendCounterOffer} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                {isRTL ? 'إرسال عرض مضاد' : 'Send Counter Offer'}
              </Button>
              <Button variant="outline" onClick={() => setShowCounterForm(false)}>
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message Input */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isRTL ? 'اكتب رسالة...' : 'Type a message...'}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2 mt-3">
            {!showCounterForm && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCounterForm(true)}
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                {isRTL ? 'عرض مضاد' : 'Counter Offer'}
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAccept}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              {isRTL ? 'قبول العرض' : 'Accept Offer'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowRejectionForm(true)}
            >
              <XCircle className="h-3 w-3 mr-1" />
              {isRTL ? 'رفض' : 'Reject'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};