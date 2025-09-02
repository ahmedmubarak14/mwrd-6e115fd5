import React, { useState, useMemo, memo } from 'react';
import { Plus, Search, Filter, FolderOpen, Clock, CheckCircle, BarChart3, Building2, Eye, FileText, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjects } from '@/hooks/useProjects';
import { useVendorProjects } from '@/hooks/useVendorProjects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { ProjectForm } from '@/components/vendor/ProjectForm';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { MetricCard } from "@/components/ui/MetricCard";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const UnifiedProjectsContent = memo(() => {
  const { userProfile } = useAuth();
  const { t, isRTL } = useOptionalLanguage();
  const { projects: generalProjects, loading: generalLoading, getStatusColor, getPriorityColor } = useProjects();
  const { projects: vendorProjects, loading: vendorLoading, createProject, updateProject, deleteProject } = useVendorProjects();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('active');

  const loading = generalLoading || vendorLoading;

  // Mock portfolio data (would come from PortfolioManagement)
  const portfolioProjects = [
    {
      id: '1',
      title: 'Downtown Office Complex',
      description: 'Modern office building with sustainable features and smart building technology.',
      client: 'Metro Development Corp',
      location: 'Riyadh, Saudi Arabia',
      value: 2500000,
      completionDate: '2023-12-15',
      status: 'completed',
      category: 'Construction',
      images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop']
    },
    {
      id: '2',
      title: 'Smart City Infrastructure',
      description: 'IoT-enabled infrastructure project for smart city development including traffic management.',
      client: 'Saudi Smart Cities',
      location: 'NEOM, Saudi Arabia',
      value: 5000000,
      completionDate: '2024-01-20',
      status: 'completed',
      category: 'Technology',
      images: ['https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop']
    }
  ];

  // Combine all project data
  const allProjects = useMemo(() => {
    const combined = [
      ...(generalProjects || []).map(p => ({ ...p, source: 'general' })),
      ...(vendorProjects || []).map(p => ({ ...p, source: 'vendor' })),
      ...portfolioProjects.map(p => ({ ...p, source: 'portfolio' }))
    ];
    return combined;
  }, [generalProjects, vendorProjects]);

  // Project metrics
  const metrics = useMemo(() => {
    if (!allProjects || allProjects.length === 0) return { total: 0, active: 0, completed: 0, pending: 0 };
    
    return {
      total: allProjects.length,
      active: allProjects.filter(p => p.status === 'active').length,
      completed: allProjects.filter(p => p.status === 'completed').length,
      pending: allProjects.filter(p => p.status === 'draft' || p.status === 'pending').length,
    };
  }, [allProjects]);

  const getFilteredProjects = (tabStatus: string) => {
    if (!allProjects || allProjects.length === 0) return [];

    let filtered = allProjects;

    // Filter by tab
    if (tabStatus === 'active') {
      filtered = filtered.filter(p => p.status === 'active' || p.status === 'draft' || p.status === 'pending');
    } else if (tabStatus === 'completed') {
      filtered = filtered.filter(p => p.status === 'completed');
    } else if (tabStatus === 'portfolio') {
      filtered = filtered.filter(p => p.source === 'portfolio');
    }

    // Apply search and other filters
    return filtered.filter(project => {
      const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || (project as any).priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  };

  const filteredProjects = getFilteredProjects(activeTab);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  const handleEdit = (project: any) => {
    if (project.source === 'vendor') {
      setSelectedProject(project);
      setShowProjectForm(true);
    } else {
      console.log('Edit project:', project);
    }
  };

  const handleDelete = async (project: any) => {
    if (project.source === 'vendor') {
      try {
        await deleteProject(project.id);
        toast.success(t('vendor.projects.projectDeleted'));
      } catch (error) {
        toast.error(t('vendor.projects.deleteFailed'));
      }
    } else {
      console.log('Delete project:', project);
    }
  };

  const handleView = (project: any) => {
    console.log('View project:', project);
  };

  const handleCloseForm = () => {
    setSelectedProject(null);
    setShowProjectForm(false);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { color: 'bg-green-500', label: t('vendor.projects.active'), variant: 'default' as const };
      case 'completed':
        return { color: 'bg-blue-500', label: t('vendor.projects.completed'), variant: 'secondary' as const };
      case 'draft':
        return { color: 'bg-yellow-500', label: t('vendor.projects.draft'), variant: 'outline' as const };
      case 'pending':
        return { color: 'bg-orange-500', label: t('vendor.projects.pending'), variant: 'outline' as const };
      default:
        return { color: 'bg-gray-500', label: status, variant: 'outline' as const };
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
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
    <ErrorBoundary>
      <div className="p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        
        {/* Header */}
        <div className={cn(
          "flex flex-col gap-4 md:flex-row md:justify-between md:items-start mb-8",
          isRTL && "md:flex-row-reverse"
        )}>
          <div className={cn(isRTL && "text-right")}>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
              {t('vendor.projects.title')}
            </h1>
            <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
              {t('vendor.projects.unifiedSubtitle')}
            </p>
          </div>
          <Button 
            onClick={() => setShowProjectForm(true)} 
            className="w-full md:w-auto gap-2"
          >
            <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
            {t('vendor.projects.newProject')}
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title={t('vendor.projects.totalProjects')}
            value={metrics.total}
            icon={FolderOpen}
            trend={{ value: 12, label: t('vendor.projects.vsLastMonth'), isPositive: true }}
          />
          <MetricCard
            title={t('vendor.projects.activeProjects')}
            value={metrics.active}
            icon={BarChart3}
            trend={{ value: 3, label: t('vendor.projects.thisWeek'), isPositive: true }}
            variant="success"
          />
          <MetricCard
            title={t('vendor.projects.completed')}
            value={metrics.completed}
            icon={CheckCircle}
            variant="success"
          />
          <MetricCard
            title={t('vendor.projects.pending')}
            value={metrics.pending}
            icon={Clock}
            variant="warning"
          />
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className={cn(
              "flex items-center gap-2",
              isRTL && "flex-row-reverse"
            )}>
              <Filter className="h-5 w-5" />
              {t('vendor.projects.searchAndFilter')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className={cn(
                    "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground",
                    isRTL ? "right-3" : "left-3"
                  )} />
                  <Input
                    placeholder={t('vendor.projects.searchProjects')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={cn(isRTL ? "pr-10 text-right" : "pl-10")}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={t('vendor.projects.allStatus')} />
                </SelectTrigger>
                <SelectContent align={isRTL ? 'end' : 'start'}>
                  <SelectItem value="all">{t('vendor.projects.allStatus')}</SelectItem>
                  <SelectItem value="draft">{t('vendor.projects.draft')}</SelectItem>
                  <SelectItem value="active">{t('vendor.projects.active')}</SelectItem>
                  <SelectItem value="completed">{t('vendor.projects.completed')}</SelectItem>
                  <SelectItem value="pending">{t('vendor.projects.pending')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={t('vendor.projects.allPriority')} />
                </SelectTrigger>
                <SelectContent align={isRTL ? 'end' : 'start'}>
                  <SelectItem value="all">{t('vendor.projects.allPriority')}</SelectItem>
                  <SelectItem value="low">{t('vendor.projects.low')}</SelectItem>
                  <SelectItem value="medium">{t('vendor.projects.medium')}</SelectItem>
                  <SelectItem value="high">{t('vendor.projects.high')}</SelectItem>
                  <SelectItem value="urgent">{t('vendor.projects.urgent')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all') && (
              <div className={cn(
                "flex items-center gap-2 text-sm text-muted-foreground",
                isRTL && "flex-row-reverse"
              )}>
                <span>{t('vendor.projects.showingResults').replace('{count}', filteredProjects.length.toString()).replace('{total}', metrics.total.toString())}</span>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  {t('vendor.projects.clearFilters')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {t('vendor.projects.activeProjects')}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {t('vendor.projects.completedProjects')}
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {t('vendor.projects.portfolio')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {/* Projects Grid */}
            {filteredProjects.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <Card key={`${project.source}-${project.id}`} className="group hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <h3 className="font-semibold text-lg line-clamp-1">
                              {project.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {project.description}
                            </p>
                          </div>
                          <Badge variant={getStatusInfo(project.status).variant}>
                            {getStatusInfo(project.status).label}
                          </Badge>
                        </div>

                        {/* Project Details */}
                        <div className="space-y-2 text-sm text-muted-foreground">
                          {((project as any).client || (project as any).client_id) && (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              <span>{(project as any).client || `Client ${(project as any).client_id?.slice(0, 8)}...`}</span>
                            </div>
                          )}
                          {project.location && (
                            <div className="flex items-center gap-2">
                              <span>📍</span>
                              <span>{project.location}</span>
                            </div>
                          )}
                          {((project as any).value || (project as any).budget_total) && (
                            <div className="flex items-center gap-2">
                              <span>💰</span>
                              <span>${((project as any).value || (project as any).budget_total)?.toLocaleString()}</span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(project)}
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {t('common.view')}
                          </Button>
                          {project.source === 'vendor' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(project)}
                              >
                                {t('common.edit')}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(project)}
                              >
                                {t('common.delete')}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
                      ? t('vendor.projects.noProjectsFound')
                      : t('vendor.projects.startFirstProject')}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                      ? t('vendor.projects.tryAdjusting')
                      : t('vendor.projects.createFirstProject')}
                  </p>

                  {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
                    <Button 
                      onClick={() => setShowProjectForm(true)} 
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {t('vendor.projects.createYourFirst')}
                    </Button>
                  )}

                  {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all') && (
                    <Button variant="outline" onClick={clearFilters} className="gap-2">
                      <FolderOpen className="h-4 w-4" />
                      {t('vendor.projects.clearFilters')}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <CreateProjectModal 
          open={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
        />

        {showProjectForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <ProjectForm
                project={selectedProject}
                onClose={handleCloseForm}
              />
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
});

UnifiedProjectsContent.displayName = 'UnifiedProjectsContent';

export const UnifiedProjects = () => {
  return (
    <ErrorBoundary>
      <UnifiedProjectsContent />
    </ErrorBoundary>
  );
};