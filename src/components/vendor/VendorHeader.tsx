import { useState } from "react";
import { Menu, Search, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface VendorHeaderProps {
  userProfile?: any;
  onMobileMenuToggle: () => void;
}

export const VendorHeader = ({ userProfile, onMobileMenuToggle }: VendorHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const languageContext = useOptionalLanguage();
  const { isRTL } = languageContext || { isRTL: false };
  const t = languageContext?.t || ((key: string) => key);

  return (
    <header className="bg-background border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Mobile Menu Button & Search */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileMenuToggle}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="relative max-w-md flex-1">
            <Search className={cn(
              "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
              isRTL ? "right-3" : "left-3"
            )} />
            <Input
              placeholder={t('common.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full",
                isRTL ? "pr-10" : "pl-10"
              )}
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <LanguageSwitcher />
          <ThemeToggle />
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" asChild>
            <Link to="/notifications">
              <div className="relative">
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 text-xs p-0 flex items-center justify-center"
                >
                  3
                </Badge>
              </div>
            </Link>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                {userProfile?.avatar_url ? (
                  <img
                    src={userProfile.avatar_url}
                    alt={userProfile.full_name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align={isRTL ? "start" : "end"}>
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">
                  {userProfile?.full_name || userProfile?.company_name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {userProfile?.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Link to="/vendor/profile">
                  {t('vendor.navigation.profile')}
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/vendor/verification">
                  {t('vendor.navigation.verification')}
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  {t('vendor.navigation.settings')}
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                {t('common.signOut')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};