import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RFQWorkflowEvent {
  type: 'rfq_created' | 'rfq_published' | 'bid_submitted' | 'bid_accepted' | 'rfq_expired';
  rfqId: string;
  userId?: string;
  bidId?: string;
  data?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { event }: { event: RFQWorkflowEvent } = await req.json();
    
    console.log('Processing RFQ workflow event:', event.type, 'for RFQ:', event.rfqId);

    let result: any = {};

    switch (event.type) {
      case 'rfq_created':
        result = await handleRFQCreated(supabase, event);
        break;
      case 'rfq_published':
        result = await handleRFQPublished(supabase, event);
        break;
      case 'bid_submitted':
        result = await handleBidSubmitted(supabase, event);
        break;
      case 'bid_accepted':
        result = await handleBidAccepted(supabase, event);
        break;
      case 'rfq_expired':
        result = await handleRFQExpired(supabase, event);
        break;
      default:
        throw new Error(`Unknown event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        result,
        message: `Successfully processed ${event.type} event`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('RFQ workflow error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function handleRFQCreated(supabase: any, event: RFQWorkflowEvent) {
  console.log('Handling RFQ created event');

  // Get RFQ details
  const { data: rfq, error: rfqError } = await supabase
    .from('rfqs')
    .select('*')
    .eq('id', event.rfqId)
    .single();

  if (rfqError || !rfq) {
    throw new Error(`Failed to fetch RFQ: ${rfqError?.message}`);
  }

  // Auto-publish if it's a public RFQ
  if (rfq.is_public) {
    const { error: updateError } = await supabase
      .from('rfqs')
      .update({ status: 'published' })
      .eq('id', event.rfqId);

    if (updateError) {
      console.error('Failed to auto-publish RFQ:', updateError);
    } else {
      console.log('Auto-published public RFQ');
      
      // Trigger vendor matching
      await triggerVendorMatching(supabase, rfq);
    }
  }

  // Log activity
  await supabase
    .from('activity_feed')
    .insert({
      user_id: rfq.client_id,
      activity_type: 'rfq_created',
      title: 'RFQ Created',
      description: `Created RFQ: ${rfq.title}`,
      metadata: {
        rfq_id: event.rfqId,
        category: rfq.category_id,
        budget_range: `${rfq.budget_min || 0} - ${rfq.budget_max || 0}`
      }
    });

  return { rfq_published: rfq.is_public, vendor_matching_triggered: rfq.is_public };
}

async function handleRFQPublished(supabase: any, event: RFQWorkflowEvent) {
  console.log('Handling RFQ published event');

  // Get RFQ details
  const { data: rfq, error: rfqError } = await supabase
    .from('rfqs')
    .select('*')
    .eq('id', event.rfqId)
    .single();

  if (rfqError || !rfq) {
    throw new Error(`Failed to fetch RFQ: ${rfqError?.message}`);
  }

  // Trigger vendor matching
  await triggerVendorMatching(supabase, rfq);

  // Set up automatic expiry if needed
  const expiryDate = new Date(rfq.submission_deadline);
  const now = new Date();
  const hoursUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilExpiry > 0 && hoursUntilExpiry <= 72) { // Within 3 days
    // Schedule expiry notification
    console.log(`RFQ will expire in ${hoursUntilExpiry} hours`);
  }

  return { vendor_matching_triggered: true };
}

async function handleBidSubmitted(supabase: any, event: RFQWorkflowEvent) {
  console.log('Handling bid submitted event');

  // Get bid and RFQ details
  const { data: bid, error: bidError } = await supabase
    .from('bids')
    .select(`
      *,
      rfqs!inner(title, client_id),
      user_profiles!vendor_id(full_name, company_name)
    `)
    .eq('id', event.bidId)
    .single();

  if (bidError || !bid) {
    throw new Error(`Failed to fetch bid: ${bidError?.message}`);
  }

  // Notify client about new bid
  await supabase
    .from('notifications')
    .insert({
      user_id: bid.rfqs.client_id,
      type: 'new_bid_received',
      title: 'New Bid Received',
      message: `${bid.user_profiles.company_name || bid.user_profiles.full_name} submitted a bid for "${bid.rfqs.title}"`,
      category: 'bids',
      priority: 'medium',
      data: {
        rfq_id: event.rfqId,
        bid_id: event.bidId,
        vendor_name: bid.user_profiles.company_name || bid.user_profiles.full_name,
        bid_amount: bid.total_price
      }
    });

  // Log activity
  await supabase
    .from('activity_feed')
    .insert({
      user_id: bid.vendor_id,
      activity_type: 'bid_submitted',
      title: 'Bid Submitted',
      description: `Submitted bid for RFQ: ${bid.rfqs.title}`,
      metadata: {
        rfq_id: event.rfqId,
        bid_id: event.bidId,
        bid_amount: bid.total_price
      }
    });

  return { notification_sent: true };
}

async function handleBidAccepted(supabase: any, event: RFQWorkflowEvent) {
  console.log('Handling bid accepted event');

  // Get bid details
  const { data: bid, error: bidError } = await supabase
    .from('bids')
    .select(`
      *,
      rfqs!inner(title, client_id)
    `)
    .eq('id', event.bidId)
    .single();

  if (bidError || !bid) {
    throw new Error(`Failed to fetch bid: ${bidError?.message}`);
  }

  // Create order from accepted bid
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      rfq_id: event.rfqId,
      bid_id: event.bidId,
      client_id: bid.rfqs.client_id,
      vendor_id: bid.vendor_id,
      title: bid.rfqs.title,
      description: `Order created from accepted bid for: ${bid.rfqs.title}`,
      amount: bid.total_price,
      currency: bid.currency,
      status: 'pending',
      delivery_date: bid.delivery_timeline_days ? 
        new Date(Date.now() + bid.delivery_timeline_days * 24 * 60 * 60 * 1000) : null
    })
    .select()
    .single();

  if (orderError) {
    throw new Error(`Failed to create order: ${orderError.message}`);
  }

  // Update RFQ status to awarded
  await supabase
    .from('rfqs')
    .update({ status: 'awarded' })
    .eq('id', event.rfqId);

  // Notify vendor about acceptance
  await supabase
    .from('notifications')
    .insert({
      user_id: bid.vendor_id,
      type: 'bid_accepted',
      title: 'Congratulations! Bid Accepted',
      message: `Your bid for "${bid.rfqs.title}" has been accepted. Order #${order.id} has been created.`,
      category: 'orders',
      priority: 'high',
      data: {
        rfq_id: event.rfqId,
        bid_id: event.bidId,
        order_id: order.id
      }
    });

  // Reject other bids for this RFQ
  await supabase
    .from('bids')
    .update({ status: 'rejected' })
    .eq('rfq_id', event.rfqId)
    .neq('id', event.bidId);

  return { order_created: order.id, other_bids_rejected: true };
}

