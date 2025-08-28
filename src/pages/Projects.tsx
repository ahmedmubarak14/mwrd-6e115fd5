import { ClientPageContainer } from "@/components/layout/ClientPageContainer";
import { useState, useMemo } from 'react';
import { Plus, Search, Filter, FolderOpen, Clock, CheckCircle, BarChart3, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjects } from '@/hooks/useProjects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MetricCard } from "@/components/ui/MetricCard";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Projects() {
  const { projects, loading, getStatusColor, getPriorityColor } = useProjects();
  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const isRTL = language === 'ar';

  // Project metrics
  const metrics = useMemo(() => {
    if (!projects || projects.length === 0) return { total: 0, active: 0, completed: 0, pending: 0 };
    
    return {
      total: projects.length,
      active: projects.filter(p => p.status === 'active').length,
      completed: projects.filter(p => p.status === 'completed').length,
      pending: projects.filter(p => p.status === 'draft').length,
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];

    return projects.filter(project => {
      const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [projects, searchTerm, statusFilter, priorityFilter]);

  const handleView = (project: any) => {
    window.location.href = `/projects/${project.id}`;
  };

  const handleEdit = (project: any) => {
    console.log('Edit project:', project);
  };

  const handleDelete = (project: any) => {
    console.log('Delete project:', project);
  };

  if (loading) {
    return (
      <ClientPageContainer>
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <MetricCard key={i} title="" value="" loading={true} />
          ))}
        </div>
      </ClientPageContainer>
    );
  }

  return (
    <ClientPageContainer
      title="Projects"
      description="Manage your procurement projects"
      headerActions={
        <Button 
          onClick={() => setShowCreateModal(true)} 
          className="w-full md:w-auto gap-2"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      }
    >

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Total Projects"
          value={metrics.total}
          icon={Building2}
          trend={{ value: 12, label: "vs last month", isPositive: true }}
        />
        <MetricCard
          title="Active Projects"
          value={metrics.active}
          icon={Clock}
          trend={{ value: 8, label: "this month", isPositive: true }}
        />
        <MetricCard
          title="Completed"
          value={metrics.completed}
          icon={CheckCircle}
          variant="success"
        />
        <MetricCard
          title="In Planning"
          value={metrics.pending}
          icon={BarChart3}
          variant="warning"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              Showing {filteredProjects.length} of {metrics.total} projects
            </div>
          </div>

          {(searchTerm || statusFilter !== "all" || priorityFilter !== "all") && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Showing {filteredProjects.length} of {metrics.total} projects</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title={searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' ? "No projects found" : "No projects yet"}
          description={
            searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try adjusting your filters to see more results.'
              : 'Create your first project to get started with procurement management.'
          }
          action={
            !searchTerm && statusFilter === 'all' && priorityFilter === 'all' ? {
              label: "Create Your First Project",
              onClick: () => setShowCreateModal(true),
              variant: "default" as const
            } : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
            />
          ))}
        </div>
      )}

      <CreateProjectModal 
        open={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </ClientPageContainer>
  );
}