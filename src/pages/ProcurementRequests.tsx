
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRequests } from "@/hooks/useRequests";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateRequestModal } from "@/components/modals/CreateRequestModal";
import { RequestDetailsModal } from "@/components/modals/RequestDetailsModal";
import { Calendar, Package, MapPin, Clock, Plus, FileText } from "lucide-react";
import { format } from "date-fns";

const ProcurementRequests = () => {
  const { t } = useLanguage();
  const { requests, loading, refetch } = useRequests();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateSuccess = () => {
    refetch();
    setShowCreateModal(false);
  };

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
              {t('nav.procurementRequests') || 'Procurement Requests'}
            </h1>
            <p className="text-muted-foreground">
              Manage your procurement requests and track their progress
            </p>
          </div>
          <Button 
            size="lg" 
            className="gap-2"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4" />
            Create New Request
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {requests?.map((request) => (
            <Card 
              key={request.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedRequest(request)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {request.title}
                  </CardTitle>
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
          ))}
        </div>

        {requests?.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No procurement requests found</h3>
            <p className="text-muted-foreground mb-4">Create your first procurement request to get started</p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Request
            </Button>
          </div>
        )}

        <CreateRequestModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
        />

        {selectedRequest && (
          <RequestDetailsModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProcurementRequests;
