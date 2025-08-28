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
import { AdminNavItem } from "./AdminNavItem";

interface AdminMobileSidebarContentProps {
  onItemClick?: () => void;
}

export const AdminMobileSidebarContent = ({ onItemClick }: AdminMobileSidebarContentProps) => {
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
    {
      name: t('admin.settings'),
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
      <div className="h-full flex flex-col bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex h-16 items-center justify-between border-b px-6 pt-safe">
          <h2 className="admin-title truncate">
            {t('admin.title')}
          </h2>
        </div>
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 py-4 pb-safe">
            {navigation.map((item) => (
              <AdminNavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.name}
                badge={item.badge}
                badgeVariant={item.badgeVariant}
                variant="mobile"
                onClick={onItemClick}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
  );
};