
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Plus, DollarSign, Calendar, Clock, MapPin, Target, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { EmptyState } from '@/components/dashboard/shared/EmptyState';

interface Request {
  id: string;
  title: string;
  description: string;
  category: string;
  urgency: string;
  budget_min?: number;
  budget_max?: number;
  currency?: string;
  deadline?: string;
  location?: string;
  created_at: string;
}

interface VendorOpportunitiesListProps {
  requests: Request[];
  loading?: boolean;
  onSubmitOffer?: (requestId: string) => void;
  onViewDetails?: (requestId: string) => void;
}

export const VendorOpportunitiesList: React.FC<VendorOpportunitiesListProps> = ({
  requests,
  loading = false,
  onSubmitOffer,
  onViewDetails
}) => {
  const { t, language } = useLanguage();
  const { userProfile } = useAuth();
  const isRTL = language === 'ar';

  const isVerified = userProfile?.verification_status === 'approved' && userProfile?.status === 'approved';

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const formatBudget = (request: Request) => {
    if (!request.budget_min && !request.budget_max) return t('vendor.negotiable');
    if (request.budget_min && request.budget_max) {
      return `${request.budget_min.toLocaleString()} - ${request.budget_max.toLocaleString()}`;
    }
    return t('vendor.negotiable');
  };

  if (loading) {
    return (
      <Card className="border-0 bg-card/70 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse border rounded-lg p-4">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full mb-2"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-muted rounded w-20"></div>
                  <div className="h-8 bg-muted rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="border-0 bg-card/70 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            {t('vendor.availableOpportunities')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <EmptyState 
            title={t('vendor.noOpportunities') || 'No opportunities found'}
            description={t('vendor.noOpportunitiesDesc') || 'Check back later for new procurement opportunities'}
            icon={<Target className="h-12 w-12" />}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-card/70 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          {t('vendor.availableOpportunities')}
        </CardTitle>
        <CardDescription>
          {isVerified ? t('vendor.submitOffersToWin') : t('vendor.completeVerificationToSubmit')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {requests.map((request) => (
            <div key={request.id} className="p-6 hover:bg-muted/50 transition-all duration-200">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{request.title}</h3>
                      <Badge variant={getUrgencyColor(request.urgency) as any}>
                        {request.urgency}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2 line-clamp-2">{request.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="text-primary font-medium">{request.category}</span>
                      <span>{new Date(request.created_at).toLocaleDateString()}</span>
                      {request.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{request.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-lime/5 rounded-lg">
                    <DollarSign className="h-4 w-4 text-lime" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t('vendor.budget')}</p>
                      <p className="font-semibold text-sm">{formatBudget(request)} {request.currency || 'SAR'}</p>
                    </div>
                  </div>
                  
                  {request.deadline && (
                    <div className="flex items-center gap-2 p-3 bg-accent/5 rounded-lg">
                      <Calendar className="h-4 w-4 text-accent" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t('vendor.deadline')}</p>
                        <p className="font-semibold text-sm">{new Date(request.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                    <Clock className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t('vendor.posted')}</p>
                      <p className="font-semibold text-sm">{new Date(request.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onViewDetails?.(request.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t('vendor.viewDetails')}
                  </Button>
                  
                  {isVerified ? (
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-primary to-accent"
                      onClick={() => onSubmitOffer?.(request.id)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('vendor.submitOffer')}
                    </Button>
                  ) : (
                    <Button size="sm" disabled>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      {t('vendor.verificationRequired')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
