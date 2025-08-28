import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WorkflowAction {
  type: string;
  params: Record<string, any>;
}

interface WorkflowRule {
  id: string;
  name: string;
  trigger_type: string;
  trigger_conditions: Record<string, any>;
  actions: WorkflowAction[];
  priority: number;
  delay_minutes: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { trigger_type, trigger_data, execution_id } = await req.json()

    console.log('Processing workflow automation:', { trigger_type, trigger_data, execution_id })

    // Get the workflow execution record
    const { data: execution, error: execError } = await supabase
      .from('workflow_executions')
      .select(`
        *,
        workflow_rules (*)
      `)
      .eq('id', execution_id)
      .single()

    if (execError || !execution) {
      throw new Error(`Failed to get workflow execution: ${execError?.message}`)
    }

    const rule = execution.workflow_rules as WorkflowRule
    const executedActions: any[] = []
    const startTime = Date.now()

    console.log('Executing workflow rule:', rule.name)

    // Execute each action in the workflow
    for (const action of rule.actions) {
      try {
        console.log('Executing action:', action.type, action.params)
        
        switch (action.type) {
          case 'send_notification':
            await executeNotificationAction(supabase, action, trigger_data)
            break
            
          case 'auto_assign':
            await executeAutoAssignAction(supabase, action, trigger_data)
            break
            
          case 'escalate_approval':
            await executeEscalateApprovalAction(supabase, action, trigger_data)
            break
            
          case 'auto_approve':
            await executeAutoApproveAction(supabase, action, trigger_data)
            break
            
          case 'create_task':
            await executeCreateTaskAction(supabase, action, trigger_data, execution_id)
            break
            
          case 'update_status':
            await executeUpdateStatusAction(supabase, action, trigger_data)
            break
            
          default:
            console.warn('Unknown action type:', action.type)
        }
        
        executedActions.push({
          ...action,
          status: 'completed',
          executed_at: new Date().toISOString()
        })
        
      } catch (actionError) {
        console.error('Action execution failed:', action.type, actionError)
        executedActions.push({
          ...action,
          status: 'failed',
          error: actionError.message,
          executed_at: new Date().toISOString()
        })
      }
    }

    const executionTime = Date.now() - startTime

    // Update execution record
    await supabase
      .from('workflow_executions')
      .update({
        executed_actions: executedActions,
        status: 'completed',
        execution_time_ms: executionTime,
        completed_at: new Date().toISOString()
      })
      .eq('id', execution_id)

