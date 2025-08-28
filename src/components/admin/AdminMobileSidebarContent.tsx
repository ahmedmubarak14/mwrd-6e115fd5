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

  // Use the same navigation structure as desktop sidebar
  const navigationGroups = [
    {
      id: 'overview',
      label: t('admin.groups.overview') || 'Overview',
      items: [
        {
          name: t('admin.dashboard') || 'Dashboard',
          href: "/admin/dashboard",
          icon: LayoutDashboard,
        },
        {
          name: t('admin.analytics') || 'Analytics',
          href: "/admin/analytics",
          icon: BarChart3,
        },
      ]
    },
    {
      id: 'management',
      label: t('admin.groups.management') || 'Management',
      items: [
        {
          name: t('admin.users') || 'Users',
          href: "/admin/users",
          icon: Users,
        },
        {
          name: t('admin.requests') || 'Requests',
          href: "/admin/requests",
          icon: FileText,
        },
        {
          name: t('admin.offers') || 'Offers',
          href: "/admin/offers",
          icon: Package,
        },
        {
          name: t('admin.projects') || 'Projects',
          href: "/admin/projects", 
          icon: Building2,
        },
        {
          name: t('admin.orders') || 'Orders',
          href: "/admin/orders",
          icon: ShoppingCart,
        },
        {
          name: t('admin.verificationQueue') || 'Verification',
          href: "/admin/verification",
          icon: UserCheck,
        },
      ]
    },
    {
      id: 'business',
      label: t('admin.groups.business') || 'Business & Support',
      items: [
        {
          name: t('admin.financialTransactions') || 'Financial Transactions',
          href: "/admin/financial-transactions",
          icon: CreditCard,
        },
        {
          name: t('admin.subscriptions') || 'Subscriptions',
          href: "/admin/subscriptions",
          icon: Crown,
        },
        {
          name: t('admin.supportTickets') || 'Support',
          href: "/admin/support",
          icon: Ticket,
          badge: pendingTickets > 0 ? pendingTickets : undefined,
          badgeVariant: "destructive" as const,
        },
        {
          name: t('admin.communications') || 'Communications',
          href: "/admin/communications",
          icon: MessageSquare,
        },
      ]
    },
    {
      id: 'system',
      label: t('admin.groups.system') || 'System & Settings',
      items: [
        {
          name: t('admin.categoryManagement') || 'Categories',
          href: "/admin/category-management",
          icon: FolderOpen,
        },
        {
          name: t('admin.expertConsultations') || 'Expert Consultations',
          href: "/admin/content/consultations",
          icon: HelpCircle,
        },
        {
          name: t('admin.settings') || 'Settings',
          href: "/admin/settings",
          icon: Settings,
        },
        {
          name: t('admin.profile') || 'Profile',
          href: "/admin/profile",
          icon: User,
        },
      ]
    },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (path: string) => location.pathname.startsWith(path) && path !== '/admin/dashboard';

  return (
    <div className="flex h-full flex-col bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <SidebarHeader className="border-b border-border bg-background p-4">
        <AdminUserProfile variant="mobile" />
      </SidebarHeader>
      
      <SidebarContent className="flex-1 overflow-y-auto">
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.id} className="mb-4">
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-4 py-2 font-medium">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="px-2" role="menu" aria-label={`${group.label} navigation`}>
                {group.items.map((item) => {
                  const active = isActive(item.href) || isParentActive(item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild
                        isActive={active}
                        className={cn(
                          "group relative transition-all duration-200 h-12 px-3 mb-1",
                          active && "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                        )}
                      >
                        <Link 
                          to={item.href} 
                          className="flex items-center gap-3 w-full"
                          onClick={onItemClick}
                          aria-label={`Navigate to ${item.name}`}
                          role="menuitem"
                        >
                          <item.icon className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            active ? "text-primary" : "text-neutral-600"
                          )} />
                          <span className="truncate flex-1 text-sm font-medium text-foreground">
                            {item.name}
                          </span>
                          {item.badge && item.badge > 0 && (
                            <Badge 
                              variant={item.badgeVariant || "secondary"} 
                              className={cn(
                                "h-5 min-w-5 px-1.5 text-xs flex items-center justify-center shrink-0",
                                item.badgeVariant === "destructive" && "animate-pulse"
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
        ))}
      </SidebarContent>
    </div>
  );
};