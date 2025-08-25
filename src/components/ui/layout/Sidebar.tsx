
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Users,
  MessageSquare,
  BarChart3,
  ShoppingCart,
  CreditCard,
  HelpCircle,
  Settings
} from "lucide-react";

interface SidebarProps {
  userRole?: 'client' | 'vendor' | 'admin';
  userProfile?: any;
}

export const Sidebar = ({ userRole }: SidebarProps) => {
  const { t, isRTL } = useLanguage();
  const location = useLocation();

  // Navigation items with fallback text
  const navigationItems = [
    {
      label: t('nav.dashboard') || 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: t('nav.projects') || 'Projects',
      href: '/projects',
      icon: FolderOpen,
    },
    {
      label: t('nav.requests') || 'Requests',
      href: '/requests',
      icon: FileText,
    },
    {
      label: t('nav.suppliers') || 'Suppliers',
      href: '/vendors',
      icon: Users,
    },
    {
      label: t('nav.messages') || 'Messages',
      href: '/messages',
      icon: MessageSquare,
    },
    {
      label: t('nav.analytics') || 'Analytics',
      href: '/analytics',
      icon: BarChart3,
    },
    {
      label: t('nav.orders') || 'Orders',
      href: '/orders',
      icon: ShoppingCart,
    },
    {
      label: t('nav.manageSubscription') || 'Subscription',
      href: '/manage-subscription',
      icon: CreditCard,
    },
    {
      label: t('nav.support') || 'Support',
      href: '/support',
      icon: HelpCircle,
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cn(
      "w-64 bg-card border-r border-border h-full flex flex-col",
      isRTL && "border-l border-r-0"
    )}>
      <div className="p-6">
        <h2 className={cn(
          "text-lg font-semibold",
          isRTL && "text-right"
        )}>
          {t('nav.menu') || 'Menu'}
        </h2>
      </div>
      
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                asChild
                variant={isActive(item.href) ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  isRTL && "justify-end flex-row-reverse"
                )}
              >
                <Link to={item.href}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-1">
          <Button
            asChild
            variant={isActive('/settings') ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-10",
              isRTL && "justify-end flex-row-reverse"
            )}
          >
            <Link to="/settings">
              <Settings className="h-4 w-4" />
              <span>{t('nav.settings') || 'Settings'}</span>
            </Link>
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};
