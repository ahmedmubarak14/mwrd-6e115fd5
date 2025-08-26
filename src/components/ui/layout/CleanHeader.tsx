
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ConversationsDropdown } from "@/components/conversations/ConversationsDropdown";
import { NotificationsModal } from "@/components/modals/NotificationsModal";
import { SearchModal } from "@/components/modals/SearchModal";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface CleanHeaderProps {
  onMobileMenuOpen?: () => void;
}

export const CleanHeader = ({ onMobileMenuOpen }: CleanHeaderProps) => {
  const { userProfile, signOut } = useAuth();
  const { t, isRTL } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const isMobile = useIsMobile();

  // Mock notification count - replace with real data
  const notificationCount = 3;

  return (
    <>
      <div className={cn(
        "flex-1 flex items-center justify-between gap-4",
        isRTL && "flex-row-reverse"
      )}>
        {/* Search */}
        <div className="flex-1 max-w-md">
          <Button
            variant="outline"
            onClick={() => setShowSearch(true)}
            className={cn(
              "w-full justify-start text-muted-foreground",
              isRTL && "flex-row-reverse"
            )}
          >
            <Search className="h-4 w-4 mr-2" />
            <span>{t('header.search') || 'Search...'}</span>
          </Button>
        </div>

        {/* Right side actions */}
        <div className={cn(
          "flex items-center gap-2",
          isRTL && "flex-row-reverse"
        )}>
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(true)}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {notificationCount > 9 ? '9+' : notificationCount}
              </Badge>
            )}
          </Button>

          {/* Messages/Conversations */}
          <ConversationsDropdown>
            <Button variant="ghost" size="icon">
              <MessageCircle className="h-5 w-5" />
            </Button>
          </ConversationsDropdown>

          {/* User Profile */}
          <div className={cn(
            "flex items-center gap-2 text-sm",
            isRTL && "flex-row-reverse"
          )}>
            <span className="font-medium">
              {userProfile?.company_name || userProfile?.full_name || t('header.welcome')}
            </span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SearchModal 
        open={showSearch} 
        onOpenChange={setShowSearch} 
      />
      
      <NotificationsModal 
        open={showNotifications} 
        onOpenChange={setShowNotifications} 
      />
    </>
  );
};
