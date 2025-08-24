
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOffers } from "@/hooks/useOffers";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Package, DollarSign, Clock, Eye, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

export const MyOffers = () => {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const { offers, loading } = useOffers();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'approved': return 'outline';
      case 'rejected': return 'destructive';
      case 'accepted': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('myOffers.title') || 'My Offers'}
          </h1>
          <p className="text-muted-foreground">
            {t('myOffers.subtitle') || 'Track and manage your submitted offers'}
          </p>
        </div>

        {offers && offers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No offers submitted</h3>
              <p className="text-muted-foreground">You haven't submitted any offers yet. Browse requests to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {offers?.map((offer) => (
              <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Offer #{offer.id.slice(0, 8)}
                    </CardTitle>
                    <Badge variant={getStatusColor(offer.status) as any}>
                      {offer.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {offer.description || 'No description provided'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="font-medium">${offer.price?.toLocaleString() || 'Price not set'}</span>
                    </div>
                    
                    {offer.delivery_time && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{offer.delivery_time} days delivery</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Submitted {format(new Date(offer.created_at), 'MMM dd, yyyy')}</span>
                    </div>
                    
                    {offer.client_approval_status && (
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Client Response:</span>
                          <Badge 
                            variant={offer.client_approval_status === 'approved' ? 'outline' : 
                                   offer.client_approval_status === 'rejected' ? 'destructive' : 'default'}
                            className="text-xs"
                          >
                            {offer.client_approval_status}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyOffers;
