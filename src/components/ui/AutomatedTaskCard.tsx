import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle, User } from 'lucide-react';
import { AutomatedTask } from '@/hooks/useWorkflowAutomation';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface AutomatedTaskCardProps {
  task: AutomatedTask;
  onStatusChange?: (taskId: string, status: AutomatedTask['status']) => void;
  onDelete?: (taskId: string) => void;
  compact?: boolean;
}

export const AutomatedTaskCard = ({ 
  task, 
  onStatusChange, 
  onDelete, 
  compact = false 
}: AutomatedTaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';

  if (compact) {
    return (
      <div className={cn(
        "flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors",
        isOverdue && "border-red-200 bg-red-50"
      )}>
        <div className={cn("w-2 h-2 rounded-full", getPriorityColor(task.priority))} />
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{task.title}</p>
          <p className="text-xs text-muted-foreground">
            {task.due_date && format(new Date(task.due_date), 'MMM d')}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {getStatusIcon(task.status)}
          <Badge variant="outline" className="text-xs">
            {task.status}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn(
      "hover:shadow-md transition-shadow",
      isOverdue && "border-red-200",
      task.status === 'completed' && "opacity-75"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={cn("w-3 h-3 rounded-full mt-1", getPriorityColor(task.priority))} />
            <div className="min-w-0">
              <CardTitle className="text-base">{task.title}</CardTitle>
              {task.description && (
                <CardDescription className="text-sm mt-1">
                  {task.description}
                </CardDescription>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusIcon(task.status)}
            <Badge 
              variant={task.status === 'completed' ? 'default' : 'outline'}
              className={cn(
                task.status === 'completed' && 'bg-green-500 text-white',
                task.status === 'in_progress' && 'bg-blue-500 text-white'
              )}
            >
              {task.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              Assigned
            </div>
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {task.priority} priority
            </div>
            {task.reference_type && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {task.reference_type}
              </div>
            )}
          </div>
          
          <div className="text-right">
            <p>Created: {format(new Date(task.created_at), 'MMM d')}</p>
            {task.due_date && (
              <p className={cn(
                isOverdue && "text-red-500 font-medium"
              )}>
                Due: {format(new Date(task.due_date), 'MMM d')}
                {isOverdue && " (Overdue)"}
              </p>
            )}
          </div>
        </div>

        {task.status !== 'completed' && onStatusChange && (
          <div className="flex gap-2">
            {task.status === 'pending' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onStatusChange(task.id, 'in_progress')}
              >
                Start Task
              </Button>
            )}
            
            {task.status === 'in_progress' && (
              <Button 
                size="sm" 
                onClick={() => onStatusChange(task.id, 'completed')}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Complete
              </Button>
            )}
            
            {onDelete && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onDelete(task.id)}
              >
                Cancel
              </Button>
            )}
          </div>
        )}

        {task.status === 'completed' && task.completed_at && (
          <div className="text-xs text-green-600 bg-green-50 rounded p-2">
            Completed on {format(new Date(task.completed_at), 'MMM d, yyyy HH:mm')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};