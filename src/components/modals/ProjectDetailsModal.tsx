import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, DollarSign, MapPin, Users, FileText, Plus, Edit } from 'lucide-react';
import { Project, useProjects } from '@/hooks/useProjects';
import { useBOQ } from '@/hooks/useBOQ';
import { CreateBOQItemModal } from '@/components/modals/CreateBOQItemModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProjectDetailsModalProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProjectDetailsModal = ({ project, open, onOpenChange }: ProjectDetailsModalProps) => {
  const { getStatusColor, getPriorityColor, formatBudget } = useProjects();
  const { boqItems, loading: boqLoading, getStatusColor: getBOQStatusColor, getTotalValue } = useBOQ(project.id);
  const [showCreateBOQModal, setShowCreateBOQModal] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-2xl">{project.title}</DialogTitle>
                <div className="flex gap-2 mt-2">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <Badge className={getPriorityColor(project.priority)}>
                    {project.priority}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="boq">BOQ Items</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {project.description && (
                      <div>
                        <h4 className="font-medium mb-1">Description</h4>
                        <p className="text-muted-foreground">{project.description}</p>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      {project.category && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{project.category}</span>
                        </div>
                      )}
                      
                      {project.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{project.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Created {new Date(project.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      {(project.start_date || project.end_date) && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {project.start_date && `From ${new Date(project.start_date).toLocaleDateString()}`}
                            {project.start_date && project.end_date && ' - '}
                            {project.end_date && `To ${new Date(project.end_date).toLocaleDateString()}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Financial Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Total Budget</p>
                        <p className="text-lg">{formatBudget(project)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">BOQ Total Value</p>
                        <p className="text-lg">{getTotalValue().toLocaleString()} SAR</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {project.tags && project.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="boq" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Bill of Quantities</h3>
                <Button onClick={() => setShowCreateBOQModal(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {boqLoading ? (
                <LoadingSpinner />
              ) : boqItems.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h4 className="text-lg font-semibold mb-2">No BOQ items</h4>
                    <p className="text-muted-foreground text-center mb-4">
                      Add items to your Bill of Quantities to get started.
                    </p>
                    <Button onClick={() => setShowCreateBOQModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Item
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {boqItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{item.description}</h4>
                              <Badge className={getBOQStatusColor(item.status)}>
                                {item.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                              <div>
                                <span className="font-medium">Category:</span> {item.category}
                              </div>
                              <div>
                                <span className="font-medium">Quantity:</span> {item.quantity} {item.unit}
                              </div>
                              <div>
                                <span className="font-medium">Unit Price:</span> {item.unit_price?.toLocaleString() || 'TBD'} SAR
                              </div>
                              <div>
                                <span className="font-medium">Total:</span> {item.total_price?.toLocaleString() || 'TBD'} SAR
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total BOQ Value:</span>
                        <span className="text-lg font-bold">{getTotalValue().toLocaleString()} SAR</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="requests">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h4 className="text-lg font-semibold mb-2">No requests yet</h4>
                  <p className="text-muted-foreground text-center mb-4">
                    Requests linked to this project will appear here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <CreateBOQItemModal
        projectId={project.id}
        open={showCreateBOQModal}
        onOpenChange={setShowCreateBOQModal}
      />
    </>
  );
};