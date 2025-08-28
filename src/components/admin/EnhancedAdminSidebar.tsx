import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
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
  User,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { AdminUserProfile } from "./AdminUserProfile";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  className?: string;
}

interface NavigationGroup {
  id: string;
  label: string;
  icon?: React.ElementType;
  defaultOpen?: boolean;
  priority: 'primary' | 'secondary' | 'utility';
  items: {
    name: string;
    href: string;
    icon: React.ElementType;
    badge?: number;
    badgeVariant?: "default" | "secondary" | "destructive" | "success" | "warning";
  }[];
}

export const EnhancedAdminSidebar = ({ className }: AdminSidebarProps) => {
  const location = useLocation();
  const { getPendingTicketsCount } = useSupportTickets();
  const { state } = useSidebar();
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };
  const pendingTickets = getPendingTicketsCount();

  // Track which groups are expanded
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(['core', 'management']) // Core and Management open by default
  );

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const navigationGroups: NavigationGroup[] = [
    {
      id: 'core',
      label: t('admin.groups.core') || 'Core',
      priority: 'primary',
      defaultOpen: true,
      items: [
        {
          name: t('admin.dashboard'),
          href: "/admin/dashboard",
          icon: LayoutDashboard,
        },
        {
          name: t('admin.analytics'),
          href: "/admin/analytics",
          icon: BarChart3,
        },
      ]
    },
    {
      id: 'management',
      label: t('admin.groups.management') || 'Management',
      priority: 'primary',
      defaultOpen: true,
      items: [
        {
          name: t('admin.users'),
          href: "/admin/users",
          icon: Users,
        },
        {
          name: t('admin.verificationQueue'),
          href: "/admin/verification",
          icon: UserCheck,
        },
        {
          name: t('admin.communications'),
          href: "/admin/communications",
          icon: MessageSquare,
        },
      ]
    },
    {
      id: 'content',
      label: t('admin.groups.content') || 'Content',
      priority: 'secondary',
      items: [
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
      ]
    },
    {
      id: 'business',
      label: t('admin.groups.business') || 'Business',
      priority: 'secondary',
      items: [
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
      ]
    },
    {
      id: 'system',
      label: t('admin.groups.system') || 'System',
      priority: 'utility',
      items: [
        {
          name: t('admin.categoryManagement'),
          href: "/admin/category-management",
          icon: FolderOpen,
        },
        {
          name: t('admin.expertConsultations'),
          href: "/admin/content/consultations",
          icon: HelpCircle,
        },
        {
          name: t('admin.settings'),
          href: "/admin/settings",
          icon: Settings,
        },
      ]
    },
    {
      id: 'personal',
      label: t('admin.groups.personal') || 'Personal',
      priority: 'utility',
      items: [
        {
          name: t('admin.profile'),
          href: "/admin/profile",
          icon: User,
        },
      ]
    },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (path: string) => location.pathname.startsWith(path) && path !== '/admin/dashboard';

  const getGroupPriorityStyles = (priority: NavigationGroup['priority']) => {
    switch (priority) {
      case 'primary':
        return "border-l-2 border-l-primary/20 bg-primary/5";
      case 'secondary':
        return "border-l-2 border-l-accent/20 bg-accent/5";
      case 'utility':
        return "border-l-2 border-l-muted-foreground/10";
      default:
        return "";
    }
  };

  return (
    <Sidebar 
      className={cn("border-sidebar-border", className)} 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar">
        <AdminUserProfile 
          variant="sidebar" 
          collapsed={state === "collapsed"} 
        />
      </SidebarHeader>
      
      <SidebarContent className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted">
        {navigationGroups.map((group) => {
          const isExpanded = state === "collapsed" ? false : expandedGroups.has(group.id);
          const hasActiveItem = group.items.some(item => 
            isActive(item.href) || isParentActive(item.href)
          );

          return (
            <SidebarGroup key={group.id} className={cn(
              "transition-all duration-300",
              getGroupPriorityStyles(group.priority)
            )}>
              {state !== "collapsed" && (
                <SidebarGroupLabel 
                  className={cn(
                    "flex items-center justify-between cursor-pointer group",
                    "text-xs uppercase tracking-wider font-medium px-3 py-2 mb-1",
                    "hover:bg-accent/10 rounded-md transition-all duration-200",
                    hasActiveItem && "text-primary font-semibold"
                  )}
                  onClick={() => toggleGroup(group.id)}
                >
                  <span className="flex items-center gap-2">
                    <span>{group.label}</span>
                    {hasActiveItem && (
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    )}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3 transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="h-3 w-3 transition-transform duration-200" />
                  )}
                </SidebarGroupLabel>
              )}

              <SidebarGroupContent 
                className={cn(
                  "transition-all duration-300 overflow-hidden",
                  state === "collapsed" ? "block" : (isExpanded ? "animate-accordion-down" : "animate-accordion-up"),
                  !isExpanded && state !== "collapsed" && "hidden"
                )}
              >
                <SidebarMenu>
                  {group.items.map((item) => {
                    const active = isActive(item.href) || isParentActive(item.href);
                    return (
                      <SidebarMenuItem key={item.href} className="mb-0.5">
                        <SidebarMenuButton 
                          asChild
                          isActive={active}
                          tooltip={state === "collapsed" ? item.name : undefined}
                          className={cn(
                            "group relative transition-all duration-200 hover-scale",
                            "hover:bg-sidebar-accent/10 hover:text-sidebar-accent-foreground",
                            active && "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm",
                            state === "collapsed" ? "justify-center px-2" : "px-3 py-2"
                          )}
                        >
                          <Link 
                            to={item.href} 
                            className={cn(
                              "flex items-center gap-3 w-full min-w-0",
                              state === "collapsed" && "justify-center"
                            )}
                          >
                            <item.icon className={cn(
                              "shrink-0 transition-all duration-200",
                              state === "collapsed" ? "h-5 w-5" : "h-4 w-4",
                              active ? "text-sidebar-accent-foreground scale-110" : "text-muted-foreground group-hover:text-sidebar-accent group-hover:scale-105"
                            )} />
                            
                            {state !== "collapsed" && (
                              <>
                                <span className="truncate flex-1 transition-all duration-200">
                                  {item.name}
                                </span>
                                
                                {item.badge && item.badge > 0 && (
                                  <Badge 
                                    variant={item.badgeVariant || "secondary"} 
                                    className={cn(
                                      "h-5 min-w-5 px-1.5 text-xs flex items-center justify-center shrink-0",
                                      "transition-all duration-200 group-hover:scale-105",
                                      item.badgeVariant === "destructive" && "animate-pulse bg-destructive/90"
                                    )}
                                  >
                                    {item.badge > 99 ? '99+' : item.badge}
                                  </Badge>
                                )}
                              </>
                            )}

                            {/* Active indicator */}
                            {active && (
                              <div className={cn(
                                "absolute inset-0 bg-gradient-to-r from-sidebar-accent/5 to-transparent",
                                "opacity-50 rounded-md pointer-events-none",
                                isRTL && "from-transparent to-sidebar-accent/5"
                              )} />
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
};