import React, { useState } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Building2,
  MapPin,
  DollarSign
} from "lucide-react";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  description: string;
  client: string;
  location: string;
  value: number;
  completedDate: string;
  status: 'completed' | 'in-progress' | 'pending';
  category: string;
  images: string[];
}

// Mock data - replace with actual data from hooks
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Commercial Building Construction',
    description: 'Complete construction of a 10-story commercial building in downtown Riyadh',
    client: 'Al-Rajhi Company',
    location: 'Riyadh, Saudi Arabia',
    value: 5000000,
    completedDate: '2024-01-15',
    status: 'completed',
    category: 'Construction',
    images: ['/lovable-uploads/af2b3169-fe97-4bcd-b685-1ebacc0453de.png']
  },
  {
    id: '2',
    title: 'Hospital Interior Design',
    description: 'Interior design and furniture for King Faisal Specialist Hospital',
    client: 'Ministry of Health',
    location: 'Jeddah, Saudi Arabia',
    value: 2500000,
    completedDate: '2024-03-20',
    status: 'completed',
    category: 'Interior Design',
    images: ['/lovable-uploads/c18ac1e0-584d-4883-aaa4-4ef9d5a17d85.png']
  }
];

const PortfolioManagementContent = React.memo(() => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const languageContext = useOptionalLanguage();
  const { t, isRTL, formatCurrency } = languageContext || { 
    t: (key: string) => key.split('.').pop() || key, 
    isRTL: false,
    formatCurrency: (amount: number) => `${amount.toLocaleString()} SAR`
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      case 'in-progress':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return t('vendor.portfolio.completed');
      case 'in-progress':
        return t('vendor.portfolio.inProgress');
      case 'pending':
        return t('vendor.portfolio.pending');
      default:
        return status;
    }
  };

  const handleAddProject = () => {
    console.log('Add new project');
  };

  const handleEditProject = (projectId: string) => {
    console.log('Edit project:', projectId);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const handleViewProject = (projectId: string) => {
    console.log('View project:', projectId);
  };

  return (
    <div className={cn("space-y-6", isRTL && "rtl")} dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Header */}
      <div className={cn(
        "flex items-center justify-between",
        isRTL && "flex-row-reverse"
      )}>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
            {t('vendor.portfolio.title')}
          </h1>
          <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
            {t('vendor.portfolio.description')}
          </p>
        </div>
        <Button 
          onClick={handleAddProject}
          className={cn(
            "gap-2",
            isRTL && "flex-row-reverse"
          )}
        >
          <Plus className="h-4 w-4" />
          {t('vendor.portfolio.addProject')}
        </Button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card className="p-12 text-center">
          <CardContent className="space-y-4">
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">{t('vendor.portfolio.noProjects')}</h3>
              <p className="text-muted-foreground">{t('vendor.portfolio.addFirstProject')}</p>
            </div>
            <Button 
              onClick={handleAddProject} 
              className={cn(
                "gap-2",
                isRTL && "flex-row-reverse"
              )}
            >
              <Plus className="h-4 w-4" />
              {t('vendor.portfolio.addProject')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Project Image */}
              {project.images.length > 0 && (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={project.images[0]} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge 
                    className={cn(
                      "absolute top-3",
                      isRTL ? "right-3" : "left-3",
                      getStatusColor(project.status)
                    )}
                  >
                    {getStatusLabel(project.status)}
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-3">
                <div className={cn(
                  "flex items-start justify-between gap-2",
                  isRTL && "flex-row-reverse"
                )}>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg truncate">{project.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {project.category}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>

                {/* Project Details */}
                <div className="space-y-2 text-sm">
                  <div className={cn(
                    "flex items-center gap-2 text-muted-foreground",
                    isRTL && "flex-row-reverse"
                  )}>
                    <Building2 className="h-4 w-4 shrink-0" />
                    <span className="truncate">{project.client}</span>
                  </div>
                  
                  <div className={cn(
                    "flex items-center gap-2 text-muted-foreground",
                    isRTL && "flex-row-reverse"
                  )}>
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="truncate">{project.location}</span>
                  </div>
                  
                  <div className={cn(
                    "flex items-center gap-2 text-muted-foreground",
                    isRTL && "flex-row-reverse"
                  )}>
                    <DollarSign className="h-4 w-4 shrink-0" />
                    <span className="font-medium text-foreground">
                      {formatCurrency(project.value)}
                    </span>
                  </div>
                  
                  <div className={cn(
                    "flex items-center gap-2 text-muted-foreground",
                    isRTL && "flex-row-reverse"
                  )}>
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>{new Date(project.completedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className={cn(
                  "flex gap-2 pt-2",
                  isRTL && "flex-row-reverse"
                )}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewProject(project.id)}
                    className={cn(
                      "flex-1 gap-1",
                      isRTL && "flex-row-reverse"
                    )}
                  >
                    <Eye className="h-3 w-3" />
                    {t('vendor.portfolio.viewProject')}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditProject(project.id)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
});

PortfolioManagementContent.displayName = "PortfolioManagementContent";

export const PortfolioManagement = React.memo(() => {
  return (
    <ErrorBoundary>
      <PortfolioManagementContent />
    </ErrorBoundary>
  );
});

PortfolioManagement.displayName = "PortfolioManagement";