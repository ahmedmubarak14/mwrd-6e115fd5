import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MobileOptimizedButton } from "@/components/ui/MobileOptimizedButton";
import { MobileFriendlyCard } from "@/components/ui/MobileFriendlyCard";
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
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const adminMenuItems = [
  {
    title: "admin.menu.dashboard",
    url: "/admin",
    icon: BarChart3,
    end: true,
  },
  {
    title: "admin.menu.userManagement",
    icon: Users,
    items: [
      {
        title: "admin.menu.allUsers",
        url: "/admin/users",
        icon: Users,
      },
      {
        title: "admin.menu.advancedManagement",
        url: "/admin/users/advanced",
        icon: UserCog,
      },
      {
        title: "admin.menu.userProfiles",
        url: "/admin/users",
        icon: Shield,
      },
    ],
  },
  {
    title: "admin.menu.financial",
    icon: CreditCard,
    items: [
      {
        title: "admin.menu.financialDashboard",
        url: "/admin/financial",
        icon: CreditCard,
      },
      {
        title: "admin.menu.transactions",
        url: "/admin/financial/transactions",
        icon: TrendingUp,
      },
      {
        title: "admin.menu.subscriptions",
        url: "/admin/financial/subscriptions",
        icon: Database,
      },
    ],
  },
  {
    title: "admin.menu.analytics",
    icon: Activity,
    items: [
      {
        title: "admin.menu.platformAnalytics",
        url: "/admin/analytics",
        icon: BarChart3,
      },
      {
        title: "admin.menu.userActivity",
        url: "/admin/analytics/users",
        icon: Activity,
      },
      {
        title: "admin.menu.reports",
        url: "/admin/analytics/reports",
        icon: FileText,
      },
    ],
  },
  {
    title: "admin.menu.contentManagement",
    icon: ClipboardCheck,
    items: [
      {
        title: "admin.menu.requestsApproval",
        url: "/admin/content/requests",
        icon: ClipboardCheck,
        badge: "pending",
      },
      {
        title: "admin.menu.offersManagement",
        url: "/admin/content/offers",
        icon: MessageSquare,
      },
      {
        title: "admin.menu.expertConsultations",
        url: "/admin/content/consultations",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "admin.menu.system",
    icon: Settings,
    items: [
      {
        title: "admin.menu.settings",
        url: "/admin/settings",
        icon: Settings,
      },
      {
        title: "admin.menu.themeDesign",
        url: "/admin/settings/theme",
        icon: Palette,
      },
      {
        title: "admin.menu.database",
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
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['admin.menu.contentManagement']));
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
      try {
        const [requestsRes, offersRes, usersRes] = await Promise.all([
          supabase.from('requests').select('id').eq('admin_approval_status', 'pending'),
          supabase.from('offers').select('id').eq('admin_approval_status', 'pending'),
          supabase.from('user_profiles').select('id').eq('status', 'pending')
        ]);

        setPendingCounts({
          pending_suppliers: usersRes.data?.length || 0,
          pending_requests: requestsRes.data?.length || 0,
          pending_offers: offersRes.data?.length || 0,
        });
      } catch (error) {
        console.error('Error loading pending counts:', error);
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
      "w-full h-full flex flex-col transition-all duration-300 safe-area-pt safe-area-pb",
      collapsed ? "lg:w-16" : "lg:w-64"
    )} 
    style={{ background: 'var(--gradient-header)' }}
    >
      {/* Enhanced Header */}
      <MobileFriendlyCard className="m-3 sm:m-4 bg-white/10 border-white/20 backdrop-blur-md">
        <div className={cn(
          "flex items-center gap-3 sm:gap-4",
          isRTL ? "flex-row-reverse" : "",
          collapsed && "justify-center"
        )}>
          <div className="relative">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 hover:scale-110 transition-transform">
              <img 
                src="/lovable-uploads/1dd4b232-845d-46eb-9f67-b752fce1ac3b.png" 
                alt="MWRD Logo" 
                className="h-7 w-7 object-contain"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-lime rounded-full border-2 border-white animate-pulse" />
          </div>
          {!collapsed && (
            <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-white truncate">
                  {t('admin.panel')}
                </h2>
                <Badge className="text-xs px-2 py-1 bg-destructive/90 text-white border-destructive animate-pulse">
                  Admin
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-white/80 truncate font-medium">
                {t('admin.managementDashboard')}
              </p>
            </div>
          )}
        </div>
      </MobileFriendlyCard>

      {/* Enhanced Navigation */}
      <nav className="flex-1 px-3 sm:px-4 py-2 space-y-2 overflow-y-auto">
        {adminMenuItems.map((item) => (
          <div key={item.title}>
            {item.items ? (
              <Collapsible
                open={openGroups.has(item.title)}
                onOpenChange={() => toggleGroup(item.title)}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <MobileOptimizedButton
                    variant="ghost"
                    touchOptimized
                    className={cn(
                      "w-full justify-start gap-3 h-12 sm:h-14 text-sm font-bold text-white group",
                      "hover:bg-white/10 transition-all duration-300 hover:shadow-lg",
                      isRTL ? "flex-row-reverse text-right" : "",
                      openGroups.has(item.title) && "bg-white/20 shadow-md"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 group-hover:scale-110 transition-transform", isRTL && "ml-2")} />
                    {!collapsed && (
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate font-bold">{t(item.title)}</span>
                        <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                          {item.title === "admin.menu.contentManagement" && (
                            <Badge className="text-xs px-2 py-0.5 bg-destructive text-white animate-pulse">
                              {pendingCounts.pending_requests + pendingCounts.pending_offers + pendingCounts.pending_suppliers}
                            </Badge>
                          )}
                          {openGroups.has(item.title) ? (
                            <ChevronDown className={cn("h-4 w-4 transition-transform", isRTL && "rotate-180")} />
                          ) : (
                            <ChevronRight className={cn("h-4 w-4 transition-transform", isRTL && "rotate-180")} />
                          )}
                        </div>
                      </div>
                    )}
                  </MobileOptimizedButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 mt-1 animate-fade-in">
                  {item.items.map((subItem) => (
                    <NavLink key={subItem.url} to={subItem.url}>
                      <MobileOptimizedButton
                        variant="ghost"
                        touchOptimized
                        className={cn(
                          "w-full justify-start gap-3 h-10 sm:h-11 text-sm text-white/90 group",
                          "hover:bg-white/10 transition-all duration-300 hover:shadow-md",
                          isRTL ? "flex-row-reverse text-right mr-4" : "ml-6",
                          isActive(subItem.url) && "bg-white/20 text-white font-medium shadow-md scale-[1.02]"
                        )}
                      >
                        <subItem.icon className={cn("h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform", isRTL && "ml-2")} />
                        {!collapsed && (
                          <div className="flex items-center justify-between w-full">
                            <span className="truncate">{t(subItem.title)}</span>
                            {subItem.title === 'admin.menu.requestsApproval' && pendingCounts.pending_requests > 0 && (
                              <Badge className="text-xs px-2 py-0.5 bg-destructive text-white animate-pulse">
                                {pendingCounts.pending_requests}
                              </Badge>
                            )}
                            {subItem.title === 'admin.menu.offersManagement' && pendingCounts.pending_offers > 0 && (
                              <Badge className="text-xs px-2 py-0.5 bg-destructive text-white animate-pulse">
                                {pendingCounts.pending_offers}
                              </Badge>
                            )}
                          </div>
                        )}
                        {isActive(subItem.url) && (
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r animate-fade-in" />
                        )}
                      </MobileOptimizedButton>
                    </NavLink>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <NavLink to={item.url} end={item.end}>
                <MobileOptimizedButton
                  variant="ghost"
                  touchOptimized
                  className={cn(
                    "w-full justify-start gap-3 h-12 sm:h-14 text-sm font-bold text-white group",
                    "hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
                    isRTL ? "flex-row-reverse text-right" : "",
                    isActive(item.url, item.end) && "bg-white/20 shadow-md scale-[1.02]"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 group-hover:scale-110 transition-transform", isRTL && "ml-2")} />
                  {!collapsed && <span className="truncate font-bold">{t(item.title)}</span>}
                  {isActive(item.url, item.end) && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r animate-fade-in" />
                  )}
                </MobileOptimizedButton>
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* Enhanced Footer */}
      <div className="mt-auto p-3 sm:p-4">
        <MobileFriendlyCard className="bg-white/10 border-white/20 backdrop-blur-md">
          {!collapsed ? (
            <div className="text-center space-y-2">
              <div className="text-xs text-white/90 space-y-1">
                <p className="font-bold text-white flex items-center justify-center gap-2">
                  ⚡ {t('admin.adminVersion')}
                </p>
                <p className="text-white/70 font-medium">© 2024 MWRD</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-3 h-3 bg-white/80 rounded-full animate-pulse"></div>
            </div>
          )}
        </MobileFriendlyCard>
      </div>
    </div>
  );
};