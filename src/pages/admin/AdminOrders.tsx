
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { format } from "date-fns";
import { ShoppingCart, Package, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";

interface Order {
  id: string;
  client_id: string;
  status: string;
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
  user_profiles?: {
    full_name: string | null;
    email: string;
  } | null;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user_profiles (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      setOrders((data as any) || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      processing: "warning",
      completed: "success",
      cancelled: "destructive"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredOrders = orders.filter(order => {
    const searchMatch = searchTerm === "" || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_profiles?.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === "all" || order.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" data-admin-dashboard>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <AdminPageContainer
      title={t('admin.orders')}
      description={t('common.manageDescription')}
    >
      <div data-admin-dashboard>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-foreground opacity-75">{t('common.noData')}</p>
              </CardContent>
            </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                  <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                    <ShoppingCart className="h-4 w-4" />
                    <div className={cn(isRTL ? "text-right" : "text-left")}>
                      <CardTitle className="text-lg text-foreground">
                        Order #{order.id.slice(0, 8)}
                      </CardTitle>
                      <p className="text-sm text-foreground opacity-75">
                        {order.user_profiles?.full_name || order.user_profiles?.email || 'Unknown User'}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className={cn("flex items-center justify-between text-sm", isRTL && "flex-row-reverse")}>
                    <span className="font-medium text-foreground">Total: {order.amount} {order.currency}</span>
                    <span className="text-foreground opacity-75">{format(new Date(order.created_at), 'PPp')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      </div>
    </AdminPageContainer>
  );
}
