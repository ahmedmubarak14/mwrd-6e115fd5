import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Users, MessageSquare, DollarSign, Star, Building } from "lucide-react";

export const VendorClients = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (userProfile) {
      fetchClients();
    }
  }, [userProfile]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      // Get clients from orders and offers
      const { data: orderClients, error: orderError } = await supabase
        .from('orders')
        .select(`
          client_id,
          amount,
          status,
          created_at,
          user_profiles!orders_client_id_fkey(
            id, full_name, company_name, avatar_url, email
          )
        `)
        .eq('vendor_id', userProfile?.user_id);

      if (orderError) throw orderError;

      const { data: offerClients, error: offerError } = await supabase
        .from('offers')
        .select(`
          request_id,
          price,
          status,
          created_at,
          requests!inner(
            client_id,
            user_profiles!requests_client_id_fkey(
              id, full_name, company_name, avatar_url, email
            )
          )
        `)
        .eq('vendor_id', userProfile?.user_id);

      if (offerError) throw offerError;

      // Process and deduplicate clients
      const clientMap = new Map();

      // Add clients from orders
      orderClients?.forEach(order => {
        const client = order.user_profiles;
        if (client && !clientMap.has(client.id)) {
          clientMap.set(client.id, {
            ...client,
            totalOrders: 0,
            totalRevenue: 0,
            lastInteraction: order.created_at,
            relationship: 'active'
          });
        }
        if (client) {
          const existing = clientMap.get(client.id);
          existing.totalOrders++;
          existing.totalRevenue += Number(order.amount);
          if (new Date(order.created_at) > new Date(existing.lastInteraction)) {
            existing.lastInteraction = order.created_at;
          }
        }
      });

      // Add clients from offers
      offerClients?.forEach(offer => {
        const client = offer.requests?.user_profiles;
        if (client && !clientMap.has(client.id)) {
          clientMap.set(client.id, {
            ...client,
            totalOrders: 0,
            totalRevenue: 0,
            lastInteraction: offer.created_at,
            relationship: 'prospect'
          });
        }
        if (client) {
          const existing = clientMap.get(client.id);
          if (new Date(offer.created_at) > new Date(existing.lastInteraction)) {
            existing.lastInteraction = offer.created_at;
          }
        }
      });

      setClients(Array.from(clientMap.values()));
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Error",
        description: "Failed to fetch client data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.full_name?.toLowerCase().includes(searchLower) ||
      client.company_name?.toLowerCase().includes(searchLower) ||
      client.email?.toLowerCase().includes(searchLower)
    );
  });

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.totalOrders > 0).length;
  const totalRevenue = clients.reduce((sum, c) => sum + c.totalRevenue, 0);
  const averageOrderValue = activeClients > 0 ? totalRevenue / clients.reduce((sum, c) => sum + c.totalOrders, 0) : 0;

  const getRelationshipBadge = (relationship: string, totalOrders: number) => {
    if (totalOrders > 5) return { variant: 'default' as const, label: 'VIP Client' };
    if (totalOrders > 0) return { variant: 'secondary' as const, label: 'Active Client' };
    return { variant: 'outline' as const, label: 'Prospect' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('vendor.clients.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('vendor.clients.description')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground mt-2">
              All client relationships
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
            <p className="text-xs text-muted-foreground mt-2">
              With completed orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-2">
              From all clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Per order average
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Client Directory</CardTitle>
              <CardDescription>Your complete client relationship overview</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client) => {
              const badge = getRelationshipBadge(client.relationship, client.totalOrders);
              
              return (
                <Card key={client.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={client.avatar_url} />
                          <AvatarFallback>
                            {client.full_name?.charAt(0) || client.company_name?.charAt(0) || 'C'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-sm">
                            {client.full_name || 'Unknown'}
                          </h3>
                          {client.company_name && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Building className="h-3 w-3" />
                              {client.company_name}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant={badge.variant} className="text-xs">
                        {badge.label}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Orders:</span>
                        <span className="font-medium">{client.totalOrders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Revenue:</span>
                        <span className="font-medium">${client.totalRevenue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Contact:</span>
                        <span className="font-medium">
                          {new Date(client.lastInteraction).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        View History
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No clients found matching your search' : 'No client relationships yet'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};