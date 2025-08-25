
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  const { t, isRTL } = useLanguage();

  const tabs = [
    {
      value: "overview",
      label: t('dashboard.overview') === 'dashboard.overview' ? 'Overview' : t('dashboard.overview'),
      title: t('dashboard.rfqPerformance') === 'dashboard.rfqPerformance' ? 'RFQ Performance' : t('dashboard.rfqPerformance'),
      description: t('dashboard.recentActivity') === 'dashboard.recentActivity' ? 'Recent RFQ activity and status' : t('dashboard.recentActivity'),
      content: t('dashboard.noDataAvailable') === 'dashboard.noDataAvailable' ? 'No data available for RFQ performance.' : t('dashboard.noDataAvailable')
    },
    {
      value: "requests",
      label: t('requests.title') === 'requests.title' ? 'Requests' : t('requests.title'),
      title: t('requests.title') === 'requests.title' ? 'Requests' : t('requests.title'),
      description: t('requests.manageRequests') === 'requests.manageRequests' ? 'Manage and track your service requests' : t('requests.manageRequests'),
      content: t('requests.noRequests') === 'requests.noRequests' ? 'No requests found.' : t('requests.noRequests'),
      hasAction: true,
      actionLabel: t('requests.createRequest') === 'requests.createRequest' ? 'Create Request' : t('requests.createRequest')
    },
    {
      value: "suppliers",
      label: t('suppliers.title') === 'suppliers.title' ? 'Suppliers' : t('suppliers.title'),
      title: t('suppliers.title') === 'suppliers.title' ? 'Suppliers' : t('suppliers.title'),
      description: t('suppliers.findManage') === 'suppliers.findManage' ? 'Find and manage your preferred suppliers' : t('suppliers.findManage'),
      content: t('suppliers.noSuppliers') === 'suppliers.noSuppliers' ? 'No suppliers found.' : t('suppliers.noSuppliers')
    },
    {
      value: "orders",
      label: t('orders.title') === 'orders.title' ? 'Orders' : t('orders.title'),
      title: t('orders.title') === 'orders.title' ? 'Orders' : t('orders.title'),
      description: t('orders.trackManage') === 'orders.trackManage' ? 'Track and manage your orders' : t('orders.trackManage'),
      content: t('orders.noOrders') === 'orders.noOrders' ? 'No orders found.' : t('orders.noOrders')
    }
  ];

  return (
    <Tabs value={activeTab} className="space-y-4" onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="space-y-4">
          <Card>
            <CardHeader>
              <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CardTitle>{tab.title}</CardTitle>
                {tab.hasAction && (
                  <Button size="sm" className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Plus className="h-4 w-4" />
                    {tab.actionLabel}
                  </Button>
                )}
              </div>
              <CardDescription>
                {tab.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                {tab.content}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};
