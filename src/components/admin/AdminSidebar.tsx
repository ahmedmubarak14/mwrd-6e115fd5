
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
  Crown,
  User
} from "lucide-react";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { AdminNavItem } from "./AdminNavItem";
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
      name: t('admin.communications'),
      href: "/admin/communications",
      icon: MessageSquare,
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
    {
      name: t('admin.settings'),
      href: "/admin/settings",
      icon: Settings,
    },
    {
      name: t('admin.profile'),
      href: "/admin/profile",
      icon: User,
    },
  ];

  return (
    <div className={cn(
      "w-64 border-r bg-card h-full flex-shrink-0 transition-all duration-200",
      className
    )} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center justify-between border-b px-4">
          <h2 className="admin-subtitle truncate">
            {t('admin.title')}
          </h2>
        </div>
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 py-2">
            {navigation.map((item) => (
              <AdminNavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.name}
                badge={item.badge}
                badgeVariant={item.badgeVariant}
                variant="sidebar"
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
