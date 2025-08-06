import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

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
        url: "/admin/users/profiles",
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
  const { language } = useLanguage();
  const location = useLocation();
  const isRTL = language === 'ar';
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['Dashboard']));

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
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-sidebar-primary" />
            <div>
              <h2 className="text-lg font-bold text-sidebar-foreground">
                Admin Panel
              </h2>
              <p className="text-xs text-sidebar-foreground/60">
                Management Dashboard
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <Shield className="h-8 w-8 text-sidebar-primary" />
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
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </div>
                      {!collapsed && (
                        <div className="flex items-center gap-1">
                          {item.title === "Content Management" && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                              3
                            </Badge>
                          )}
                          {openGroups.has(item.title) ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
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
                          className={getNavClassName(subItem.url)}
                        >
                          <subItem.icon className="h-4 w-4" />
                          {!collapsed && (
                            <div className="flex items-center justify-between w-full">
                              <span>{subItem.title}</span>
                              {subItem.badge && (
                                <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                                  {subItem.badge}
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
                    className={getNavClassName(item.url, item.end)}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {!collapsed ? (
          <div className="text-xs text-sidebar-foreground/60 text-center">
            <p>Admin Dashboard v2.0</p>
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