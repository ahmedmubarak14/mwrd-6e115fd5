import { useState } from "react";
import { useVendorProjects } from "@/hooks/useVendorProjects";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  FolderOpen, 
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  User,
  DollarSign,
  Building,
  Star,
  Globe,
  Lock,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ProjectForm } from "./ProjectForm";

export const ProjectsManagement = () => {
  const { projects, loading, deleteProject } = useVendorProjects();
  const languageContext = useOptionalLanguage();
  const { toast } = useToast();
  const { isRTL } = languageContext || { isRTL: false };
  const t = languageContext?.t || ((key: string) => key);
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: 'bg-success text-success-foreground', label: t('vendor.projects.completed') };
      case 'ongoing':
        return { color: 'bg-primary text-primary-foreground', label: t('vendor.projects.ongoing') };
      case 'cancelled':
        return { color: 'bg-destructive text-destructive-foreground', label: t('vendor.projects.cancelled') };
      default:
        return { color: 'bg-muted text-muted-foreground', label: status };
    }
  };

  const getVisibilityIcon = (level: string) => {
    switch (level) {
      case 'public':
        return <Globe className="h-4 w-4" />;
      case 'private':
        return <Lock className="h-4 w-4" />;
      case 'confidential':
        return <Shield className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const handleDelete = async (projectId: string) => {
    setDeletingId(projectId);
    try {
      await deleteProject(projectId);
      toast({
        title: t('common.success'),
        description: t('vendor.projects.delete'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : 'Failed to delete project',
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (project: any) => {
    setSelectedProject(project);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setSelectedProject(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", isRTL && "rtl")}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('vendor.projects.title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            Showcase your completed projects and work portfolio
          </p>
        </div>
        
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedProject(null)}>
              <Plus className="h-4 w-4 mr-2 rtl:ml-2" />
              {t('vendor.projects.add')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedProject ? t('vendor.projects.edit') : t('vendor.projects.add')}
              </DialogTitle>
              <DialogDescription>
                {selectedProject ? 'Update your project information' : 'Add a new project to your portfolio'}
              </DialogDescription>
            </DialogHeader>
            <ProjectForm 
              project={selectedProject}
              onClose={handleCloseForm}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('vendor.projects.noProjects')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('vendor.projects.addFirst')}
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('vendor.projects.add')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            return (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg">
                        <span className="truncate">{project.title}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                        <Badge className="bg-success text-success-foreground">
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    {project.location && (
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{project.location}</span>
                      </div>
                    )}
                    
                    {project.budget_total && (
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          {project.budget_total.toLocaleString()} {project.currency || 'SAR'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <Badge variant="outline">
                      <Building className="h-3 w-3 mr-1 rtl:ml-1" />
                      {project.category}
                    </Badge>
                    
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                        className="text-destructive hover:text-destructive"
                      >
                        {deletingId === project.id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};