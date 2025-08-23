import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, DollarSign, Users, FileText } from 'lucide-react';
import { Project } from '@/hooks/useProjects';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}

export const ProjectCard = ({ 
  project, 
  onView, 
  onEdit, 
  onDelete, 
  getStatusColor, 
  getPriorityColor 
}: ProjectCardProps) => {
  const formatBudget = (amount?: number, currency = 'SAR') => {
    if (!amount) return 'Budget not set';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor(project.status)}>
                {project.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge variant="outline" className={getPriorityColor(project.priority)}>
                {project.priority.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {project.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          {project.budget_total && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>{formatBudget(project.budget_total, project.currency)}</span>
            </div>
          )}
          
          {project.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{project.location}</span>
            </div>
          )}

          {project.start_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(new Date(project.start_date), 'MMM dd, yyyy')}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>{project.boq_items?.length || 0} BOQ items</span>
          </div>
        </div>

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{project.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onView(project)}>
          View Details
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(project)}>
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(project)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};