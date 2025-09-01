import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VendorUserProfileProps {
  variant?: 'sidebar' | 'mobile';
  collapsed?: boolean;
}

export const VendorUserProfile = ({ variant = 'sidebar', collapsed = false }: VendorUserProfileProps) => {
  const { user, userProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const { isRTL } = languageContext || { isRTL: false };

  if (!user || !userProfile) return null;

  const displayName = userProfile.full_name || user.email?.split('@')[0] || 'Vendor';
  const companyName = userProfile.company_name || 'Company';
  const role = userProfile.role || 'vendor';
  const initials = displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (variant === 'mobile') {
    return (
      <div className={cn(
        "flex items-center gap-3 p-4 border-b border-border",
        isRTL && "flex-row-reverse"
      )}>
        <Avatar className="h-12 w-12">
          <AvatarImage src={userProfile.avatar_url} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className={cn(
          "flex flex-col min-w-0 flex-1",
          isRTL && "text-right"
        )}>
          <span className="font-semibold text-foreground truncate text-base">
            {displayName}
          </span>
          <span className="text-sm text-muted-foreground truncate">
            {companyName}
          </span>
          <Badge variant="secondary" className="w-fit mt-1 text-xs capitalize">
            {role}
          </Badge>
        </div>
      </div>
    );
  }

  if (collapsed) {
    return (
      <div className="flex items-center justify-center w-full">
        <Avatar className="h-8 w-8">
          <AvatarImage src={userProfile.avatar_url} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 w-full",
      isRTL && "flex-row-reverse"
    )}>
      <Avatar className="h-10 w-10">
        <AvatarImage src={userProfile.avatar_url} />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className={cn(
        "flex flex-col min-w-0 flex-1",
        isRTL && "text-right"
      )}>
        <span className="font-semibold text-foreground truncate text-sm">
          {displayName}
        </span>
        <span className="text-xs text-muted-foreground truncate">
          {companyName}
        </span>
        <Badge variant="secondary" className="w-fit mt-0.5 text-xs capitalize">
          {role}
        </Badge>
      </div>
      {userProfile.user_id && (
        <div className="text-xs text-muted-foreground">
          ID: {userProfile.user_id.slice(-4)}
        </div>
      )}
    </div>
  );
};