    console.log('Workflow execution completed:', { 
      execution_id, 
      actions_executed: executedActions.length,
      execution_time_ms: executionTime 
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        executed_actions: executedActions.length,
        execution_time_ms: executionTime
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Workflow automation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Action execution functions
async function executeNotificationAction(supabase: any, action: WorkflowAction, triggerData: any) {
  const { template, recipients } = action.params
  
  let userIds: string[] = []
  
  // Determine recipients based on trigger data and params
  if (recipients?.includes('client') && triggerData.client_id) {
    userIds.push(triggerData.client_id)
  }
  
  if (recipients?.includes('vendor') && triggerData.vendor_id) {
    userIds.push(triggerData.vendor_id)
  }
  
  if (recipients?.includes('admin')) {
    const { data: admins } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('role', 'admin')
    
    if (admins) {
      userIds.push(...admins.map((admin: any) => admin.user_id))
    }
  }

  // Create notifications
  const notifications = userIds.map(userId => ({
    user_id: userId,
    type: 'workflow_automation',
    title: getNotificationTitle(template, triggerData),
    message: getNotificationMessage(template, triggerData),
    category: 'automation',
    priority: 'medium',
    data: { trigger_data: triggerData, template }
  }))

  if (notifications.length > 0) {
    await supabase.from('notifications').insert(notifications)
  }
}

async function executeAutoAssignAction(supabase: any, action: WorkflowAction, triggerData: any) {
  if (action.params.method === 'smart_matching' && triggerData.request_id) {
    // Get top performing vendors for this category
    const { data: topVendors } = await supabase
      .from('vendor_performance_metrics')
      .select(`
        vendor_id,
        quality_score,
        response_time_avg_hours,
        completion_rate,
        user_profiles!inner(user_id, role, categories, verification_status)
      `)
      .eq('category', triggerData.category)
      .eq('user_profiles.role', 'vendor')
      .eq('user_profiles.verification_status', 'approved')
      .gte('quality_score', 3.0)
      .order('quality_score', { ascending: false })
      .limit(5)

    if (topVendors && topVendors.length > 0) {
      // Create targeted notifications for top vendors
      const vendorNotifications = topVendors.map((vendor: any) => ({
        user_id: vendor.user_profiles.user_id,
        type: 'smart_assignment',
        title: 'Priority Request Match',
        message: `You've been selected for a high-priority request in ${triggerData.category} based on your excellent performance!`,
        category: 'opportunities',
        priority: 'high',
        data: { 
          request_id: triggerData.request_id,
          assignment_reason: 'smart_matching',
          quality_score: vendor.quality_score
        }
      }))

      await supabase.from('notifications').insert(vendorNotifications)
    }
  }
}

async function executeEscalateApprovalAction(supabase: any, action: WorkflowAction, triggerData: any) {
  const { escalate_to } = action.params
  
  if (escalate_to === 'admin') {
    // Get all admins
    const { data: admins } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('role', 'admin')

    if (admins && admins.length > 0) {
      const escalationNotifications = admins.map((admin: any) => ({
        user_id: admin.user_id,
        type: 'approval_escalation',
        title: 'Approval Escalated',
        message: `An approval has been escalated to you due to timeout. Please review immediately.`,
        category: 'urgent',
        priority: 'high',
        data: triggerData
      }))

      await supabase.from('notifications').insert(escalationNotifications)
    }
  }
}

async function executeAutoApproveAction(supabase: any, action: WorkflowAction, triggerData: any) {
  const { level } = action.params
  
  if (level === 'admin' && triggerData.offer_id) {
    // Auto-approve the offer
    await supabase
      .from('offers')
      .update({
        admin_approval_status: 'approved',
        client_approval_status: 'approved', // Also approve from client side for high-performance vendors
        client_approval_date: new Date().toISOString()
      })
      .eq('id', triggerData.offer_id)

    // Notify the vendor
    await supabase.from('notifications').insert({
      user_id: triggerData.vendor_id,
      type: 'auto_approval',
      title: 'Offer Auto-Approved!',
      message: 'Your offer has been automatically approved based on your excellent performance history.',
      category: 'approvals',
      priority: 'high',
      data: { offer_id: triggerData.offer_id, auto_approved: true }
    })
  }
}

async function executeCreateTaskAction(supabase: any, action: WorkflowAction, triggerData: any, executionId: string) {
  const { title, description, priority = 'medium' } = action.params
  
  // Determine who to assign the task to
  let assignedTo = triggerData.client_id
  
  if (triggerData.vendor_id && Math.random() > 0.5) {
    assignedTo = triggerData.vendor_id
  }

  await supabase.from('automated_tasks').insert({
    workflow_execution_id: executionId,
    assigned_to: assignedTo,
    title: title || 'Automated Task',
    description: description || 'Task created by workflow automation',
    priority,
    reference_type: triggerData.request_id ? 'request' : 'offer',
    reference_id: triggerData.request_id || triggerData.offer_id,
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
  })
}

async function executeUpdateStatusAction(supabase: any, action: WorkflowAction, triggerData: any) {
  const { entity_type, status } = action.params
  
  if (entity_type === 'request' && triggerData.request_id) {
    await supabase
      .from('requests')
      .update({ admin_approval_status: status })
      .eq('id', triggerData.request_id)
  } else if (entity_type === 'order' && triggerData.order_id) {
    await supabase
      .from('orders')
      .update({ status })
      .eq('id', triggerData.order_id)
  }
}

// Helper functions for notifications
function getNotificationTitle(template: string, triggerData: any): string {
  switch (template) {
    case 'new_request_available':
      return 'New Request Available'
    case 'approval_escalated':
      return 'Approval Escalated'
    case 'deadline_warning':
      return 'Deadline Approaching'
    case 'offer_auto_approved':
      return 'Offer Auto-Approved'
    default:
      return 'Workflow Notification'
  }
}

function getNotificationMessage(template: string, triggerData: any): string {
  switch (template) {
    case 'new_request_available':
      return `A new request in ${triggerData.category} is available for bidding.`
    case 'approval_escalated':
      return 'An approval has been escalated due to timeout. Please review immediately.'
    case 'deadline_warning':
      return `Project deadline is approaching in 3 days. Please review progress.`
    case 'offer_auto_approved':
      return 'Your offer has been automatically approved based on your performance.'
    default:
      return 'Workflow automation notification'
  }
}