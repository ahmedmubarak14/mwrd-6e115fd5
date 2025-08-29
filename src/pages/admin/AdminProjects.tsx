import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Building2, Calendar, DollarSign, Package, Search, Eye, MessageSquare, FileText, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface AdminProject {
  id: string;
  title: string;
  description?: string;
  status: string;
  budget_total?: number;
  currency?: string;
  start_date?: string;
  end_date?: string;
  priority: string;
  category?: string;
  location?: string;
  created_at: string;
  updated_at: string;
  client_id: string;
  client?: {
    full_name?: string;
    company_name?: string;
    email: string;
  };
  boq_items?: any[];
  requests?: any[];
  _count?: {
    boq_items: number;
    requests: number;
  };
}

const AdminProjects = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          boq_items(id, status, total_price),
          requests(id, status, title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch client data separately to avoid the array issue
      const projectsWithClients = await Promise.all(
        (data || []).map(async (project) => {
          const { data: clientData } = await supabase
            .from('user_profiles')
            .select('full_name, company_name, email')
            .eq('user_id', project.client_id)
            .single();

          return {
            ...project,
            client: clientData || undefined,
            _count: {
              boq_items: project.boq_items?.length || 0,
              requests: project.requests?.length || 0
            }
          };
        })
      );

      setProjects(projectsWithClients as AdminProject[]);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch projects',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProjectStatus = async (projectId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Project status updated to ${status}`,
      });

      fetchProjects();
    } catch (error) {
      console.error('Error updating project status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project status',
        variant: 'destructive'
      });
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'active': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'destructive';
      case 'on_hold': return 'warning';
      default: return 'secondary';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'warning';
      case 'medium': return 'secondary';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const calculateProjectProgress = (project: AdminProject) => {
    if (!project.boq_items || project.boq_items.length === 0) return 0;
    
    const completedItems = project.boq_items.filter(item => item.status === 'approved').length;
    return (completedItems / project.boq_items.length) * 100;
  };

  const calculateTotalBudget = (project: AdminProject) => {
    if (!project.boq_items || project.boq_items.length === 0) {
      return project.budget_total || 0;
    }
    
    return project.boq_items.reduce((total, item) => {
      return total + (item.total_price || 0);
    }, 0);
  };

  const isProjectOverdue = (project: AdminProject) => {
    if (!project.end_date || project.status === 'completed') return false;
    return new Date(project.end_date) < new Date();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const activeProjects = projects.filter(p => p.status === 'active');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const overdueProjects = projects.filter(p => isProjectOverdue(p));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
          Project Management
        </h1>
        <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
          Monitor project lifecycles, BOQ items, and budget tracking across all client projects
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Building2 className="h-4 w-4 text-foreground opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-foreground opacity-75">
              {activeProjects.length} active projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Package className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{completedProjects.length}</div>
            <p className="text-xs text-foreground opacity-75">
              Projects delivered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueProjects.length}</div>
            <p className="text-xs text-foreground opacity-75">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-foreground opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.reduce((sum, p) => sum + calculateTotalBudget(p), 0).toLocaleString()} SAR
            </div>
            <p className="text-xs text-foreground opacity-75">
              Combined project value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground opacity-75" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={fetchProjects} variant="outline">
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-foreground opacity-75">No projects found matching your filters.</p>
            </CardContent>
          </Card>
        ) : (
          filteredProjects.map((project) => (
            <Card key={project.id} className={isProjectOverdue(project) ? 'border-red-200 bg-red-50' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      {isProjectOverdue(project) && (
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {project.description || 'No description provided'}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-foreground opacity-75">
                      <span>Client: {project.client?.company_name || project.client?.full_name}</span>
                      {project.category && (
                        <>
                          <span>•</span>
                          <span>{project.category}</span>
                        </>
                      )}
                      {project.location && (
                        <>
                          <span>•</span>
                          <span>{project.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 text-right">
                    <Badge variant={getStatusBadgeVariant(project.status)}>
                      {project.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge variant={getPriorityBadgeVariant(project.priority)}>
                      {project.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Project Progress</span>
                    <span>{Math.round(calculateProjectProgress(project))}%</span>
                  </div>
                  <Progress value={calculateProjectProgress(project)} className="w-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-foreground opacity-75">Budget</p>
                    <p className="text-lg font-bold text-primary">
                      {calculateTotalBudget(project).toLocaleString()} {project.currency || 'SAR'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground opacity-75">BOQ Items</p>
                    <p className="text-sm">{project._count?.boq_items || 0} items</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground opacity-75">Timeline</p>
                    <p className="text-sm">
                      {project.start_date && project.end_date
                        ? `${format(new Date(project.start_date), 'MMM dd')} - ${format(new Date(project.end_date), 'MMM dd, yyyy')}`
                        : 'Not specified'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground opacity-75">Requests</p>
                    <p className="text-sm">{project._count?.requests || 0} related requests</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    View BOQ
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    Contact Client
                  </Button>
                  
                  {project.status === 'active' && (
                    <>
                      <Button 
                        variant="outline"
                        size="sm" 
                        onClick={() => updateProjectStatus(project.id, 'on_hold')}
                      >
                        Put on Hold
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => updateProjectStatus(project.id, 'completed')}
                      >
                        Mark Complete
                      </Button>
                    </>
                  )}
                  
                  {project.status === 'on_hold' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateProjectStatus(project.id, 'active')}
                    >
                      Resume Project
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminProjects;
