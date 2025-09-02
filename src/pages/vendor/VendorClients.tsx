import { useState, useEffect } from "react";
import { VendorLayout } from "@/components/vendor/VendorLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Users, MessageSquare, DollarSign, Star, Building, Phone, Video } from "lucide-react";
import { MobileClientCard } from "@/components/mobile/MobileClientCard";
import { VoiceVideoInterface } from "@/components/mobile/VoiceVideoInterface";
import { VoiceMessageRecorder } from "@/components/mobile/VoiceMessageRecorder";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import { useVoiceVideo } from "@/hooks/useVoiceVideo";
import { usePWA } from "@/hooks/usePWA";
import { MobileContainer } from "@/components/ui/MobileContainer";

const VendorClientsContent = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mobile features
  const { isMobile } = useMobileDetection();
  const { initiateCall } = useVoiceVideo();
  const { isInstallable, installApp } = usePWA();
  
  // UI state
  const [showCallInterface, setShowCallInterface] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

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
        title: t('common.error'),
        description: t('common.failedToFetch'),
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

  const handleClientCall = async (clientId: string, type: 'voice' | 'video') => {
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client);
    setShowCallInterface(true);
    await initiateCall(clientId, type);
  };

  const handleClientMessage = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client);
    setShowVoiceRecorder(true);
  };

  const handleViewHistory = (clientId: string) => {
    // Navigate to client history page
    console.log('View history for client:', clientId);
  };

  const handleVoiceMessageSend = (audioBlob: Blob, duration: number) => {
    console.log('Sending voice message:', { audioBlob, duration, client: selectedClient });
    toast({
      title: 'Voice Message Sent',
      description: `Message sent to ${selectedClient?.full_name}`,
    });
  };

  const getRelationshipBadge = (relationship: string, totalOrders: number) => {
    if (totalOrders > 5) return { variant: 'default' as const, label: t('common.vipClient') };
    if (totalOrders > 0) return { variant: 'secondary' as const, label: t('common.activeClient') };
    return { variant: 'outline' as const, label: t('common.prospect') };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <MobileContainer pageType="dashboard" className="space-y-6">
      {/* PWA Install Banner */}
      {isInstallable && !isMobile && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Install MWRD App</h3>
                <p className="text-sm text-muted-foreground">
                  Get the full mobile experience with offline access
                </p>
              </div>
              <Button onClick={installApp} size="sm">
                Install
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
            <CardTitle className="text-sm font-medium">{t('vendor.clients.totalClients')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {t('vendor.clients.allRelationships')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('vendor.clients.activeClients')}</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {t('vendor.clients.completedOrders')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('common.totalRevenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
        <p className="text-xs text-muted-foreground mt-2">
          {t('common.fromAllClients')}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{t('common.avgOrderValue')}</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
        <p className="text-xs text-muted-foreground mt-2">
          {t('common.perOrderAverage')}
        </p>
      </CardContent>
    </Card>
  </div>

  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
          <CardTitle>{t('common.clientDirectory')}</CardTitle>
          <CardDescription>{t('common.clientOverview')}</CardDescription>
        </div>
      </div>
    </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder={t('vendor.clients.searchClients')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {isMobile ? (
            <div className="space-y-4">
              {filteredClients.map((client) => (
                <MobileClientCard
                  key={client.id}
                  client={client}
                  onCall={handleClientCall}
                  onMessage={handleClientMessage}
                  onViewHistory={handleViewHistory}
                />
              ))}
            </div>
          ) : (
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
                              {client.full_name || t('common.unknown')}
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
                          <span className="text-muted-foreground">{t('common.orders')}:</span>
                          <span className="font-medium">{client.totalOrders}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('common.revenue')}:</span>
                          <span className="font-medium">${client.totalRevenue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('common.lastContact')}:</span>
                          <span className="font-medium">
                            {new Date(client.lastInteraction).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleClientMessage(client.id)}
                        >
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleClientCall(client.id, 'voice')}
                        >
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleClientCall(client.id, 'video')}
                        >
                          <Video className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewHistory(client.id)}
                        >
                          {t('vendor.clients.viewHistory')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {filteredClients.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? t('vendor.clients.noClientsFound') : t('vendor.clients.noClientsYet')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile Interfaces */}
      <VoiceVideoInterface
        isVisible={showCallInterface}
        onClose={() => setShowCallInterface(false)}
      />
      
      <VoiceMessageRecorder
        isVisible={showVoiceRecorder}
        onClose={() => setShowVoiceRecorder(false)}
        onSend={handleVoiceMessageSend}
        recipientName={selectedClient?.full_name}
      />
    </div>
    </MobileContainer>
  );
};

export const VendorClients = () => {
  return (
    <VendorLayout>
      <VendorClientsContent />
    </VendorLayout>
  );
};