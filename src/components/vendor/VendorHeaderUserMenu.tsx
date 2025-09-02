import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Settings, 
  LogOut, 
  FileText,
  ChevronDown,
  UserCheck
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface VendorHeaderUserMenuProps {
  userProfile?: any;
}

export const VendorHeaderUserMenu = ({ userProfile }: VendorHeaderUserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const displayName = userProfile?.full_name || user?.email?.split('@')[0] || 'Vendor';
  const email = user?.email || '';
  const companyName = userProfile?.company_name || 'Company';
  const role = userProfile?.role || 'vendor';
  
  const initials = displayName
    .split(' ')
    .map((name: string) => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const isVerified = userProfile?.cr_verification_status === 'verified';

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            "h-9 gap-2 px-2 hover:bg-accent/50 transition-all duration-200",
            isRTL && "flex-row-reverse"
          )}
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={userProfile?.avatar_url} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className={cn(
          "w-64 p-2",
          isRTL && "text-right"
        )} 
        align={isRTL ? "start" : "end"}
      >
        {/* User Info Header */}
        <DropdownMenuLabel className={cn(
          "p-3 border border-border rounded-lg bg-muted/30",
          isRTL && "text-right"
        )}>
          <div className={cn(
            "flex items-center gap-3",
            isRTL && "flex-row-reverse"
          )}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={userProfile?.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className={cn(
              "flex flex-col min-w-0 flex-1",
              isRTL && "text-right"
            )}>
              <p className="font-semibold text-foreground truncate">
                {displayName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {email}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {companyName}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge variant="secondary" className="text-xs capitalize">
                  {role}
                </Badge>
                {isVerified && (
                  <Badge variant="default" className="text-xs">
                    <UserCheck className="h-3 w-3 mr-1" />
                    {t('common.verified')}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Navigation Items */}
        <DropdownMenuItem 
          onClick={() => {
            navigate('/profile');
            setIsOpen(false);
          }}
          className={cn(
            "cursor-pointer gap-2 p-2",
            isRTL && "flex-row-reverse"
          )}
        >
          <User className="h-4 w-4" />
          {t('nav.profile')}
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => {
            navigate('/vendor/cr-management');
            setIsOpen(false);
          }}
          className={cn(
            "cursor-pointer gap-2 p-2",
            isRTL && "flex-row-reverse"
          )}
        >
          <FileText className="h-4 w-4" />
          {t('vendor.navigation.crManagement')}
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => {
            navigate('/settings');
            setIsOpen(false);
          }}
          className={cn(
            "cursor-pointer gap-2 p-2",
            isRTL && "flex-row-reverse"
          )}
        >
          <Settings className="h-4 w-4" />
          {t('nav.settings')}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Sign Out */}
        <DropdownMenuItem 
          onClick={handleSignOut}
          className={cn(
            "cursor-pointer gap-2 p-2 text-destructive focus:text-destructive",
            isRTL && "flex-row-reverse"
          )}
        >
          <LogOut className="h-4 w-4" />
          {t('nav.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};