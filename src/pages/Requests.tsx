
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRequests } from "@/hooks/useRequests";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RequestDetailsModal } from "@/components/modals/RequestDetailsModal";
import { Calendar, Package, MapPin, Clock, Plus } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const Requests = () => {
  const { t } = useLanguage();
  const { requests, loading } = useRequests();
  const navigate = useNavigate();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t('nav.requests')}
            </h1>
            <p className="text-muted-foreground">
              {t('requests.description')}
            </p>
          </div>
          <Button 
            size="lg" 
            className="gap-2"
            onClick={() => navigate('/requests/create')}
          >
            <Plus className="h-4 w-4" />
            {t('requests.createNew')}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {requests?.map((request) => (
            <RequestDetailsModal
              key={request.id}
              request={request}
              userRole="client"
            >
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{request.title}</CardTitle>
                    <Badge variant={
                      request.status === 'new' ? 'default' :
                      request.status === 'in_progress' ? 'secondary' :
                      request.status === 'completed' ? 'outline' : 'destructive'
                    }>
                      {request.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {request.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span>{request.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{request.location || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {request.deadline ? format(new Date(request.deadline), 'MMM dd, yyyy') : 'No deadline'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{format(new Date(request.created_at), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </RequestDetailsModal>
          ))}
        </div>

        {requests?.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('requests.noRequests')}</h3>
            <p className="text-muted-foreground mb-4">{t('requests.createFirst')}</p>
            <Button onClick={() => navigate('/requests/create')}>
              <Plus className="h-4 w-4 mr-2" />
              {t('requests.createNew')}
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Requests;
