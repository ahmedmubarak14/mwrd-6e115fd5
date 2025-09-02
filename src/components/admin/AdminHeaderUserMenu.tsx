import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, User, LogOut, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AdminHeaderUserMenuProps {
  userProfile: any;
}

export const AdminHeaderUserMenu = ({ userProfile }: AdminHeaderUserMenuProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { t, isRTL, language, setLanguage } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2 rounded-lg h-8">
          <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
            {userProfile?.full_name?.[0] || userProfile?.email?.[0] || 'A'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-medium leading-none">
              {userProfile?.full_name || userProfile?.email?.split('@')[0] || t('admin.adminUser')}
            </p>
            <p className="text-xs text-foreground opacity-75 capitalize">
              {userProfile?.role}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-56">
        <DropdownMenuItem onClick={() => navigate('/profile')} className={cn("flex items-center", isRTL && "flex-row-reverse")}>
          <User className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
          <span>{t('common.profile')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')} className={cn("flex items-center", isRTL && "flex-row-reverse")}>
          <Settings className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
          <span>{t('common.settings')}</span>
        </DropdownMenuItem>
        {isMobile && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className={cn("flex items-center", isRTL && "flex-row-reverse")}>
              <Globe className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              <span>{language === 'en' ? t('admin.languageArabic') : t('admin.languageEnglish')}</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className={cn("flex items-center text-destructive", isRTL && "flex-row-reverse")}>
          <LogOut className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
          <span>{t('common.signOut')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};