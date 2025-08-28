
import { useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";
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
  Crown,
  User
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
  const { state } = useSidebar();
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
      name: t('admin.communications'),
      href: "/admin/communications",
      icon: MessageSquare,
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
    {
      name: t('admin.settings'),
      href: "/admin/settings",
      icon: Settings,
    },
    {
      name: t('admin.profile'),
      href: "/admin/profile",
      icon: User,
    },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (path: string) => location.pathname.startsWith(path) && path !== '/admin/dashboard';

  return (
    <Sidebar 
      className={cn("border-sidebar-border", className)} 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex h-14 items-center justify-between px-4">
          <h2 className={cn(
            "font-semibold text-sidebar-foreground truncate",
            state === "collapsed" ? "text-xs" : "text-lg"
          )}>
            {state === "collapsed" ? t('admin.titleShort') || "Admin" : t('admin.title')}
          </h2>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-3 py-2">
            {state === "collapsed" ? "" : t('admin.navigation') || "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const active = isActive(item.href) || isParentActive(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton 
                      asChild
                      isActive={active}
                      tooltip={item.name}
                      className={cn(
                        "group relative transition-all duration-200",
                        active && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      )}
                    >
                      <a href={item.href} className="flex items-center gap-3 px-3 py-2">
                        <item.icon className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          active ? "text-sidebar-accent-foreground" : "text-muted-foreground"
                        )} />
                        <span className="truncate flex-1">
                          {item.name}
                        </span>
                        {item.badge && item.badge > 0 && (
                          <Badge 
                            variant={item.badgeVariant || "secondary"} 
                            className={cn(
                              "h-5 w-5 p-0 text-xs flex items-center justify-center shrink-0",
                              "animate-pulse"
                            )}
                          >
                            {item.badge > 99 ? '99+' : item.badge}
                          </Badge>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
