import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface ClientUserProfileProps {
  variant?: 'sidebar' | 'mobile';
  collapsed?: boolean;
}

export const ClientUserProfile: React.FC<ClientUserProfileProps> = ({ 
  variant = 'sidebar', 
  collapsed = false 
}) => {
  const { user, userProfile } = useAuth();
  
  const companyName = userProfile?.company_name || 'Company';
  const displayName = userProfile?.full_name || user?.email?.split('@')[0] || 'User';
  const userId = userProfile?.id || '';
  const role = userProfile?.role || 'user';
  const initials = companyName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'C';

  if (collapsed && variant === 'sidebar') {
    return (
      <div className="flex flex-col items-center py-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={userProfile?.avatar_url} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="mt-1 w-1 h-1 bg-success rounded-full" title="Online" />
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-3",
      variant === 'mobile' ? "px-4 py-3" : "px-3 py-2"
    )}>
      <Avatar className={cn(
        variant === 'mobile' ? "h-10 w-10" : "h-8 w-8"
      )}>
        <AvatarImage src={userProfile?.avatar_url} />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold border border-primary/20">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn(
            "font-semibold truncate text-foreground",
            variant === 'mobile' ? "text-base" : "text-sm"
          )}>
            {companyName}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={cn(
            "font-medium truncate text-foreground",
            variant === 'mobile' ? "text-sm" : "text-xs"
          )}>
            {displayName}
          </span>
          <Badge 
            variant="secondary" 
            className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 capitalize"
          >
            {role}
          </Badge>
        </div>
        
        {!collapsed && userId && (
          <span className={cn(
            "text-muted-foreground truncate",
            variant === 'mobile' ? "text-xs" : "text-xs"
          )}>
            ID: {userId.slice(0, 8)}...
          </span>
        )}
      </div>
    </div>
  );
};