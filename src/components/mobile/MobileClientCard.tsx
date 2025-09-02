import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Phone, 
  Video, 
  Building, 
  DollarSign,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerHapticFeedback } from '@/utils/mobileOptimizations';

interface MobileClientCardProps {
  client: {
    id: string;
    full_name?: string;
    company_name?: string;
    avatar_url?: string;
    email: string;
    totalOrders: number;
    totalRevenue: number;
    lastInteraction: string;
    relationship: string;
  };
  onCall?: (clientId: string, type: 'voice' | 'video') => void;
  onMessage?: (clientId: string) => void;
  onViewHistory?: (clientId: string) => void;
}

export const MobileClientCard = ({ 
  client, 
  onCall, 
  onMessage, 
  onViewHistory 
}: MobileClientCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    triggerHapticFeedback('light');
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const startX = touch.clientX;
    setSwipeOffset(Math.max(-120, Math.min(120, startX - 100)));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    if (Math.abs(swipeOffset) > 60) {
      if (swipeOffset > 60) {
        // Swipe right - quick call
        onCall?.(client.id, 'voice');
        triggerHapticFeedback('medium');
      } else {
        // Swipe left - quick message
        onMessage?.(client.id);
        triggerHapticFeedback('medium');
      }
    }
    
    setSwipeOffset(0);
  };

  const getRelationshipBadge = (relationship: string, totalOrders: number) => {
    if (totalOrders > 5) return { variant: 'default' as const, label: 'VIP Client' };
    if (totalOrders > 0) return { variant: 'secondary' as const, label: 'Active' };
    return { variant: 'outline' as const, label: 'Prospect' };
  };

  const badge = getRelationshipBadge(client.relationship, client.totalOrders);

  return (
    <div className="relative overflow-hidden">
      {/* Swipe Actions Background */}
      <div className="absolute inset-0 flex">
        <div className="w-full bg-green-500 flex items-center justify-start pl-4">
          <Phone className="h-5 w-5 text-white" />
          <span className="text-white font-medium ml-2">Call</span>
        </div>
        <div className="w-full bg-blue-500 flex items-center justify-end pr-4">
          <MessageSquare className="h-5 w-5 text-white" />
          <span className="text-white font-medium mr-2">Message</span>
        </div>
      </div>

      {/* Main Card */}
      <Card 
        className={cn(
          "transition-transform duration-200 bg-background relative",
          isDragging && "cursor-grabbing"
        )}
        style={{ 
          transform: `translateX(${swipeOffset}px)`,
          touchAction: 'pan-x'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="h-12 w-12">
                <AvatarImage src={client.avatar_url} />
                <AvatarFallback>
                  {client.full_name?.charAt(0) || client.company_name?.charAt(0) || 'C'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate">
                  {client.full_name || 'Unknown'}
                </h3>
                {client.company_name && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Building className="h-3 w-3" />
                    <span className="truncate">{client.company_name}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={badge.variant} className="text-xs">
                {badge.label}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4 py-3 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{client.totalOrders}</div>
              <div className="text-xs text-muted-foreground">Orders</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                ${client.totalRevenue.toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {Math.floor((Date.now() - new Date(client.lastInteraction).getTime()) / (1000 * 60 * 60 * 24))}d
              </div>
              <div className="text-xs text-muted-foreground">Ago</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMessage?.(client.id)}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Message</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCall?.(client.id, 'voice')}
              className="flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Call</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCall?.(client.id, 'video')}
              className="flex items-center gap-2"
            >
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Video</span>
            </Button>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium">{client.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Contact</span>
                <span className="text-sm font-medium">
                  {new Date(client.lastInteraction).toLocaleDateString()}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewHistory?.(client.id)}
                className="w-full"
              >
                <Calendar className="h-4 w-4 mr-2" />
                View History
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};