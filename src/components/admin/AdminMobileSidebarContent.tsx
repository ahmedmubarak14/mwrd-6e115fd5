import { Badge } from "@/components/ui/badge";
import { 
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
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
import { AdminUserProfile } from "./AdminUserProfile";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

interface AdminMobileSidebarContentProps {
  onItemClick?: () => void;
}

export const AdminMobileSidebarContent = ({ onItemClick }: AdminMobileSidebarContentProps) => {
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
    <div className="flex h-full flex-col bg-sidebar" dir={isRTL ? 'rtl' : 'ltr'}>
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar">
        <AdminUserProfile variant="mobile" />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-3 py-2">
            {t('admin.navigation') || "Navigation"}
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
                      className={cn(
                        "group relative transition-all duration-200 h-14 px-4",
                        active && "bg-accent text-accent-foreground font-medium"
                      )}
                    >
                      <Link 
                        to={item.href} 
                        className="flex items-center gap-3 px-4 py-3 w-full"
                        onClick={onItemClick}
                      >
                        <item.icon className={cn(
                          "h-5 w-5 shrink-0 transition-colors",
                          active ? "text-primary" : "text-muted-foreground"
                        )} />
                        <span className="truncate flex-1 text-foreground">
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
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </div>
  );
};