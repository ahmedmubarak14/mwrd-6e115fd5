
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
      <div className="container flex h-14 max-w-screen-2xl items-center px-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Desktop Sidebar Trigger or Mobile Menu */}
          {isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMobileMenuOpen}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">{t('common.menu')}</span>
            </Button>
          ) : sidebarContext ? (
            <SidebarTrigger />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMobileMenuOpen}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">{t('common.menu')}</span>
            </Button>
          )}

          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">S</span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              Supplify
            </span>
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
                  isRTL && "flex-row-reverse"
                )}
              >
                <Search className="h-4 w-4" />
                <span className="ml-2">{t('common.search')}</span>
              </Button>
            </SearchModal>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
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
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
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
              <div className="flex items-center justify-start gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={userProfile?.avatar_url} 
                    alt={userProfile?.full_name || 'User'} 
                  />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{userProfile?.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {userProfile?.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/" className="flex items-center">
                  <Home className="mr-2 h-4 w-4" />
                  <span>{t('nav.home')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>{t('nav.profile')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t('nav.settings')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
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
