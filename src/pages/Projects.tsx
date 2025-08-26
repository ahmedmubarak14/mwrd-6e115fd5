
import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjects } from '@/hooks/useProjects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CleanDashboardLayout } from "@/components/layout/CleanDashboardLayout";
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

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleView = (project: any) => {
    // Navigate to project details page
    window.location.href = `/projects/${project.id}`;
  };

  const handleEdit = (project: any) => {
    // Open edit modal or navigate to edit page
    console.log('Edit project:', project);
  };

  const handleDelete = (project: any) => {
    // Show confirmation dialog and delete
    console.log('Delete project:', project);
  };

  if (loading) {
    return (
      <CleanDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </CleanDashboardLayout>
    );
  }

  return (
    <CleanDashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground">Manage your procurement projects</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg border p-6 mb-8">
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
                <Filter className="h-4 w-4 mr-2" />
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
                <Filter className="h-4 w-4 mr-2" />
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
              Showing {filteredProjects.length} of {projects.length} projects
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Create your first project to get started with procurement management.'}
            </p>
            {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
              <Button onClick={() => setShowCreateModal(true)}>
                Create Your First Project
              </Button>
            )}
          </div>
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
      </div>
    </CleanDashboardLayout>
  );
}
