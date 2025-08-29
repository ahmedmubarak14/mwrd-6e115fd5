import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
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
  Crown,
  User,
  ChevronDown,
  ChevronRight,
  Menu,
  Activity,
  Bot,
  Zap
} from "lucide-react";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { AdminUserProfile } from "./AdminUserProfile";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

interface NavigationGroup {
  id: string;
  label: string;
  priority: 'primary' | 'secondary' | 'utility';
  items: {
    name: string;
    href: string;
    icon: React.ElementType;
    badge?: number;
    badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  }[];
}

export const AdminSidebar = ({ className, collapsed = false, onToggle }: AdminSidebarProps) => {
  const location = useLocation();
  const { getPendingTicketsCount } = useSupportTickets();
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };
  const pendingTickets = getPendingTicketsCount();

  // Track which groups are expanded with localStorage persistence
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('adminSidebarExpanded');
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch {
        return new Set(['overview', 'management']); // Default groups
      }
    }
    return new Set(['overview', 'management']); // Default groups
  });

  const toggleGroup = (groupId: string) => {
    if (collapsed) return; // Don't allow toggling when collapsed
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
    // Persist to localStorage
    localStorage.setItem('adminSidebarExpanded', JSON.stringify(Array.from(newExpanded)));
  };

  const navigationGroups: NavigationGroup[] = [
    {
      id: 'overview',
      label: t('admin.groups.overview') || 'Overview',
      priority: 'primary',
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
        {
          name: 'Real-Time Monitor',
          href: "/admin/real-time-monitor",
          icon: Activity,
        },
        {
          name: 'Performance Monitor',
          href: "/admin/performance-monitor",
          icon: Zap,
        },
      ]
    },
    {
      id: 'management',
      label: t('admin.groups.management') || 'Management',
      priority: 'primary',
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
        {
          name: 'Automation Center',
          href: "/admin/automation",
          icon: Bot,
        },
      ]
    },
    {
      id: 'business',
      label: t('admin.groups.business') || 'Business & Support',
      priority: 'secondary',
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
      priority: 'utility',
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

  const getGroupPriorityStyles = (priority: NavigationGroup['priority']) => {
    switch (priority) {
      case 'primary':
        return "border-l-2 border-l-primary/20 bg-primary/5";
      case 'secondary':
        return "border-l-2 border-l-accent/20 bg-accent/5";
      case 'utility':
        return "border-l-2 border-l-muted-foreground/20 bg-muted/50";
      default:
        return "";
    }
  };

  return (
    <div 
      className={cn(
        "flex flex-col h-screen bg-card border-r border-border transition-all duration-300 shadow-sm fixed left-0 top-0 z-50",
        collapsed ? "w-16" : "w-64",
        className
      )} 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Sidebar Header - matches main header height */}
      <div className="border-b border-border bg-card h-16 flex items-center px-4">
        <AdminUserProfile variant="sidebar" collapsed={collapsed} />
      </div>

      {/* Navigation Content */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {navigationGroups.map((group) => {
            const isExpanded = collapsed ? false : expandedGroups.has(group.id);
            const hasActiveItem = group.items.some(item => 
              isActive(item.href) || isParentActive(item.href)
            );

            return (
              <div 
                key={group.id} 
                className={cn(
                  "rounded-lg transition-all duration-200",
                  getGroupPriorityStyles(group.priority)
                )}
              >
                {/* Group Label */}
                {!collapsed && (
                  <Button
                    variant="ghost"
                    onClick={() => toggleGroup(group.id)}
                    className={cn(
                      "w-full justify-between px-3 py-2 h-auto font-medium",
                      "text-xs uppercase tracking-wider",
                      "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                      hasActiveItem && "text-primary font-semibold"
                    )}
                    type="button"
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
                  </Button>
                )}

                {/* Group Items */}
                <div 
                  className={cn(
                    "space-y-1 transition-all duration-300",
                    collapsed ? "block" : (isExpanded ? "block" : "hidden"),
                    !collapsed && "px-2 pb-2"
                  )}
                >
                  {group.items.map((item) => {
                    const active = isActive(item.href) || isParentActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                          "text-sm font-medium hover:bg-accent/50",
                          collapsed ? "justify-center px-2" : "justify-start",
                          active 
                            ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                        )}
                        title={collapsed ? item.name : undefined}
                        aria-label={`Navigate to ${item.name}`}
                        aria-current={active ? 'page' : undefined}
                      >
                        <item.icon 
                          className={cn(
                            "shrink-0 transition-all duration-200",
                            collapsed ? "h-5 w-5" : "h-4 w-4",
                            active ? "text-primary" : "text-muted-foreground"
                          )} 
                        />
                        
                        {!collapsed && (
                          <>
                            <span className="truncate flex-1 text-foreground">
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
                          </>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};