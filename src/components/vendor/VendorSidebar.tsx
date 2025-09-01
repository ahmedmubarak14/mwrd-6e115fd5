import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard,
  FileText,
  Package,
  ShoppingCart,
  MessageSquare,
  FolderOpen,
  User,
  Settings,
  HelpCircle,
  BarChart3,
  Building2,
  Briefcase,
  Shield,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { VendorUserProfile } from "./VendorUserProfile";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { cn } from "@/lib/utils";

interface VendorSidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
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
    badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  }[];
}

export const VendorSidebar = ({ 
  className, 
  collapsed = false, 
  onToggle, 
  onItemClick 
}: VendorSidebarProps) => {
  const location = useLocation();
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  // Track which groups are expanded with localStorage persistence
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('vendorSidebarExpanded');
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch {
        return new Set(['overview', 'business']); // Default groups
      }
    }
    return new Set(['overview', 'business']); // Default groups
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
      label: t('vendorGroups.overview') || 'Overview',
      priority: 'primary',
      items: [
        {
          name: t('nav.dashboard') || 'Dashboard',
          href: '/vendor/dashboard',
          icon: LayoutDashboard,
        },
        {
          name: t('nav.analytics') || 'Analytics',
          href: '/vendor/analytics',
          icon: BarChart3,
        },
      ]
    },
    {
      id: 'business',
      label: t('vendorGroups.workspace') || 'Business',
      priority: 'primary',
      items: [
        {
          name: t('nav.browseRequests') || 'Browse Requests',
          href: '/vendor/browse-requests',
          icon: FolderOpen,
        },
        {
          name: t('nav.myOffers') || 'My Offers',
          href: '/vendor/offers',
          icon: Package,
        },
        {
          name: t('nav.orders') || 'Orders',
          href: '/vendor/orders',
          icon: ShoppingCart,
        },
        {
          name: t('nav.messages') || 'Messages',
          href: '/vendor/messages',
          icon: MessageSquare,
        },
      ]
    },
    {
      id: 'portfolio',
      label: t('vendorGroups.portfolio') || 'Portfolio',
      priority: 'secondary',
      items: [
        {
          name: t('vendor.navigation.projectsManagement') || 'Projects',
          href: '/vendor/projects',
          icon: Briefcase,
        },
        {
          name: t('vendor.navigation.portfolioManagement') || 'Portfolio',
          href: '/vendor/portfolio',
          icon: Building2,
        },
      ]
    },
    {
      id: 'account',
      label: t('vendorGroups.account') || 'Account',
      priority: 'utility',
      items: [
        {
          name: t('nav.profile') || 'Profile',
          href: '/vendor/profile',
          icon: User,
        },
        {
          name: t('vendor.navigation.crManagement') || 'CR Management',
          href: '/vendor/cr-management',
          icon: Shield,
        },
        {
          name: t('nav.settings') || 'Settings',
          href: '/vendor/settings',
          icon: Settings,
        },
        {
          name: t('nav.support') || 'Support',
          href: '/vendor/support',
          icon: HelpCircle,
        },
      ]
    },
  ];

  const isActive = (path: string) => location.pathname === path;
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
      <div className="border-b border-border bg-card h-16 flex items-center px-4">
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
                            <span className={cn(
                              "truncate flex-1 text-foreground",
                              isRTL && "text-right"
                            )}>
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