import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard,
  FolderOpen,
  Package,
  ShoppingCart,
  MessageSquare,
  Briefcase,
  BarChart3,
  TrendingUp,
  Users,
  User,
  Settings,
  HelpCircle,
  FileText,
  CreditCard,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface VendorMobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  collapsed?: boolean;
  onToggle?: () => void;
}

export const VendorMobileSidebar = ({ isOpen, onOpenChange }: VendorMobileSidebarProps) => {
  const location = useLocation();
  const { userProfile } = useAuth();
  const { isRTL, t } = useLanguage();

  const navigationItems = [
    {
      section: t('vendorGroups.workspace') || "Core Business",
      items: [
        {
          name: t('nav.dashboard') || "Dashboard",
          href: "/vendor/dashboard",
          icon: LayoutDashboard,
        },
        {
          name: t('nav.browseRequests') || "Browse Requests",
          href: "/vendor/browse-requests",
          icon: FolderOpen,
        },
        {
          name: t('nav.myOffers') || "My Offers",
          href: "/vendor/offers",
          icon: Package,
        },
        {
          name: t('nav.orders') || "Orders",
          href: "/vendor/orders",
          icon: ShoppingCart,
        },
        {
          name: t('nav.messages') || "Messages",
          href: "/vendor/messages",
          icon: MessageSquare,
        },
      ]
    },
    {
      section: t('vendorGroups.projectManagement') || "Project Management",
      items: [
        {
          name: t('nav.projects') || "Projects",
          href: "/vendor/projects",
          icon: Briefcase,
        },
        {
          name: t('vendorGroups.businessIntelligence') || "Business Intelligence",
          href: "/vendor/analytics",
          icon: BarChart3,
        },
        {
          name: t('vendorGroups.performanceTracking') || "Performance Tracking",
          href: "/vendor/performance",
          icon: TrendingUp,
        },
      ]
    },
    {
      section: t('vendorGroups.network') || "Network",
      items: [
        {
          name: t('vendorGroups.clientRelations') || "Client Relations",
          href: "/vendor/clients",
          icon: Users,
        },
        {
          name: t('vendorGroups.documentation') || "Documentation",
          href: "/vendor/documents",
          icon: FileText,
        },
      ]
    },
    {
      section: t('vendorGroups.account') || "Account",
      items: [
        {
          name: t('nav.profile') || "Profile",
          href: "/vendor/profile",
          icon: User,
        },
        {
          name: t('vendorGroups.subscription') || "Subscription",
          href: "/vendor/subscription",
          icon: CreditCard,
        },
        {
          name: t('nav.settings') || "Settings",
          href: "/vendor/settings",
          icon: Settings,
        },
        {
          name: t('nav.support') || "Support",
          href: "/vendor/support",
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
              to="/vendor/dashboard"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3"
            >
              <img 
                src="/lovable-uploads/9a6215a4-31ff-4f7d-a55b-1cbecc47ec33.png" 
                alt="MWRD Logo"
                className="h-8 w-auto"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">MWRD Vendor</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {userProfile?.role || 'Vendor'}
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