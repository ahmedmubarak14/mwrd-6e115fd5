import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users,
  BarChart3,
  CreditCard,
  Settings,
  Shield,
  MessageSquare,
  ClipboardCheck,
  TrendingUp,
  UserCog,
  Database,
  Activity,
  FileText,
  Palette,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Home,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const adminMenuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: BarChart3,
    end: true,
  },
  {
    title: "User Management",
    icon: Users,
    items: [
      {
        title: "All Users",
        url: "/admin/users",
        icon: Users,
      },
      {
        title: "Advanced Management",
        url: "/admin/users/advanced",
        icon: UserCog,
      },
      {
        title: "User Profiles",
        url: "/admin/users",
        icon: Shield,
      },
    ],
  },
  {
    title: "Financial",
    icon: CreditCard,
    items: [
      {
        title: "Dashboard",
        url: "/admin/financial",
        icon: CreditCard,
      },
      {
        title: "Transactions",
        url: "/admin/financial/transactions",
        icon: TrendingUp,
      },
      {
        title: "Subscriptions",
        url: "/admin/financial/subscriptions",
        icon: Database,
      },
    ],
  },
  {
    title: "Analytics",
    icon: Activity,
    items: [
      {
        title: "Platform Analytics",
        url: "/admin/analytics",
        icon: BarChart3,
      },
      {
        title: "User Activity",
        url: "/admin/analytics/users",
        icon: Activity,
      },
      {
        title: "Reports",
        url: "/admin/analytics/reports",
        icon: FileText,
      },
    ],
  },
  {
    title: "Content Management",
    icon: ClipboardCheck,
    items: [
      {
        title: "Requests Approval",
        url: "/admin/content/requests",
        icon: ClipboardCheck,
        badge: "pending",
      },
      {
        title: "Offers Management",
        url: "/admin/content/offers",
        icon: MessageSquare,
      },
      {
        title: "Expert Consultations",
        url: "/admin/content/consultations",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "System",
    icon: Settings,
    items: [
      {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
      },
      {
        title: "Theme & Design",
        url: "/admin/settings/theme",
        icon: Palette,
      },
      {
        title: "Database",
        url: "/admin/settings/database",
        icon: Database,
      },
    ],
  },
];

interface AdminSidebarProps {
  collapsed?: boolean;
}

export const AdminSidebar = ({ collapsed = false }: AdminSidebarProps) => {
  const { language, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isRTL = language === 'ar';
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['Content Management']));
  const [pendingCounts, setPendingCounts] = useState<{pending_suppliers: number; pending_requests: number; pending_offers: number}>({ pending_suppliers: 0, pending_requests: 0, pending_offers: 0 });

  const isActive = (path: string, end?: boolean) => {
    if (end) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const toggleGroup = (title: string) => {
    const newOpenGroups = new Set(openGroups);
    if (newOpenGroups.has(title)) {
      newOpenGroups.delete(title);
    } else {
      newOpenGroups.add(title);
    }
    setOpenGroups(newOpenGroups);
  };

  useEffect(() => {
    const loadCounts = async () => {
      const { data, error } = await supabase.rpc('get_admin_pending_counts');
      if (!error && data && data.length > 0) {
        const row = data[0] as any;
        setPendingCounts({
          pending_suppliers: Number(row.pending_suppliers || 0),
          pending_requests: Number(row.pending_requests || 0),
          pending_offers: Number(row.pending_offers || 0),
        });
      }
    };
    loadCounts();
  }, []);

  const getNavClassName = (path: string, end?: boolean) => {
    const active = isActive(path, end);
    return cn(
      "w-full justify-start transition-colors duration-200",
      active
        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    );
  };

  return (
    <div className={cn(
      "w-full h-full bg-sidebar flex flex-col",
      collapsed ? "lg:w-16" : "lg:w-64",
      "sidebar-border transition-all duration-300"
    )}>
      {/* Header matching client dashboard */}
      <div className="p-4 sm:p-6 border-b border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3",
          isRTL && "flex-row-reverse",
          collapsed && "justify-center"
        )}>
          <img 
            src="/lovable-uploads/91db8182-e5ce-4596-90c8-bfa524cd0464.png" 
            alt="Supplify Logo" 
            className="h-8 w-8 object-contain flex-shrink-0"
          />
          {!collapsed && (
            <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-sm font-semibold text-sidebar-foreground truncate">
                  {t('admin.panel')}
                </h2>
                <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                  Admin
                </Badge>
              </div>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {t('admin.managementDashboard')}
              </p>
            </div>
          )}
        </div>
        
        {/* Back to main site button - matching client design */}
        {!collapsed && (
          <div className="mt-4">
            <button
              onClick={() => navigate('/')}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-xs",
                "text-sidebar-foreground/60 hover:text-sidebar-foreground",
                "hover:bg-sidebar-accent rounded-md transition-colors",
                isRTL && "flex-row-reverse text-right"
              )}
            >
              <Home className={cn("h-4 w-4 flex-shrink-0", isRTL && "rotate-180")} />
              <span className="truncate">{t('admin.backToSite')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation - matching client dashboard style */}
      <nav className="flex-1 px-3 sm:px-4 py-4 space-y-1 overflow-y-auto">
        {adminMenuItems.map((item) => (
          <div key={item.title}>
            {item.items ? (
              <Collapsible
                open={openGroups.has(item.title)}
                onOpenChange={() => toggleGroup(item.title)}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full gap-3 h-10 sm:h-12 text-sm sm:text-base",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "rtl-justify-start rtl-flex",
                      openGroups.has(item.title) && "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    {!collapsed && (
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate">{t(item.title.toLowerCase().replace(/\s+/g, ''))}</span>
                        <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
                          {item.title === "Content Management" && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                              {pendingCounts.pending_requests + pendingCounts.pending_offers + pendingCounts.pending_suppliers}
                            </Badge>
                          )}
                          {openGroups.has(item.title) ? (
                            <ChevronDown className={cn("h-3 w-3", isRTL && "rotate-180")} />
                          ) : (
                            <ChevronRight className={cn("h-3 w-3", isRTL && "rotate-180")} />
                          )}
                        </div>
                      </div>
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 mt-1">
                  {item.items.map((subItem) => (
                    <NavLink key={subItem.url} to={subItem.url}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full gap-3 h-10 sm:h-12 text-sm",
                          "rtl-justify-start rtl-flex ml-4",
                          isActive(subItem.url) && "bg-primary/10 text-primary hover:bg-primary/20"
                        )}
                      >
                        <subItem.icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && (
                          <div className="flex items-center justify-between w-full">
                            <span className="truncate">{t(subItem.title.toLowerCase().replace(/\s+/g, ''))}</span>
                            {subItem.title === 'Requests Approval' && pendingCounts.pending_requests > 0 && (
                              <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                                {pendingCounts.pending_requests}
                              </Badge>
                            )}
                            {subItem.title === 'Offers Management' && pendingCounts.pending_offers > 0 && (
                              <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                                {pendingCounts.pending_offers}
                              </Badge>
                            )}
                          </div>
                        )}
                      </Button>
                    </NavLink>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <NavLink to={item.url} end={item.end}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full gap-3 h-10 sm:h-12 text-sm sm:text-base rtl-justify-start rtl-flex",
                    isActive(item.url, item.end) && "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                >
                  <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  {!collapsed && <span className="truncate">{t(item.title.toLowerCase().replace(/\s+/g, ''))}</span>}
                </Button>
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* Footer - matching client dashboard */}
      <div className="mt-auto p-3 sm:p-4 border-t border-sidebar-border bg-sidebar-accent/50">
        {!collapsed ? (
          <div className="text-center">
            <div className="text-xs text-sidebar-foreground/60 space-y-1">
              <p className="font-medium">{t('admin.adminVersion')}</p>
              <p>© 2024 Supplify</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-sidebar-primary rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
};