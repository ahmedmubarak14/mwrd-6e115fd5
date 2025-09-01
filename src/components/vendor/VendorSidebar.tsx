import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
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
  CreditCard,
  Shield,
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

export const VendorSidebar = ({ onItemClick }: Pick<VendorSidebarProps, 'onItemClick'>) => {
  const location = useLocation();
  const { userProfile } = useAuth();
  const { open: sidebarOpen } = useSidebar();
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
        return new Set(['overview', 'workspace']); // Default groups
      }
    }
    return new Set(['overview', 'workspace']); // Default groups
  });

  const toggleGroup = (groupId: string) => {
    if (!sidebarOpen) return; // Don't allow toggling when collapsed
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
      label: t('vendorGroups.overview'),
      priority: 'primary',
      items: [
        {
          name: t('nav.dashboard'),
          href: "/vendor/dashboard",
          icon: LayoutDashboard,
        },
        {
          name: t('nav.analytics'),
          href: "/vendor/analytics",
          icon: BarChart3,
        },
      ]
    },
    {
      id: 'workspace',
      label: t('vendorGroups.workspace'),
      priority: 'primary',
      items: [
        {
          name: t('nav.browseRequests'),
          href: "/vendor/browse-requests",
          icon: FolderOpen,
        },
        {
          name: t('nav.myOffers'),
          href: "/vendor/offers",
          icon: Package,
        },
        {
          name: t('nav.orders'),
          href: "/vendor/orders",
          icon: ShoppingCart,
        },
        {
          name: t('nav.messages'),
          href: "/vendor/messages",
          icon: MessageSquare,
        },
      ]
    },
    {
      id: 'portfolio',
      label: t('vendorGroups.portfolio'),
      priority: 'secondary',
      items: [
        {
          name: t('vendor.navigation.projectsManagement'),
          href: "/vendor/projects",
          icon: Briefcase,
        },
        {
          name: t('vendor.navigation.portfolioManagement'),
          href: "/vendor/portfolio",
          icon: Building2,
        },
      ]
    },
    {
      id: 'account',
      label: t('vendorGroups.account'),
      priority: 'utility',
      items: [
        {
          name: t('nav.profile'),
          href: "/vendor/profile",
          icon: User,
        },
        {
          name: t('vendor.navigation.crManagement'),
          href: "/vendor/cr-management",
          icon: Shield,
        },
        {
          name: t('nav.settings'),
          href: "/vendor/settings",
          icon: Settings,
        },
        {
          name: t('nav.support'),
          href: "/vendor/support",
          icon: HelpCircle,
        },
      ]
    },
  ];

  const isActive = (path: string) => {
    if (path === '/vendor/dashboard') {
      return location.pathname === '/vendor/dashboard';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isParentActive = (path: string) => location.pathname.startsWith(path) && path !== '/vendor/dashboard';

  const getGroupPriorityStyles = (priority: NavigationGroup['priority']) => {
    switch (priority) {
      case 'primary':
        return cn(
          "bg-primary/5 relative",
          "before:absolute before:w-1 before:h-full before:bg-primary/30",
          isRTL ? "before:right-0" : "before:left-0"
        );
      case 'secondary':
        return cn(
          "bg-accent/5 relative", 
          "before:absolute before:w-1 before:h-full before:bg-accent/30",
          isRTL ? "before:right-0" : "before:left-0"
        );
      case 'utility':
        return cn(
          "bg-muted/30 relative",
          "before:absolute before:w-1 before:h-full before:bg-muted-foreground/30",
          isRTL ? "before:right-0" : "before:left-0"
        );
      default:
        return "";
    }
  };

  return (
    <Sidebar 
      side={isRTL ? "right" : "left"}
      collapsible="icon"
      className={cn(
        isRTL ? "border-l" : "border-r"
      )}
    >
      {/* Sidebar Header - User Profile */}
      <div className={cn(
        "border-b border-border bg-card min-h-16 flex items-center",
        sidebarOpen ? "px-4" : "px-2"
      )}>
        <VendorUserProfile 
          variant="sidebar" 
          collapsed={!sidebarOpen}
        />
      </div>

      <SidebarContent>
        {navigationGroups.map((group) => {
          const isExpanded = !sidebarOpen ? false : expandedGroups.has(group.id);
          const hasActiveItem = group.items.some(item => 
            isActive(item.href) || isParentActive(item.href)
          );

          return (
            <SidebarGroup
              key={group.id}
              className={cn(getGroupPriorityStyles(group.priority))}
            >
              <SidebarGroupLabel className={cn(
                "text-xs uppercase tracking-wider",
                hasActiveItem && "text-primary font-semibold"
              )}>
                <span className="flex items-center gap-2">
                  <span>{group.label}</span>
                  {hasActiveItem && (
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  )}
                </span>
              </SidebarGroupLabel>
              
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const active = isActive(item.href) || isParentActive(item.href);
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton 
                          asChild
                          isActive={active}
                          tooltip={item.name}
                        >
                           <Link
                             to={item.href}
                             onClick={onItemClick}
                             className={cn(
                               "flex items-center gap-3",
                               isRTL && "flex-row-reverse",
                               active && "bg-primary/10 text-primary border border-primary/20"
                             )}
                           >
                             <item.icon className="h-4 w-4" />
                             {sidebarOpen && <span>{item.name}</span>}
                             {item.badge && item.badge > 0 && sidebarOpen && (
                               <Badge 
                                 variant="secondary"
                                 className={cn(
                                   "h-5 min-w-5 px-1.5 text-xs",
                                   isRTL ? "mr-auto" : "ml-auto"
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
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
};