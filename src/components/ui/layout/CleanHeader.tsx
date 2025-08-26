import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Menu, Search, Bell, User, Settings, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CleanHeaderProps {
  onMobileMenuOpen?: () => void;
}

export const CleanHeader = ({ onMobileMenuOpen }: CleanHeaderProps) => {
  const { user, userProfile, signOut } = useAuth();
  const { t, isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileMenuOpen}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <Link to="/vendor-dashboard" className="flex items-center">
          <span className="text-xl font-semibold text-gray-900">MWRD</span>
        </Link>
      </div>

      <div className="flex-1 max-w-md mx-8 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t('common.search')}
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userProfile?.avatar_url} alt={userProfile?.full_name} />
                <AvatarFallback className="bg-gray-100 text-gray-600">
                  {userProfile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg" align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium text-sm text-gray-900">{userProfile?.full_name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center text-gray-700 hover:text-gray-900">
                <User className="mr-2 h-4 w-4" />
                <span>{t('nav.profile')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center text-gray-700 hover:text-gray-900">
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('nav.settings')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('auth.signOut')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
