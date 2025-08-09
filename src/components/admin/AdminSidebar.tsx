import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
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

export const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { language, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isRTL = language === 'ar';
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['Dashboard']));
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
    <Sidebar className={cn("border-sidebar-border", collapsed ? "w-16" : "w-64")}>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <img 
              src="/lovable-uploads/91db8182-e5ce-4596-90c8-bfa524cd0464.png" 
              alt="Supplify Logo" 
              className="h-8 w-8 object-contain"
            />
            <div className={isRTL ? 'text-right' : ''}>
              <h2 className="text-lg font-bold text-sidebar-foreground">
                {t('adminPanel')}
              </h2>
              <p className="text-xs text-sidebar-foreground/60">
                {t('managementDashboard')}
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/91db8182-e5ce-4596-90c8-bfa524cd0464.png" 
              alt="Supplify Logo" 
              className="h-8 w-8 object-contain"
            />
          </div>
        )}
        
        {/* Back to main site button */}
        {!collapsed && (
          <div className={`mt-3 ${isRTL ? 'text-right' : ''}`}>
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-2 text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors w-full p-2 rounded-md hover:bg-sidebar-accent ${isRTL ? 'flex-row-reverse text-right' : ''}`}
            >
              <ArrowLeft className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
              <span>{t('backToSite')}</span>
            </button>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {adminMenuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.items ? (
                <Collapsible
                  open={openGroups.has(item.title)}
                  onOpenChange={() => toggleGroup(item.title)}
                  className="w-full"
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={cn(
                        "w-full justify-between hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        openGroups.has(item.title) && "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}
                    >
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{t(item.title.toLowerCase().replace(/\s+/g, ''))}</span>}
                      </div>
                      {!collapsed && (
                        <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          {item.title === "Content Management" && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                              {pendingCounts.pending_requests + pendingCounts.pending_offers + pendingCounts.pending_suppliers}
                            </Badge>
                          )}
                          {openGroups.has(item.title) ? (
                            <ChevronDown className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
                          ) : (
                            <ChevronRight className={`h-3 w-3 ${isRTL ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 mt-1">
                    {item.items.map((subItem) => (
                      <SidebarMenuButton key={subItem.url} asChild className="ml-4">
                        <NavLink
                          to={subItem.url}
                          className={`${getNavClassName(subItem.url)} ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                          <subItem.icon className="h-4 w-4" />
                          {!collapsed && (
                            <div className={`flex items-center justify-between w-full ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span>{t(subItem.title.toLowerCase().replace(/\s+/g, ''))}</span>
                              {subItem.title === 'Requests Approval' && (
                                <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                                  {pendingCounts.pending_requests}
                                </Badge>
                              )}
                              {subItem.title === 'Offers Management' && (
                                <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                                  {pendingCounts.pending_offers}
                                </Badge>
                              )}
                            </div>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.url}
                    end={item.end}
                    className={`${getNavClassName(item.url, item.end)} ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{t(item.title.toLowerCase().replace(/\s+/g, ''))}</span>}
                  </NavLink>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {!collapsed ? (
          <div className={`text-xs text-sidebar-foreground/60 ${isRTL ? 'text-center' : 'text-center'}`}>
            <p>{t('adminVersion')}</p>
            <p>© 2024 Supplify</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-sidebar-primary rounded-full"></div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};