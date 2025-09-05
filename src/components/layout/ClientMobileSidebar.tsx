import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
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
  CreditCard,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface ClientMobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ClientMobileSidebar = ({ isOpen, onOpenChange }: ClientMobileSidebarProps) => {
  const location = useLocation();
  const { userProfile } = useAuth();
  const { isRTL } = useLanguage();

  const navigationItems = [
    {
      section: "Overview",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          name: "Analytics",
          href: "/analytics",
          icon: BarChart3,
        },
      ]
    },
    {
      section: "Workspace",
      items: [
        {
          name: "Projects",
          href: "/projects",
          icon: Building2,
        },
        {
          name: "Requests",
          href: "/requests",
          icon: FileText,
        },
        ...((userProfile as any)?.role === 'supplier' ? [
          {
            name: "Browse Requests",
            href: "/browse-requests",
            icon: FolderOpen,
          },
          {
            name: "My Offers",
            href: "/my-offers",
            icon: Package,
          },
        ] : []),
        {
          name: "Orders",
          href: "/orders",
          icon: ShoppingCart,
        },
        {
          name: "Messages",
          href: "/messages",
          icon: MessageSquare,
        },
      ]
    },
    {
      section: "Network",
      items: [
        {
          name: "Vendors",
          href: "/vendors",
          icon: Users,
        },
      ]
    },
    {
      section: "Account",
      items: [
        {
          name: "Profile",
          href: "/profile",
          icon: User,
        },
        {
          name: "Subscription",
          href: "/manage-subscription",
          icon: CreditCard,
        },
        {
          name: "Settings",
          href: "/settings",
          icon: Settings,
        },
        {
          name: "Support",
          href: "/support",
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
              to="/dashboard"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3"
            >
              <img 
                src="/lovable-uploads/9a6215a4-31ff-4f7d-a55b-1cbecc47ec33.png" 
                alt="MWRD Logo"
                className="h-8 w-auto"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">MWRD Dashboard</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {userProfile?.role || 'User'}
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