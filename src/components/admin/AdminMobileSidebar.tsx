import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard,
  BarChart3,
  Activity,
  Users,
  FileText,
  Package,
  ShoppingCart,
  MessageSquare,
  Settings,
  HelpCircle,
  Bell,
  Shield,
  Database,
  Mail,
  UserCheck,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface AdminMobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  collapsed?: boolean;
  onToggle?: () => void;
}

export const AdminMobileSidebar = ({ isOpen, onOpenChange }: AdminMobileSidebarProps) => {
  const location = useLocation();
  const { userProfile } = useAuth();
  const { isRTL, t } = useLanguage();

  const navigationItems = [
    {
      section: t('admin.groups.overview') || "Overview",
      items: [
        {
          name: t('admin.dashboard') || "Dashboard",
          href: "/admin/dashboard",
          icon: LayoutDashboard,
        },
        {
          name: t('admin.sidebarAnalytics') || "Analytics",
          href: "/admin/analytics",
          icon: BarChart3,
        },
        {
          name: t('admin.performanceMonitor') || "Performance Monitor",
          href: "/admin/performance-monitor",
          icon: Activity,
        },
      ]
    },
    {
      section: t('admin.groups.management') || "Management",
      items: [
        {
          name: t('admin.sidebarUsers') || "Users",
          href: "/admin/users",
          icon: Users,
        },
        {
          name: t('admin.sidebarRequests') || "Requests",
          href: "/admin/requests",
          icon: FileText,
        },
        {
          name: t('admin.offers') || "Offers",
          href: "/admin/offers",
          icon: Package,
        },
        {
          name: t('admin.orders') || "Orders",
          href: "/admin/orders",
          icon: ShoppingCart,
        },
        {
          name: t('admin.messages') || "Messages",
          href: "/admin/messages",
          icon: MessageSquare,
        },
      ]
    },
    {
      section: t('admin.groups.communication') || "Communication",
      items: [
        {
          name: t('admin.notifications') || "Notifications",
          href: "/admin/notifications",
          icon: Bell,
        },
        {
          name: t('admin.emailCampaigns') || "Email Campaigns",
          href: "/admin/email-campaigns",
          icon: Mail,
        },
        {
          name: t('admin.expertConsultations') || "Expert Consultations",
          href: "/admin/expert-consultations",
          icon: UserCheck,
        },
      ]
    },
    {
      section: t('admin.groups.system') || "System",
      items: [
        {
          name: t('admin.security') || "Security",
          href: "/admin/security",
          icon: Shield,
        },
        {
          name: t('admin.systemHealth') || "System Health",
          href: "/admin/system-health",
          icon: Database,
        },
        {
          name: t('admin.settings') || "Settings",
          href: "/admin/settings",
          icon: Settings,
        },
        {
          name: t('admin.support') || "Support",
          href: "/admin/support",
          icon: HelpCircle,
        },
      ]
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent 
        side={isRTL ? "right" : "left"}
        className={cn(
          "w-80 p-0 bg-background overflow-hidden",
          "safe-area-inset-y",
          isRTL ? "border-l-2" : "border-r-2",
          "flex flex-col"
        )}
      >
        <div className="flex flex-col h-full" dir={isRTL ? "rtl" : "ltr"}>
          {/* Header */}
          <div className="border-b border-border p-4 flex items-center justify-between">
            <Link 
              to="/admin/dashboard"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3"
            >
              <img 
                src="/lovable-uploads/9a6215a4-31ff-4f7d-a55b-1cbecc47ec33.png" 
                alt="MWRD Logo"
                className="h-8 w-auto"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">MWRD Admin</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {userProfile?.role || 'Admin'}
                </span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {navigationItems.map((section) => (
                <div key={section.section}>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">
                    {section.section}
                  </h4>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => onOpenChange(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                            "text-sm font-medium",
                            active 
                              ? "bg-primary/10 text-primary border border-primary/20" 
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                            isRTL && "flex-row-reverse text-right"
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};