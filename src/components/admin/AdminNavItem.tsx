import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';

interface AdminNavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
  badgeVariant?: "default" | "secondary" | "destructive" | "success" | "warning";
  variant?: "sidebar" | "mobile";
  onClick?: () => void;
}

export const AdminNavItem: React.FC<AdminNavItemProps> = ({
  href,
  icon: Icon,
  label,
  badge,
  badgeVariant = "secondary",
  variant = "sidebar",
  onClick
}) => {
  const location = useLocation();
  const languageContext = useOptionalLanguage();
  const { isRTL } = languageContext || { isRTL: false };
  
  const isActive = location.pathname === href;
  const isParentActive = location.pathname.startsWith(href) && href !== '/admin/dashboard';
  const activeState = isActive || isParentActive;

  const baseClasses = cn(
    "w-full justify-start transition-all duration-300 group relative overflow-hidden admin-nav-item",
    "hover:shadow-lg active:scale-[0.98]",
    activeState 
      ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg font-semibold border-l-4 border-l-primary-foreground/30" 
      : "hover:bg-gradient-to-r hover:from-accent/70 hover:to-accent/50 hover:text-accent-foreground hover:shadow-md",
    isRTL && "flex-row-reverse border-r-4 border-l-0 border-r-primary-foreground/30"
  );

  const sizeClasses = {
    sidebar: "h-11 px-3",
    mobile: "h-14 px-4"
  };

  const iconClasses = cn(
    "shrink-0 transition-all duration-300",
    variant === "sidebar" ? "h-4 w-4" : "h-5 w-5",
    activeState ? "text-primary-foreground drop-shadow-sm" : "text-muted-foreground group-hover:text-accent-foreground group-hover:scale-110"
  );

  const content = (
    <div className="flex items-center gap-3 w-full z-10">
      <Icon className={iconClasses} />
      <span className="flex-1 truncate transition-all duration-300">{label}</span>
      {badge && badge > 0 && (
        <Badge 
          variant={badgeVariant} 
          size="sm"
          className={cn(
            "h-5 w-5 p-0 text-xs flex-shrink-0 transition-all duration-300",
            activeState ? "animate-pulse shadow-lg" : "animate-bounce"
          )}
        >
          {badge > 99 ? '99+' : badge}
        </Badge>
      )}
      {/* Active indicator */}
      {activeState && (
        <div className={cn(
          "absolute inset-0 bg-gradient-to-r from-primary-foreground/10 to-transparent opacity-20",
          isRTL && "from-transparent to-primary-foreground/10"
        )} />
      )}
    </div>
  );

  return (
    <Button
      variant={activeState ? "default" : "ghost"}
      className={cn(baseClasses, sizeClasses[variant])}
      asChild
    >
      <Link to={href} onClick={onClick}>
        {content}
      </Link>
    </Button>
  );
};