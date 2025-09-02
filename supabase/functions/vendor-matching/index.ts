import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MatchingCriteria {
  rfqId: string;
  categoryId: string;
  budgetMin?: number;
  budgetMax?: number;
  location?: string;
  requirements?: any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface VendorScore {
  vendorId: string;
  score: number;
  reasons: string[];
  matchDetails: {
    categoryMatch: boolean;
    budgetMatch: boolean;
    locationMatch: boolean;
    experienceMatch: boolean;
    ratingScore: number;
  };
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

    const { criteria }: { criteria: MatchingCriteria } = await req.json();
    
    console.log('Starting vendor matching for RFQ:', criteria.rfqId);

    // Get all active vendors with their profiles and performance metrics
    const { data: vendors, error: vendorsError } = await supabase
      .from('user_profiles')
      .select(`
        user_id,
        full_name,
        company_name,
        categories,
        location,
        rating,
        verification_status,
        vendor_performance_metrics(*),
        completed_projects:orders!vendor_id(count)
      `)
      .eq('role', 'vendor')
      .eq('status', 'approved')
      .eq('verification_status', 'approved');

    if (vendorsError) {
      throw new Error(`Failed to fetch vendors: ${vendorsError.message}`);
    }

    if (!vendors || vendors.length === 0) {
      return new Response(
        JSON.stringify({ matches: [], message: 'No qualified vendors found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${vendors.length} vendors to evaluate`);

    // Score each vendor based on matching criteria
    const scoredVendors: VendorScore[] = [];

    for (const vendor of vendors) {
      const score = calculateVendorScore(vendor, criteria);
      if (score.score > 30) { // Minimum threshold for consideration
        scoredVendors.push(score);
      }
    }

    // Sort by score (highest first)
    scoredVendors.sort((a, b) => b.score - a.score);

    // Take top 10 matches
    const topMatches = scoredVendors.slice(0, 10);

    console.log(`Matched ${topMatches.length} vendors with scores above threshold`);

    // Create notifications for top matches
    const notifications = topMatches.slice(0, 5).map(match => ({
      user_id: match.vendorId,
      type: 'new_rfq_match',
      title: 'New RFQ Match Available',
      message: `A new RFQ matches your expertise with ${match.score}% compatibility. ${match.reasons.slice(0, 2).join(', ')}.`,
      category: 'opportunities',
      priority: criteria.priority === 'urgent' ? 'high' : 'medium',
      data: {
        rfq_id: criteria.rfqId,
        match_score: match.score,
        reasons: match.reasons
      }
    }));

    // Insert notifications
    if (notifications.length > 0) {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (notificationError) {
        console.error('Failed to create notifications:', notificationError);
      } else {
        console.log(`Created ${notifications.length} notifications`);
      }
    }

    // Log the matching activity
    await supabase
      .from('activity_feed')
      .insert({
        user_id: null, // System activity
        activity_type: 'vendor_matching_completed',
        title: 'Vendor Matching Completed',
        description: `Matched ${topMatches.length} vendors for RFQ ${criteria.rfqId}`,
        metadata: {
          rfq_id: criteria.rfqId,
          matches_found: topMatches.length,
          criteria: criteria
        }
      });

    return new Response(
      JSON.stringify({
        success: true,
        matches: topMatches,
        totalEvaluated: vendors.length,
        message: `Successfully matched ${topMatches.length} qualified vendors`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Vendor matching error:', error);
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

function calculateVendorScore(vendor: any, criteria: MatchingCriteria): VendorScore {
  let score = 0;
  const reasons: string[] = [];
  const matchDetails = {
    categoryMatch: false,
    budgetMatch: false,
    locationMatch: false,
    experienceMatch: false,
    ratingScore: 0
  };

  // Category matching (40% weight)
  if (vendor.categories && vendor.categories.includes(criteria.categoryId)) {
    score += 40;
    matchDetails.categoryMatch = true;
    reasons.push('Category expertise match');
  }

  // Budget compatibility (20% weight)
  const avgBudget = criteria.budgetMax ? (criteria.budgetMin || 0 + criteria.budgetMax) / 2 : 50000;
  const vendorMetrics = vendor.vendor_performance_metrics?.[0];
  if (vendorMetrics && vendorMetrics.total_earnings > 0) {
    const avgProjectValue = vendorMetrics.total_earnings / Math.max(vendorMetrics.total_completed_orders, 1);
    if (avgProjectValue <= avgBudget * 1.5 && avgProjectValue >= avgBudget * 0.5) {
      score += 20;
      matchDetails.budgetMatch = true;
      reasons.push('Budget range compatibility');
    }
  } else {
    // New vendor, give benefit of doubt for budget
    score += 10;
    reasons.push('Available for budget range');
  }

  // Location proximity (15% weight)
  if (criteria.location && vendor.location) {
    if (vendor.location.toLowerCase().includes(criteria.location.toLowerCase()) ||
        criteria.location.toLowerCase().includes(vendor.location.toLowerCase())) {
      score += 15;
      matchDetails.locationMatch = true;
      reasons.push('Geographic proximity');
    }
  } else {
    score += 5; // Partial score if location not specified
  }

  // Experience and rating (15% weight)
  const completedProjects = vendor.completed_projects?.[0]?.count || 0;
  if (completedProjects > 0) {
    score += Math.min(completedProjects * 2, 10); // Max 10 points for experience
    matchDetails.experienceMatch = true;
    reasons.push(`${completedProjects} completed projects`);
  }

  const rating = vendor.rating || 3.5;
  const ratingScore = ((rating - 1) / 4) * 5; // Convert 1-5 rating to 0-5 score
  score += ratingScore;
  matchDetails.ratingScore = rating;
  if (rating >= 4.0) {
    reasons.push(`High rating (${rating}/5)`);
  }

  // Performance metrics bonus (10% weight)
  if (vendorMetrics) {
    if (vendorMetrics.completion_rate > 80) {
      score += 5;
      reasons.push('High completion rate');
    }
    if (vendorMetrics.response_time_avg_hours < 24) {
      score += 5;
      reasons.push('Fast response time');
    }
  }

  // Verification status bonus
  if (vendor.verification_status === 'approved') {
    score += 5;
    reasons.push('Verified vendor');
  }

  return {
    vendorId: vendor.user_id,
    score: Math.round(score),
    reasons,
    matchDetails
  };
}