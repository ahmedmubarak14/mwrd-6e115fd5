
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard,
  Users,
  FileText,
  Package,
  ShoppingCart,
  CreditCard,
  Settings,
  HelpCircle,
  MessageSquare,
  BarChart3,
  UserCheck,
  FolderOpen,
  Building2,
  Ticket,
  Crown
} from "lucide-react";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  className?: string;
}

export const AdminSidebar = ({ className }: AdminSidebarProps) => {
  const location = useLocation();
  const { getPendingTicketsCount } = useSupportTickets();
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };
  const pendingTickets = getPendingTicketsCount();

  const navigation = [
    {
      name: t('admin.dashboard'),
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: t('admin.users'),
      href: "/admin/users",
      icon: Users,
    },
    {
      name: t('admin.requests'),
      href: "/admin/requests",
      icon: FileText,
    },
    {
      name: t('admin.offers'),
      href: "/admin/offers",
      icon: Package,
    },
    {
      name: t('admin.projects'),
      href: "/admin/projects", 
      icon: Building2,
    },
    {
      name: t('admin.orders'),
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      name: t('admin.financialTransactions'),
      href: "/admin/financial-transactions",
      icon: CreditCard,
    },
    {
      name: t('admin.subscriptions'),
      href: "/admin/subscriptions",
      icon: Crown,
    },
    {
      name: t('admin.supportTickets'),
      href: "/admin/support",
      icon: Ticket,
      badge: pendingTickets > 0 ? pendingTickets : undefined,
      badgeVariant: "destructive" as const,
    },
    {
      name: t('admin.expertConsultations'),
      href: "/admin/content/consultations",
      icon: HelpCircle,
    },
    {
      name: t('admin.categoryManagement'),
      href: "/admin/category-management",
      icon: FolderOpen,
    },
    {
      name: t('admin.verificationQueue'),
      href: "/admin/verification",
      icon: UserCheck,
    },
    {
      name: t('admin.analytics'),
      href: "/admin/analytics",
      icon: BarChart3,
    },
  ];

  return (
    <div className={cn(
      "w-64 border-r bg-card h-full flex-shrink-0 transition-all duration-200",
      className
    )} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center justify-between border-b px-4">
          <h2 className="text-lg font-semibold truncate">
            {t('admin.title')}
          </h2>
        </div>
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 py-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const isParentActive = location.pathname.startsWith(item.href) && item.href !== '/admin/dashboard';
              const activeState = isActive || isParentActive;
              
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={activeState ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start h-11 transition-all duration-300 group relative overflow-hidden",
                      "hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg",
                      activeState 
                        ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg border-l-4 border-l-primary-foreground/30 font-semibold" 
                        : "hover:bg-gradient-to-r hover:from-accent/70 hover:to-accent/50 hover:text-accent-foreground font-medium hover:shadow-md",
                      isRTL && "flex-row-reverse border-r-4 border-l-0 border-r-primary-foreground/30"
                    )}
                  >
                    <div className="flex items-center gap-3 px-3 w-full z-10">
                      <item.icon className={cn(
                        "h-4 w-4 shrink-0 transition-all duration-300",
                        activeState ? "text-primary-foreground drop-shadow-sm" : "text-muted-foreground group-hover:text-accent-foreground group-hover:scale-110"
                      )} />
                      <span className="flex-1 truncate text-sm transition-all duration-300">{item.name}</span>
                      {item.badge && (
                        <Badge 
                          variant={item.badgeVariant || "secondary"} 
                          className={cn(
                            "h-5 w-5 p-0 text-xs flex-shrink-0 transition-all duration-300",
                            activeState ? "animate-pulse shadow-lg" : "animate-bounce"
                          )}
                        >
                          {item.badge > 99 ? '99+' : item.badge}
                        </Badge>
                      )}
                    </div>
                    {/* Active indicator */}
                    {activeState && (
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-r from-primary-foreground/10 to-transparent opacity-20",
                        isRTL && "from-transparent to-primary-foreground/10"
                      )} />
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
