
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard,
  Users,
  FileText,
  Package,
  ShoppingCart,
  CreditCard,
  Settings,
  HelpCircle,
  MessageSquare,
  BarChart3,
  UserCheck,
  FolderOpen,
  Building2,
  Ticket,
  Crown
} from "lucide-react";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  className?: string;
}

export const AdminSidebar = ({ className }: AdminSidebarProps) => {
  const location = useLocation();
  const { getPendingTicketsCount } = useSupportTickets();
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };
  const pendingTickets = getPendingTicketsCount();

  const navigation = [
    {
      name: t('admin.dashboard'),
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: t('admin.users'),
      href: "/admin/users",
      icon: Users,
    },
    {
      name: t('admin.requests'),
      href: "/admin/requests",
      icon: FileText,
    },
    {
      name: t('admin.offers'),
      href: "/admin/offers",
      icon: Package,
    },
    {
      name: t('admin.projects'),
      href: "/admin/projects", 
      icon: Building2,
    },
    {
      name: t('admin.orders'),
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      name: t('admin.financialTransactions'),
      href: "/admin/financial-transactions",
      icon: CreditCard,
    },
    {
      name: t('admin.subscriptions'),
      href: "/admin/subscriptions",
      icon: Crown,
    },
    {
      name: t('admin.supportTickets'),
      href: "/admin/support",
      icon: Ticket,
      badge: pendingTickets > 0 ? pendingTickets : undefined,
      badgeVariant: "destructive" as const,
    },
    {
      name: t('admin.expertConsultations'),
      href: "/admin/content/consultations",
      icon: HelpCircle,
    },
    {
      name: t('admin.categoryManagement'),
      href: "/admin/category-management",
      icon: FolderOpen,
    },
    {
      name: t('admin.verificationQueue'),
      href: "/admin/verification",
      icon: UserCheck,
    },
    {
      name: t('admin.analytics'),
      href: "/admin/analytics",
      icon: BarChart3,
    },
  ];

  return (
    <div className={cn("w-64 border-r bg-card h-full", className)} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <h2 className="text-lg font-semibold">
            {t('admin.title')}
          </h2>
        </div>
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 py-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-9",
                    isActive && "bg-secondary font-medium",
                    isRTL && "flex-row-reverse"
                  )}
                  asChild
                >
                  <Link to={item.href} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <Badge variant={item.badgeVariant || "secondary"} className="h-5 w-5 p-0 text-xs">
                        {item.badge > 99 ? '99+' : item.badge}
                      </Badge>
                    )}
                  </Link>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
