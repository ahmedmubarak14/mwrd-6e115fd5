import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, Clock, Zap, Bell, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WorkflowRule {
  id: string;
  name: string;
  enabled: boolean;
  trigger: string;
  conditions: any;
  actions: any;
  lastRun?: string;
  runCount: number;
}

export const WorkflowAutomation = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<WorkflowRule[]>([
    {
      id: '1',
      name: 'Auto-approve small requests',
      enabled: true,
      trigger: 'request_created',
      conditions: { budget_max: { operator: 'less_than', value: 5000 } },
      actions: { approve: true, notify_client: true },
      runCount: 15
    },
    {
      id: '2', 
      name: 'Escalate high-value offers',
      enabled: true,
      trigger: 'offer_submitted',
      conditions: { price: { operator: 'greater_than', value: 100000 } },
      actions: { notify_admin: true, priority: 'high' },
      runCount: 3
    },
    {
      id: '3',
      name: 'Auto-reject expired requests',
      enabled: false,
      trigger: 'scheduled_daily',
      conditions: { deadline: { operator: 'past_due', days: 7 } },
      actions: { reject: true, notify_client: true },
      runCount: 0
    }
  ]);

  const [selectedRule, setSelectedRule] = useState<WorkflowRule | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const toggleRule = async (ruleId: string, enabled: boolean) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled } : rule
    ));

    toast({
      title: enabled ? 'Rule Enabled' : 'Rule Disabled',
      description: `Automation rule has been ${enabled ? 'enabled' : 'disabled'}`,
    });
  };

  const executeRule = async (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;

    try {
      // Simulate rule execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRules(prev => prev.map(r => 
        r.id === ruleId 
          ? { ...r, runCount: r.runCount + 1, lastRun: new Date().toISOString() }
          : r
      ));

      toast({
        title: 'Rule Executed',
        description: `"${rule.name}" has been executed successfully`,
      });
    } catch (error) {
      toast({
        title: 'Execution Failed',
        description: 'Failed to execute automation rule',
        variant: 'destructive'
      });
    }
  };

  const getStatusIcon = (rule: WorkflowRule) => {
    if (!rule.enabled) return <Clock className="h-4 w-4 text-muted-foreground" />;
    if (rule.runCount > 0) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusColor = (rule: WorkflowRule) => {
    if (!rule.enabled) return 'secondary';
    if (rule.runCount > 0) return 'default';
    return 'outline';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Workflow Automation
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Automate approval processes and streamline operations
              </p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              New Rule
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rules.map((rule) => (
          <Card key={rule.id} className={`relative ${rule.enabled ? 'border-primary/20' : 'border-muted'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(rule)}
                    <h3 className="font-medium text-sm">{rule.name}</h3>
                  </div>
                  <Badge variant={getStatusColor(rule)} className="text-xs">
                    {rule.enabled ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={(enabled) => toggleRule(rule.id, enabled)}
                />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Trigger:</span>
                  <span className="font-medium">{rule.trigger.replace('_', ' ')}</span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Executions:</span>
                  <span className="font-medium text-primary">{rule.runCount}</span>
                </div>
                
                {rule.lastRun && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Last run:</span>
                    <span className="font-medium">{new Date(rule.lastRun).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-medium">Conditions:</h4>
                <div className="bg-muted/50 p-2 rounded text-xs">
                  {Object.entries(rule.conditions).map(([key, condition]: [string, any]) => (
                    <div key={key} className="flex justify-between">
                      <span>{key}:</span>
                      <span>{condition.operator} {condition.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-medium">Actions:</h4>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(rule.actions).map(([action, value]) => (
                    value && (
                      <Badge key={action} variant="outline" className="text-xs">
                        {action.replace('_', ' ')}
                      </Badge>
                    )
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => executeRule(rule.id)}
                  disabled={!rule.enabled}
                  className="flex-1 text-xs"
                >
                  Run Now
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedRule(rule)}
                  className="flex-1 text-xs"
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Rules</p>
                <p className="text-2xl font-bold">{rules.filter(r => r.enabled).length}</p>
              </div>
              <Zap className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Executions</p>
                <p className="text-2xl font-bold">{rules.reduce((sum, r) => sum + r.runCount, 0)}</p>
              </div>
              <Bell className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Processing Time</p>
                <p className="text-2xl font-bold">1.2s</p>
              </div>
              <Clock className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">98.5%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};