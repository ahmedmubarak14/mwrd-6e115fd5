// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") as string;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") as string;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { rfq_id, bid_id, notes } = await req.json();
    if (!rfq_id || !bid_id) {
      return new Response(JSON.stringify({ error: 'rfq_id and bid_id are required' }), { status: 400 });
    }

    const authHeader = req.headers.get('Authorization') ?? '';

    // Auth client to identify the caller
    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    });
    const { data: userData, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const userId = userData.user.id;

    // Admin client for privileged writes
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify RFQ belongs to the caller
    const { data: rfq, error: rfqError } = await supabaseAdmin
      .from('rfqs')
      .select('id, client_id')
      .eq('id', rfq_id)
      .single();

    if (rfqError || !rfq) {
      return new Response(JSON.stringify({ error: 'RFQ not found' }), { status: 404 });
    }

    if (rfq.client_id !== userId) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    // Fetch bids for this RFQ to compute other IDs
    const { data: allBids, error: bidsError } = await supabaseAdmin
      .from('bids')
      .select('id')
      .eq('rfq_id', rfq_id);

    if (bidsError) {
      return new Response(JSON.stringify({ error: 'Failed to load bids' }), { status: 500 });
    }

    const otherBidIds = (allBids || []).map((b: any) => b.id).filter((id: string) => id !== bid_id);

    // Accept the winning bid
    const { error: acceptErr } = await supabaseAdmin
      .from('bids')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', bid_id);

    if (acceptErr) {
      return new Response(JSON.stringify({ error: 'Failed to accept bid' }), { status: 500 });
    }

    // Reject all other bids
    if (otherBidIds.length > 0) {
      const { error: rejectErr } = await supabaseAdmin
        .from('bids')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .in('id', otherBidIds);
      if (rejectErr) {
        return new Response(JSON.stringify({ error: 'Failed to reject other bids' }), { status: 500 });
      }
    }

    // Update RFQ status to awarded
    const { error: rfqUpdateErr } = await supabaseAdmin
      .from('rfqs')
      .update({ status: 'awarded', updated_at: new Date().toISOString() })
      .eq('id', rfq_id);

    if (rfqUpdateErr) {
      return new Response(JSON.stringify({ error: 'Failed to update RFQ' }), { status: 500 });
    }

    // Optionally log evaluation notes
    if (notes) {
      await supabaseAdmin.from('audit_log').insert({
        user_id: userId,
        entity_id: rfq_id,
        entity_type: 'rfq_award',
        action: 'award',
        new_values: { bid_id, notes },
        created_at: new Date().toISOString(),
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 500 });
  }
});