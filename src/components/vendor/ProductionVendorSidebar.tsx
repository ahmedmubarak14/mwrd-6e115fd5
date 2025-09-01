import React, { useState, useCallback, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AccessibleTooltip } from "@/components/ui/AccessibleTooltip";
import { VendorUserProfile } from "./VendorUserProfile";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  FileText,
  Package,
  DollarSign,
  Users,
  MessageSquare,
  Settings,
  HelpCircle,
  FolderOpen,
  Bell,
  CreditCard,
  FileBarChart,
  ChevronDown,
  ChevronRight,
  Home
} from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: number;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

interface NavigationGroup {
  id: string;
  label: string;
  priority: number;
  items: NavigationItem[];
}

interface ProductionVendorSidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
  onItemClick?: () => void;
}

export const ProductionVendorSidebar: React.FC<ProductionVendorSidebarProps> = ({ 
  className, 
  collapsed = false, 
  onToggle, 
  onItemClick 
}) => {
  const location = useLocation();
  const { userProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  // Persistent expanded state
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vendor-sidebar-expanded');
      return stored ? new Set(JSON.parse(stored)) : new Set(['overview', 'business']);
    }
    return new Set(['overview', 'business']);
  });

  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      localStorage.setItem('vendor-sidebar-expanded', JSON.stringify([...newSet]));
      return newSet;
    });
  }, []);

  const isActive = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);

  const isParentActive = useCallback((path: string) => {
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  // Memoized navigation structure
  const navigationGroups: NavigationGroup[] = useMemo(() => [
    {
      id: 'overview',
      label: t('vendor.groups.overview'),
      priority: 1,
      items: [
        { name: t('vendor.navigation.dashboard'), href: '/vendor/dashboard', icon: Home },
        { name: t('vendor.navigation.rfqs'), href: '/vendor/rfqs', icon: FileText, badge: 5 },
      ]
    },
    {
      id: 'business',
      label: t('vendor.groups.workspace'),
      priority: 2,
      items: [
        { name: t('vendor.navigation.projects'), href: '/vendor/projects', icon: FolderOpen },
        { name: t('vendor.navigation.clients'), href: '/vendor/clients', icon: Users },
        { name: t('vendor.navigation.messages'), href: '/vendor/messages', icon: MessageSquare, badge: 3 },
      ]
    },
    {
      id: 'portfolio',
      label: t('vendor.groups.portfolio'),
      priority: 3,
      items: [
        { name: t('vendor.navigation.portfolio'), href: '/vendor/portfolio', icon: Package },
        { name: t('vendor.navigation.documents'), href: '/vendor/documents', icon: FileText },
      ]
    },
    {
      id: 'financial',
      label: 'Financial',
      priority: 4,
      items: [
        { name: t('vendor.navigation.subscription'), href: '/vendor/subscription', icon: CreditCard },
        { name: t('vendor.navigation.transactions'), href: '/vendor/transactions', icon: DollarSign },
        { name: t('vendor.navigation.reports'), href: '/vendor/reports', icon: FileBarChart },
      ]
    },
    {
      id: 'account',
      label: t('vendor.groups.account'),
      priority: 5,
      items: [
        { name: t('vendor.navigation.notifications'), href: '/vendor/notifications', icon: Bell, badge: 2 },
        { name: t('vendor.navigation.profile'), href: '/vendor/profile', icon: Settings },
        { name: t('vendor.navigation.support'), href: '/vendor/support', icon: HelpCircle },
      ]
    }
  ], [t]);

  const SidebarContent = useMemo(() => (
    <div className={cn(
      "flex flex-col h-full bg-card/50",
      isRTL && "rtl"
    )}>
      {/* User Profile */}
      <div className={cn(
        "p-4 border-b border-border/50",
        collapsed && "p-2"
      )}>
        <VendorUserProfile 
          variant={collapsed ? 'sidebar' : 'sidebar'} 
          collapsed={collapsed}
        />
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-2 py-4">
          {navigationGroups
            .sort((a, b) => a.priority - b.priority)
            .map((group) => {
              const isExpanded = expandedGroups.has(group.id);
              const hasActiveItem = group.items.some(item => isActive(item.href));

              return (
                <div key={group.id} className="space-y-1">
                  {/* Group Label */}
                  {!collapsed && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-between px-2 h-8 text-xs font-medium text-muted-foreground hover:text-foreground",
                        isRTL && "flex-row-reverse"
                      )}
                      onClick={() => toggleGroup(group.id)}
                    >
                      <span>{group.label}</span>
                      {isExpanded ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className={cn("h-3 w-3", isRTL && "rotate-180")} />
                      )}
                    </Button>
                  )}

                  {/* Group Items */}
                  {(isExpanded || collapsed) && (
                    <div className={cn(
                      "space-y-1",
                      !collapsed && "ml-2 pl-2 border-l border-border/30"
                    )}>
                      {group.items.map((item) => {
                        const itemIsActive = isActive(item.href);
                        const ItemContent = (
                          <Button
                            asChild
                            variant={itemIsActive ? "default" : "ghost"}
                            size="sm"
                            className={cn(
                              "w-full justify-start gap-3 h-9 px-3",
                              collapsed && "justify-center px-2",
                              itemIsActive && "bg-primary text-primary-foreground shadow-sm",
                              !itemIsActive && "hover:bg-accent/50",
                              isRTL && "flex-row-reverse"
                            )}
                            onClick={onItemClick}
                          >
                            <Link to={item.href} className="flex items-center gap-3 w-full">
                              <item.icon className="h-4 w-4 shrink-0" />
                              {!collapsed && (
                                <span className="flex-1 text-left truncate">
                                  {item.name}
                                </span>
                              )}
                              {!collapsed && item.badge && (
                                <Badge 
                                  variant={item.badgeVariant || "secondary"} 
                                  className="ml-auto h-5 min-w-5 text-xs"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          </Button>
                        );

                        if (collapsed) {
                          return (
                            <AccessibleTooltip
                              key={item.href}
                              content={item.name}
                              side={isRTL ? "left" : "right"}
                            >
                              {ItemContent}
                            </AccessibleTooltip>
                          );
                        }

                        return <div key={item.href}>{ItemContent}</div>;
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </ScrollArea>
    </div>
  ), [navigationGroups, collapsed, expandedGroups, isActive, isRTL, onItemClick, toggleGroup, t]);

  return (
    <aside className={cn(
      "h-full bg-background border-r border-border transition-all duration-300 ease-in-out",
      collapsed ? "w-16" : "w-64",
      className,
      isRTL && "border-l border-r-0"
    )}>
      {SidebarContent}
    </aside>
  );
};