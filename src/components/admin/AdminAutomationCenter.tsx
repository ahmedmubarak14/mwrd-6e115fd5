import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Zap, 
  Settings, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Plus,
  Edit,
  Trash2,
  Activity,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger_type: string;
  trigger_conditions: any;
  actions: any;
  status: string;
  priority: number;
  execution_count: number;
  last_executed_at?: string;
  created_at: string;
}

interface AutomationExecution {
  id: string;
  workflow_rule_id: string;
  status: string;
  trigger_data: any;
  created_at: string;
  completed_at?: string;
  error_message?: string;
  started_at?: string;
}

export const AdminAutomationCenter = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [executions, setExecutions] = useState<AutomationExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    trigger_type: 'request_created',
    conditions: {},
    actions: [],
    priority: 1
  });

  const triggerTypes = [
    { value: 'request_created', label: 'Request Created' },
    { value: 'offer_submitted', label: 'Offer Submitted' },
    { value: 'user_registered', label: 'User Registered' },
    { value: 'order_completed', label: 'Order Completed' },
    { value: 'payment_received', label: 'Payment Received' }
  ];

  const actionTypes = [
    { value: 'send_notification', label: 'Send Notification' },
    { value: 'send_email', label: 'Send Email' },
    { value: 'approve_automatically', label: 'Auto Approve' },
    { value: 'assign_to_admin', label: 'Assign to Admin' },
    { value: 'update_status', label: 'Update Status' }
  ];

  const fetchAutomationRules = async () => {
    try {
      const { data, error } = await supabase
        .from('workflow_rules')
        .select('*')
        .order('priority', { ascending: false });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Error fetching automation rules:', error);
    }
  };

  const fetchExecutions = async () => {
    try {
      const { data, error } = await supabase
        .from('workflow_executions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      // Transform data to match interface
      const transformedData = data?.map(execution => ({
        ...execution,
        started_at: execution.created_at
      })) || [];
      
      setExecutions(transformedData);
    } catch (error) {
      console.error('Error fetching executions:', error);
    }
  };

  const toggleRuleStatus = async (ruleId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('workflow_rules')
        .update({ status: newStatus })
        .eq('id', ruleId);

      if (error) throw error;

      setRules(prev => prev.map(rule => 
        rule.id === ruleId ? { ...rule, status: newStatus as 'active' | 'inactive' } : rule
      ));

      toast({
        title: 'Rule Updated',
        description: `Automation rule ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Error toggling rule status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update rule status',
        variant: 'destructive'
      });
    }
  };

  const createAutomationRule = async () => {
    try {
      const { error } = await supabase
        .from('workflow_rules')
        .insert({
          name: newRule.name,
          description: newRule.description,
          trigger_type: newRule.trigger_type as any,
          trigger_conditions: newRule.conditions,
          actions: newRule.actions,
          priority: newRule.priority,
          status: 'active',
          created_by: 'admin' // Add required field
        });

      if (error) throw error;

      // Reset form
      setNewRule({
        name: '',
        description: '',
        trigger_type: 'request_created',
        conditions: {},
        actions: [],
        priority: 1
      });
      setShowCreateForm(false);
      
      // Refresh rules
      await fetchAutomationRules();

      toast({
        title: 'Success',
        description: 'Automation rule created successfully',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error creating automation rule:', error);
      toast({
        title: 'Error',
        description: 'Failed to create automation rule',
        variant: 'destructive'
      });
    }
  };

  const deleteRule = async (ruleId: string) => {
    try {
      const { error } = await supabase
        .from('workflow_rules')
        .delete()
        .eq('id', ruleId);

      if (error) throw error;

      setRules(prev => prev.filter(rule => rule.id !== ruleId));

      toast({
        title: 'Success',
        description: 'Automation rule deleted successfully',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete automation rule',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAutomationRules(), fetchExecutions()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-success text-success-foreground">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-success text-success-foreground">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'executing':
        return <Badge variant="outline" className="border-blue-200 text-blue-800">Executing</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12">Loading automation center...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6" />
            Automation Center
          </h2>
          <p className="text-muted-foreground">
            Manage automated workflows and business processes
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </div>

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList>
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="executions">Execution History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Active Rules</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {rules.filter(r => r.status === 'active').length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Executions</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {rules.reduce((sum, rule) => sum + rule.execution_count, 0)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Success Rate</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {executions.length > 0 ? 
                    Math.round((executions.filter(e => e.status === 'completed').length / executions.length) * 100) : 0
                  }%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">Avg. Response</span>
                </div>
                <p className="text-2xl font-bold mt-1">2.3s</p>
              </CardContent>
            </Card>
          </div>

          {/* Create Rule Form */}
          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Automation Rule</CardTitle>
                <CardDescription>
                  Define triggers and actions for automated processes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Rule Name</Label>
                    <Input
                      id="name"
                      value={newRule.name}
                      onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Auto-approve vendor offers"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trigger">Trigger Type</Label>
                    <Select
                      value={newRule.trigger_type}
                      onValueChange={(value) => setNewRule(prev => ({ ...prev, trigger_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {triggerTypes.map(trigger => (
                          <SelectItem key={trigger.value} value={trigger.value}>
                            {trigger.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newRule.description}
                    onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this rule does..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority (1-10)</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    max="10"
                    value={newRule.priority}
                    onChange={(e) => setNewRule(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={createAutomationRule}>
                    Create Rule
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rules List */}
          <div className="space-y-4">
            {rules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {rule.status === 'active' ? (
                          <Zap className="h-4 w-4 text-primary" />
                        ) : (
                          <Pause className="h-4 w-4 text-muted-foreground" />
                        )}
                        {rule.name}
                      </CardTitle>
                      <CardDescription>{rule.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(rule.status)}
                      <Switch
                        checked={rule.status === 'active'}
                        onCheckedChange={() => toggleRuleStatus(rule.id, rule.status)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Priority: {rule.priority}</span>
                      <span>Executions: {rule.execution_count}</span>
                      <span>Trigger: {rule.trigger_type.replace('_', ' ')}</span>
                      {rule.last_executed_at && (
                        <span>Last run: {new Date(rule.last_executed_at).toLocaleDateString()}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => deleteRule(rule.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {rules.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Automation Rules</h3>
                  <p className="text-muted-foreground mb-4">Create your first automation rule to get started.</p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Rule
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="executions" className="space-y-4">
          {executions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Executions Yet</h3>
                <p className="text-muted-foreground">Automation executions will appear here once rules are triggered.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {executions.map((execution) => (
                <Card key={execution.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">Rule ID: {execution.workflow_rule_id.slice(0, 8)}</span>
                          {getStatusBadge(execution.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Started: {new Date(execution.started_at).toLocaleString()}
                        </p>
                        {execution.completed_at && (
                          <p className="text-sm text-muted-foreground">
                            Completed: {new Date(execution.completed_at).toLocaleString()}
                          </p>
                        )}
                        {execution.error_message && (
                          <p className="text-sm text-destructive mt-2">
                            Error: {execution.error_message}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Duration: {execution.completed_at ? 
                            `${Math.round((new Date(execution.completed_at).getTime() - new Date(execution.created_at).getTime()) / 1000)}s` : 
                            'Running...'
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Automation Analytics</CardTitle>
              <CardDescription>
                Performance metrics and insights for your automation rules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <p>Analytics dashboard coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};