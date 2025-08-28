import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard,
  FolderOpen,
  FileText,
  Package,
  ShoppingCart,
  MessageSquare,
  Settings,
  HelpCircle,
  BarChart3,
  Building2,
  Users,
  User,
  ChevronDown,
  ChevronRight,
  CreditCard
} from "lucide-react";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { ClientUserProfile } from "./ClientUserProfile";

interface ClientSidebarProps {
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
    badgeVariant?: "default" | "secondary" | "destructive" | "success" | "warning";
  }[];
}

export const ClientSidebar = ({ className, collapsed = false, onToggle }: ClientSidebarProps) => {
  const location = useLocation();
  const { userProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  // Track which groups are expanded with localStorage persistence
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('clientSidebarExpanded');
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch {
        return new Set(['overview', 'workspace']); // Default groups
      }
    }
    return new Set(['overview', 'workspace']); // Default groups
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
    localStorage.setItem('clientSidebarExpanded', JSON.stringify(Array.from(newExpanded)));
  };

  const navigationGroups: NavigationGroup[] = [
    {
      id: 'overview',
      label: 'Overview',
      priority: 'primary',
      items: [
        {
          name: 'Dashboard',
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          name: 'Analytics',
          href: "/analytics",
          icon: BarChart3,
        },
      ]
    },
    {
      id: 'workspace',
      label: 'Workspace',
      priority: 'primary',
      items: [
        {
          name: 'Projects',
          href: "/projects",
          icon: Building2,
        },
        {
          name: 'Requests',
          href: "/requests",
          icon: FileText,
        },
        ...(userProfile?.role === 'vendor' ? [
          {
            name: 'Browse Requests',
            href: "/browse-requests",
            icon: FolderOpen,
          },
          {
            name: 'My Offers',
            href: "/my-offers",
            icon: Package,
          },
        ] : []),
        {
          name: 'Orders',
          href: "/orders",
          icon: ShoppingCart,
        },
        {
          name: 'Messages',
          href: "/messages",
          icon: MessageSquare,
        },
      ]
    },
    {
      id: 'network',
      label: 'Network',
      priority: 'secondary',
      items: [
        {
          name: 'Vendors',
          href: "/vendors",
          icon: Users,
        },
      ]
    },
    {
      id: 'account',
      label: 'Account & Support',
      priority: 'utility',
      items: [
        {
          name: 'Profile',
          href: "/profile",
          icon: User,
        },
        {
          name: 'Subscription',
          href: "/manage-subscription",
          icon: CreditCard,
        },
        {
          name: 'Settings',
          href: "/settings",
          icon: Settings,
        },
        {
          name: 'Support',
          href: "/support",
          icon: HelpCircle,
        },
      ]
    },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (path: string) => location.pathname.startsWith(path) && path !== '/dashboard';

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
        "flex flex-col h-screen bg-card border-r border-border transition-all duration-300 shadow-sm fixed left-0 top-0 z-40",
        collapsed ? "w-16" : "w-64",
        className
      )} 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Sidebar Header - User Profile */}
      <div className="border-b border-border bg-card min-h-16 flex items-center">
        <ClientUserProfile 
          variant="sidebar" 
          collapsed={collapsed}
        />
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