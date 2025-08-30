import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Settings, Clock, Zap, Bell, AlertTriangle, CheckCircle, Plus, Activity, TrendingUp, PlayCircle, PauseCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWorkflowAutomation, useAutomatedTasks } from '@/hooks/useWorkflowAutomation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';

export const WorkflowAutomation = () => {
  const { toast } = useToast();
  const { t } = useOptionalLanguage();
  
  const {
    workflows,
    executions,
    loading: workflowLoading,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    toggleWorkflowStatus,
    triggerWorkflow,
    refetch: refetchWorkflows
  } = useWorkflowAutomation();

  const {
    tasks,
    loading: tasksLoading,
    updateTaskStatus,
    deleteTask,
    getTasksByStatus,
    getOverdueTasks,
    refetch: refetchTasks
  } = useAutomatedTasks();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    trigger_type: 'manual',
    trigger_conditions: {},
    actions: {},
    status: 'draft' as 'active' | 'inactive' | 'draft',
    priority: 1,
    delay_minutes: 0
  });

  const handleCreateWorkflow = async () => {
    if (!newWorkflow.name.trim()) {
      toast({
        title: t('common.error'),
        description: t('admin.workflowAutomation.messages.nameRequired'),
        variant: 'destructive'
      });
      return;
    }

    try {
      await createWorkflow(newWorkflow);
      setShowCreateDialog(false);
      setNewWorkflow({
        name: '',
        description: '',
        trigger_type: 'manual',
        trigger_conditions: {},
        actions: {},
        status: 'draft',
        priority: 1,
        delay_minutes: 0
      });
      toast({
        title: t('common.success'),
        description: t('admin.workflowAutomation.messages.created')
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('admin.workflowAutomation.messages.createError'),
        variant: 'destructive'
      });
    }
  };

  const handleToggleWorkflow = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await toggleWorkflowStatus(id, newStatus);
      const statusText = newStatus === 'active' ? t('admin.workflowAutomation.messages.enabled') : t('admin.workflowAutomation.messages.disabled');
      toast({
        title: t('common.success'),
        description: `Workflow ${statusText}`
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('admin.workflowAutomation.messages.toggleError'),
        variant: 'destructive'
      });
    }
  };

  const handleDeleteWorkflow = async (id: string) => {
    try {
      await deleteWorkflow(id);
      toast({
        title: t('common.success'),
        description: t('admin.workflowAutomation.messages.deleted')
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('admin.workflowAutomation.messages.deleteError'),
        variant: 'destructive'
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'inactive': return <PauseCircle className="h-4 w-4 text-muted-foreground" />;
      case 'draft': return <Clock className="h-4 w-4 text-warning" />;
      default: return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'draft': return 'outline';
      default: return 'destructive';
    }
  };

  const loading = workflowLoading || tasksLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" label={t('admin.workflowAutomation.messages.loading')} />
      </div>
    );
  }

  const activeTasks = getTasksByStatus('pending');
  const overdueTasks = getOverdueTasks();
  const activeWorkflows = workflows.filter(w => w.status === 'active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                {t('admin.workflowAutomation.automationCenter')}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {t('admin.workflowAutomation.automationDescription')}
              </p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {t('admin.workflowAutomation.createWorkflow')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{t('admin.workflowAutomation.workflowForm.createTitle')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">{t('admin.workflowAutomation.workflowForm.workflowName')}</Label>
                    <Input
                      id="name"
                      placeholder={t('admin.workflowAutomation.workflowForm.workflowNamePlaceholder')}
                      value={newWorkflow.name}
                      onChange={(e) => setNewWorkflow(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">{t('admin.workflowAutomation.workflowForm.description')}</Label>
                    <Textarea
                      id="description"
                      placeholder={t('admin.workflowAutomation.workflowForm.descriptionPlaceholder')}
                      value={newWorkflow.description}
                      onChange={(e) => setNewWorkflow(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="trigger">{t('admin.workflowAutomation.workflowForm.triggerType')}</Label>
                      <Input
                        id="trigger"
                        placeholder={t('admin.workflowAutomation.workflowForm.triggerPlaceholder')}
                        value={newWorkflow.trigger_type}
                        onChange={(e) => setNewWorkflow(prev => ({ ...prev, trigger_type: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="priority">{t('admin.workflowAutomation.workflowForm.priority')}</Label>
                      <Input
                        id="priority"
                        type="number"
                        min="1"
                        max="10"
                        value={newWorkflow.priority}
                        onChange={(e) => setNewWorkflow(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      {t('admin.workflowAutomation.workflowForm.cancel')}
                    </Button>
                    <Button onClick={handleCreateWorkflow}>
                      {t('admin.workflowAutomation.workflowForm.createButton')}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.workflowAutomation.overview.activeWorkflows')}</p>
                <p className="text-2xl font-bold">{activeWorkflows.length}</p>
              </div>
              <Zap className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.workflowAutomation.overview.totalExecutions')}</p>
                <p className="text-2xl font-bold">{executions.length}</p>
              </div>
              <Activity className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.workflowAutomation.overview.pendingTasks')}</p>
                <p className="text-2xl font-bold">{activeTasks.length}</p>
              </div>
              <Clock className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.workflowAutomation.overview.successRate')}</p>
                <p className="text-2xl font-bold">
                  {executions.length > 0 
                    ? Math.round((executions.filter(e => e.status === 'completed').length / executions.length) * 100)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="workflows" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflows">{t('admin.workflowAutomation.tabs.workflows')}</TabsTrigger>
          <TabsTrigger value="executions">{t('admin.workflowAutomation.tabs.executionHistory')}</TabsTrigger>
          <TabsTrigger value="tasks">{t('admin.workflowAutomation.tabs.tasks')}</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className={`relative ${workflow.status === 'active' ? 'border-primary/20' : 'border-muted'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(workflow.status)}
                        <h3 className="font-medium text-sm">{workflow.name}</h3>
                      </div>
                      <Badge variant={getStatusColor(workflow.status)} className="text-xs">
                        {workflow.status}
                      </Badge>
                    </div>
                    <Switch
                      checked={workflow.status === 'active'}
                      onCheckedChange={() => handleToggleWorkflow(workflow.id, workflow.status)}
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {workflow.description && (
                    <p className="text-xs text-muted-foreground">{workflow.description}</p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{t('admin.workflowAutomation.workflowCard.trigger')}</span>
                      <span className="font-medium">{workflow.trigger_type.replace('_', ' ')}</span>
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{t('admin.workflowAutomation.workflowCard.priority')}</span>
                      <span className="font-medium">{workflow.priority}</span>
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{t('admin.workflowAutomation.workflowCard.created')}</span>
                      <span className="font-medium">{new Date(workflow.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => triggerWorkflow(workflow.trigger_type, { workflow_id: workflow.id })}
                      disabled={workflow.status !== 'active'}
                      className="flex-1 text-xs"
                    >
                      <PlayCircle className="h-3 w-3 mr-1" />
                      {t('admin.workflowAutomation.workflowCard.execute')}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteWorkflow(workflow.id)}
                      className="text-xs"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="executions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('admin.workflowAutomation.executions.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {executions.slice(0, 10).map((execution) => (
                  <div key={execution.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {execution.status === 'completed' && <CheckCircle className="h-4 w-4 text-success" />}
                      {execution.status === 'failed' && <AlertTriangle className="h-4 w-4 text-destructive" />}
                      {execution.status === 'running' && <Clock className="h-4 w-4 text-warning" />}
                      
                      <div>
                        <p className="font-medium text-sm">{t('admin.workflowAutomation.executions.workflowId')}{execution.workflow_rule_id}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(execution.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant={execution.status === 'completed' ? 'default' : execution.status === 'failed' ? 'destructive' : 'secondary'}>
                        {execution.status}
                      </Badge>
                      {execution.completed_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('admin.workflowAutomation.executions.duration')} {Math.round((new Date(execution.completed_at).getTime() - new Date(execution.created_at).getTime()) / 1000)}s
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                
                {executions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('admin.workflowAutomation.executions.noExecutions')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pending Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t('admin.workflowAutomation.tasks.pendingTitle')} ({activeTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {t('admin.workflowAutomation.tasks.priorityLabel')} {task.priority} | {t('admin.workflowAutomation.tasks.dueLabel')} {task.due_date ? new Date(task.due_date).toLocaleDateString() : t('admin.workflowAutomation.tasks.noDueDate')}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                      >
                        {t('admin.workflowAutomation.tasks.complete')}
                      </Button>
                    </div>
                  ))}
                  
                  {activeTasks.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      {t('admin.workflowAutomation.tasks.noPendingTasks')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Overdue Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  {t('admin.workflowAutomation.tasks.overdueTitle')} ({overdueTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overdueTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border border-destructive/20 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-destructive">
                          Overdue by {task.due_date ? Math.ceil((Date.now() - new Date(task.due_date).getTime()) / (1000 * 60 * 60 * 24)) : 0} days
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTaskStatus(task.id, 'completed')}
                        >
                          {t('admin.workflowAutomation.tasks.complete')}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {overdueTasks.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      {t('admin.workflowAutomation.tasks.noOverdueTasks')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};