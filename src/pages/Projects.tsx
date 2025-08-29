import { useState, useMemo } from 'react';
import { Plus, Search, Filter, FolderOpen, Clock, CheckCircle, BarChart3, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjects } from '@/hooks/useProjects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
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

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  const handleEdit = (project: any) => {
    console.log('Edit project:', project);
  };

  const handleDelete = (project: any) => {
    console.log('Delete project:', project);
  };

  const handleView = (project: any) => {
    console.log('View project:', project);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <MetricCard key={i} title="" value="" loading={true} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
            Projects
          </h1>
          <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
            Manage your procurement projects
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)} 
          className="w-full md:w-auto gap-2"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Total Projects"
          value={metrics.total}
          icon={FolderOpen}
          trend={{ value: 12, label: "vs last month", isPositive: true }}
        />
        <MetricCard
          title="Active Projects"
          value={metrics.active}
          icon={BarChart3}
          trend={{ value: 3, label: "this week", isPositive: true }}
          variant="success"
        />
        <MetricCard
          title="Completed"
          value={metrics.completed}
          icon={CheckCircle}
          variant="success"
        />
        <MetricCard
          title="Draft"
          value={metrics.pending}
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all') && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Showing {filteredProjects.length} of {metrics.total} projects</span>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <FolderOpen className="h-12 w-12 text-primary" />
            </div>
            
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                ? "No projects found" 
                : "Start Your First Project"}
            </h3>
            
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? "Try adjusting your search criteria or filters to find what you're looking for"
                : "Create your first project to organize your procurement activities and track progress"}
            </p>

            {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
              <Button 
                onClick={() => setShowCreateModal(true)} 
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Your First Project
              </Button>
            )}

            {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all') && (
              <Button variant="outline" onClick={clearFilters} className="gap-2">
                <FolderOpen className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <CreateProjectModal 
        open={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
}