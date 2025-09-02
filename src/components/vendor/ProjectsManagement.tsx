import React, { useState } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useVendorProjects } from "@/hooks/useVendorProjects";
import { useLanguage } from "@/contexts/LanguageContext";
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

const ProjectsManagementContent = React.memo(() => {
  const { projects, loading, deleteProject } = useVendorProjects();
  const languageContext = useLanguage();
  const { toast } = useToast();
  const { isRTL, t, formatCurrency } = languageContext || { 
    isRTL: false,
    t: (key: string) => key.split('.').pop() || key,
    formatCurrency: (amount: number) => `${amount.toLocaleString()} SAR`
  };
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: 'bg-success/10 text-success border-success/20', label: t('vendor.projects.completed') };
      case 'ongoing':
        return { color: 'bg-primary/10 text-primary border-primary/20', label: t('vendor.projects.ongoing') };
      case 'cancelled':
        return { color: 'bg-destructive/10 text-destructive border-destructive/20', label: t('vendor.projects.cancelled') };
      default:
        return { color: 'bg-muted/10 text-muted-foreground border-muted/20', label: status };
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
    <div className={cn("space-y-6", isRTL && "rtl")} dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Header */}
      <div className={cn(
        "flex items-center justify-between",
        isRTL && "flex-row-reverse"
      )}>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
            {t('vendor.projects.title')}
          </h1>
          <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
            {t('vendor.projects.showcasePortfolio')}
          </p>
        </div>
        
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setSelectedProject(null)}
              className={cn(
                "gap-2",
                isRTL && "flex-row-reverse"
              )}
            >
              <Plus className="h-4 w-4" />
              {t('vendor.projects.add')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedProject ? t('vendor.projects.edit') : t('vendor.projects.add')}
              </DialogTitle>
              <DialogDescription>
                {selectedProject ? t('vendor.projects.updateProjectInfo') : t('vendor.projects.addNewProject')}
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
            <Button 
              onClick={() => setShowForm(true)}
              className={cn(
                "gap-2",
                isRTL && "flex-row-reverse"
              )}
            >
              <Plus className="h-4 w-4" />
              {t('vendor.projects.add')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const statusInfo = getStatusInfo(project.status);
            return (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className={cn(
                    "flex items-start justify-between",
                    isRTL && "flex-row-reverse"
                  )}>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg">
                        <span className="truncate">{project.title}</span>
                      </CardTitle>
                      <div className={cn(
                        "flex items-center space-x-2 mt-2",
                        isRTL && "space-x-reverse"
                      )}>
                        <Badge className={statusInfo.color}>
                          {statusInfo.label}
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
                      <div className={cn(
                        "flex items-center space-x-2 text-muted-foreground",
                        isRTL && "space-x-reverse"
                      )}>
                        <MapPin className="h-4 w-4" />
                        <span>{project.location}</span>
                      </div>
                    )}
                    
                    {project.budget_total && (
                      <div className={cn(
                        "flex items-center space-x-2 text-muted-foreground",
                        isRTL && "space-x-reverse"
                      )}>
                        <DollarSign className="h-4 w-4" />
                        <span>
                          {formatCurrency(project.budget_total)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className={cn(
                    "flex items-center justify-between mt-4 pt-4 border-t",
                    isRTL && "flex-row-reverse"
                  )}>
                    <Badge variant="outline" className={cn(
                      "gap-1",
                      isRTL && "flex-row-reverse"
                    )}>
                      <Building className="h-3 w-3" />
                      {project.category}
                    </Badge>
                    
                    <div className={cn(
                      "flex items-center space-x-1",
                      isRTL && "space-x-reverse"
                    )}>
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
});

ProjectsManagementContent.displayName = "ProjectsManagementContent";

export const ProjectsManagement = React.memo(() => {
  return (
    <ErrorBoundary>
      <ProjectsManagementContent />
    </ErrorBoundary>
  );
});

ProjectsManagement.displayName = "ProjectsManagement";