async function handleRFQExpired(supabase: any, event: RFQWorkflowEvent) {
  console.log('Handling RFQ expired event');

  // Update RFQ status
  await supabase
    .from('rfqs')
    .update({ status: 'evaluation' })
    .eq('id', event.rfqId);

  // Get RFQ and bids count
  const { data: rfq, error: rfqError } = await supabase
    .from('rfqs')
    .select(`
      *,
      bids!inner(count)
    `)
    .eq('id', event.rfqId)
    .single();

  if (rfqError || !rfq) {
    throw new Error(`Failed to fetch RFQ: ${rfqError?.message}`);
  }

  const bidCount = rfq.bids?.[0]?.count || 0;

  // Notify client about expiry
  await supabase
    .from('notifications')
    .insert({
      user_id: rfq.client_id,
      type: 'rfq_expired',
      title: 'RFQ Submission Period Ended',
      message: `Your RFQ "${rfq.title}" has reached the submission deadline. ${bidCount} bids received.`,
      category: 'rfqs',
      priority: 'medium',
      data: {
        rfq_id: event.rfqId,
        bid_count: bidCount
      }
    });

  return { bid_count: bidCount, status_updated: true };
}

async function triggerVendorMatching(supabase: any, rfq: any) {
  try {
    // Call vendor matching function
    const matchingResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/vendor-matching`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          criteria: {
            rfqId: rfq.id,
            categoryId: rfq.category_id,
            budgetMin: rfq.budget_min,
            budgetMax: rfq.budget_max,
            location: rfq.delivery_location,
            requirements: rfq.requirements,
            priority: rfq.priority
          }
        })
      }
    );

    if (!matchingResponse.ok) {
      console.error('Vendor matching failed:', await matchingResponse.text());
    } else {
      console.log('Vendor matching triggered successfully');
    }
  } catch (error) {
    console.error('Error triggering vendor matching:', error);
  }
}