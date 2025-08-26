
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Search, Bell, MessageSquare, User, Settings, LogOut, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SearchModal } from "@/components/modals/SearchModal";
import { NotificationsModal } from "@/components/modals/NotificationsModal";
import { ConversationsDropdown } from "@/components/conversations/ConversationsDropdown";
import { UnifiedVerificationStatus } from "@/components/verification/UnifiedVerificationStatus";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMobileMenuOpen?: () => void;
}

export const Header = ({ onMobileMenuOpen }: HeaderProps) => {
  const { signOut, userProfile } = useAuth();
  const { t, isRTL } = useLanguage();
  const isMobile = useIsMobile();

  // Check if we're in a sidebar context
  let sidebarContext;
  try {
    sidebarContext = useSidebar();
  } catch {
    // Not in sidebar context
    sidebarContext = null;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  const userInitials = userProfile?.full_name
    ?.split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      "safe-area-pt"
    )}>
      <div className={cn(
        "container flex h-14 max-w-screen-2xl items-center px-4",
        isRTL ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Left Section (RTL: Right Section) */}
        <div className={cn(
          "flex items-center gap-4",
          isRTL ? "flex-row-reverse order-last" : "flex-row order-first"
        )}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMobileMenuOpen}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">{t('common.menu')}</span>
            </Button>
          )}

          {/* Logo/Brand */}
          <Link to="/landing" className="flex items-center">
            <img 
              src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
              alt="MWRD Logo" 
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Center Section - Search */}
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-md">
            <SearchModal>
              <Button
                variant="outline"
                className={cn(
                  "relative w-full justify-start text-sm text-muted-foreground",
                  isRTL ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Search className="h-4 w-4" />
                <span className={cn("ml-2", isRTL && "mr-2 ml-0")}>{t('common.search')}</span>
              </Button>
            </SearchModal>
          </div>
        </div>

        {/* Right Section (RTL: Left Section) */}
        <div className={cn(
          "flex items-center gap-2",
          isRTL ? "flex-row-reverse order-first" : "flex-row order-last"
        )}>
          {/* Verification Status - Mobile Compact */}
          {isMobile && (
            <UnifiedVerificationStatus compact={true} />
          )}

          {/* Desktop Action Buttons */}
          {!isMobile && (
            <>
              <NotificationsModal>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  <Badge
                    variant="destructive"
                    className={cn(
                      "absolute h-5 w-5 rounded-full p-0 text-xs",
                      isRTL ? "-left-1 -top-1" : "-right-1 -top-1"
                    )}
                  >
                    3
                  </Badge>
                </Button>
              </NotificationsModal>

              <ConversationsDropdown>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </ConversationsDropdown>
            </>
          )}

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={userProfile?.avatar_url} 
                    alt={userProfile?.full_name || 'User'} 
                  />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56" 
              align={isRTL ? "start" : "end"} 
              forceMount
            >
              <div className={cn(
                "flex items-center justify-start gap-2 p-2",
                isRTL && "flex-row-reverse text-right"
              )}>
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={userProfile?.avatar_url} 
                    alt={userProfile?.full_name || 'User'} 
                  />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className={cn(
                  "flex flex-col space-y-1 leading-none",
                  isRTL && "text-right"
                )}>
                  <p className="font-medium">{userProfile?.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {userProfile?.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/" className={cn(
                  "flex items-center",
                  isRTL && "flex-row-reverse text-right"
                )}>
                  <Home className={cn("h-4 w-4", isRTL ? "ml-2 mr-0" : "mr-2")} />
                  <span>{t('nav.home')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile" className={cn(
                  "flex items-center",
                  isRTL && "flex-row-reverse text-right"
                )}>
                  <User className={cn("h-4 w-4", isRTL ? "ml-2 mr-0" : "mr-2")} />
                  <span>{t('nav.profile')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className={cn(
                  "flex items-center",
                  isRTL && "flex-row-reverse text-right"
                )}>
                  <Settings className={cn("h-4 w-4", isRTL ? "ml-2 mr-0" : "mr-2")} />
                  <span>{t('nav.settings')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className={cn(
                "flex items-center",
                isRTL && "flex-row-reverse text-right"
              )}>
                <LogOut className={cn("h-4 w-4", isRTL ? "ml-2 mr-0" : "mr-2")} />
                <span>{t('auth.signOut')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Desktop Verification Status Banner */}
      {!isMobile && (
        <UnifiedVerificationStatus 
          showActions={true}
          showAccessLevels={false}
          compact={false}
        />
      )}
    </header>
  );
};
