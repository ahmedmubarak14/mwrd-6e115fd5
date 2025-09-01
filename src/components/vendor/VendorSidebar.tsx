
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
  Search,
  Briefcase
} from "lucide-react";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { VendorUserProfile } from "./VendorUserProfile";

interface VendorSidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
  userRole?: 'client' | 'vendor' | 'admin';
  userProfile?: any;
  onItemClick?: () => void;
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

export const VendorSidebar = ({ className, collapsed = false, userRole, onItemClick }: VendorSidebarProps) => {
  const location = useLocation();
  const { userProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key.split('.').pop() || key, 
    isRTL: false 
  };

  // Track which groups are expanded with localStorage persistence
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('vendorSidebarExpanded');
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
    localStorage.setItem('vendorSidebarExpanded', JSON.stringify(Array.from(newExpanded)));
  };

  const navigationGroups: NavigationGroup[] = [
    {
      id: 'overview',
      label: t('vendor.groups.overview'),
      priority: 'primary',
      items: [
        {
          name: t('nav.dashboard'),
          href: "/vendor/dashboard",
          icon: LayoutDashboard,
        },
        {
          name: t('nav.analytics'),
          href: "/analytics",
          icon: BarChart3,
        },
      ]
    },
    {
      id: 'workspace',
      label: t('vendor.groups.workspace'),
      priority: 'primary',
      items: [
        {
          name: t('nav.browseRequests'),
          href: "/browse-requests",
          icon: Search,
        },
        {
          name: t('nav.myOffers'),
          href: "/my-offers",
          icon: Package,
        },
        {
          name: t('nav.orders'),
          href: "/orders",
          icon: ShoppingCart,
        },
        {
          name: t('nav.messages'),
          href: "/messages",
          icon: MessageSquare,
        },
      ]
    },
    {
      id: 'portfolio',
      label: t('vendor.groups.portfolio'),
      priority: 'secondary',
      items: [
        {
          name: t('vendor.navigation.projectsManagement'),
          href: "/vendor/projects-management",
          icon: Building2,
        },
        {
          name: t('vendor.navigation.portfolioManagement'),
          href: "/vendor/portfolio-management",
          icon: Briefcase,
        },
      ]
    },
    {
      id: 'account',
      label: t('vendor.groups.account'),
      priority: 'utility',
      items: [
        {
          name: t('nav.profile'),
          href: "/profile",
          icon: User,
        },
        {
          name: t('nav.settings'),
          href: "/settings",
          icon: Settings,
        },
        {
          name: t('nav.support'),
          href: "/support",
          icon: HelpCircle,
        },
      ]
    },
  ];

  const isActive = (path: string) => {
    // Handle vendor dashboard special case
    if (path === '/vendor/dashboard' && (location.pathname === '/vendor/dashboard' || location.pathname === '/vendor')) {
      return true;
    }
    // Handle vendor nested routes
    if (path.startsWith('/vendor/')) {
      return location.pathname === path;
    }
    return location.pathname === path;
  };
  
  const isParentActive = (path: string) => location.pathname.startsWith(path) && path !== '/vendor/dashboard';

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
        "flex flex-col h-screen bg-card border-border transition-all duration-300 shadow-sm fixed top-0 z-50",
        collapsed ? "w-16" : "w-64",
        isRTL ? "right-0 border-l" : "left-0 border-r",
        className
      )} 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Sidebar Header - matches main header height */}
      <div className="border-b border-border bg-card h-16 flex items-center">
        <VendorUserProfile variant="sidebar" collapsed={collapsed} />
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
                      hasActiveItem && "text-primary font-semibold",
                      isRTL && "flex-row-reverse"
                    )}
                    type="button"
                  >
                    <span className={cn(
                      "flex items-center gap-2",
                      isRTL && "flex-row-reverse"
                    )}>
                      <span>{group.label}</span>
                      {hasActiveItem && (
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                      )}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className={cn(
                        "h-3 w-3 transition-transform duration-200",
                        isRTL && "rotate-180"
                      )} />
                    ) : (
                      <ChevronRight className={cn(
                        "h-3 w-3 transition-transform duration-200",
                        isRTL && "rotate-180"
                      )} />
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
                        onClick={onItemClick}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                          "text-sm font-medium hover:bg-accent/50",
                          collapsed ? "justify-center px-2" : "justify-start",
                          active 
                            ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/30",
                          isRTL && "flex-row-reverse"
                        )}
                        title={collapsed ? item.name : undefined}
                        aria-label={`${t('nav.navigateTo')} ${item.name}`}
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
                            <span className={cn(
                              "truncate flex-1 text-foreground",
                              isRTL && "text-right"
                            )}>
                              {item.name}
                            </span>
                            
                            {item.badge && item.badge > 0 && (
                              <Badge 
                                variant={(item.badgeVariant === "success" || item.badgeVariant === "warning") ? "secondary" : item.badgeVariant || "secondary"} 
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
