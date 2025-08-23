import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MatchedRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_min?: number;
  budget_max?: number;
  currency?: string;
  location?: string;
  deadline?: string;
  urgency: string;
  created_at: string;
  client: string;
  matchScore: number;
  matchReasons: string[];
}

export const useMatchingSystem = () => {
  const [matchedRequests, setMatchedRequests] = useState<MatchedRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userProfile } = useAuth();

  const calculateMatchScore = (request: any, supplierProfile: any): { score: number; reasons: string[] } => {
    let score = 0;
    const reasons: string[] = [];

    // Base score for all requests
    score += 10;

    // Category matching (if supplier has categories in future)
    // For now, give bonus for popular categories
    const popularCategories = ['Audio, Visual & Lighting', 'Catering & Food Services', 'Photography & Videography'];
    if (popularCategories.includes(request.category)) {
      score += 20;
      reasons.push(`Popular category: ${request.category}`);
    }

    // Urgency bonus
    if (request.urgency === 'urgent') {
      score += 30;
      reasons.push('Urgent request - higher priority');
    } else if (request.urgency === 'high') {
      score += 20;
      reasons.push('High priority request');
    }

    // Budget range bonus
    if (request.budget_min && request.budget_min >= 10000) {
      score += 25;
      reasons.push('High budget request');
    } else if (request.budget_min && request.budget_min >= 5000) {
      score += 15;
      reasons.push('Medium budget request');
    }

    // Recent request bonus
    const daysSinceCreated = Math.floor((Date.now() - new Date(request.created_at).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceCreated <= 1) {
      score += 15;
      reasons.push('Recently posted');
    } else if (daysSinceCreated <= 3) {
      score += 10;
      reasons.push('Posted within 3 days');
    }

    // Location bonus (simplified - same city gets bonus)
    if (request.location && supplierProfile?.company_name) {
      if (request.location.toLowerCase().includes('riyadh') && 
          supplierProfile.company_name.toLowerCase().includes('riyadh')) {
        score += 15;
        reasons.push('Same city location');
      }
    }

    return { score: Math.min(score, 100), reasons };
  };

  const fetchMatchedRequests = async () => {
    if (!user || userProfile?.role !== 'supplier') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch open requests that don't have offers from this supplier yet
      const { data: requests, error } = await supabase
        .from('requests')
        .select(`
          *,
          offers!left (
            id,
            supplier_id
          )
        `)
        .eq('status', 'new')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter out requests where this supplier has already submitted an offer
      const availableRequests = (requests || []).filter(request => 
        !request.offers?.some((offer: any) => offer.supplier_id === user.id)
      );

      // Calculate match scores for each request
      const matchedWithScores: MatchedRequest[] = availableRequests.map(request => {
        const { score, reasons } = calculateMatchScore(request, userProfile);
        
        return {
          id: request.id,
          title: request.title,
          description: request.description,
          category: request.category,
          budget_min: request.budget_min,
          budget_max: request.budget_max,
          location: request.location,
          deadline: request.deadline,
          urgency: request.urgency,
          created_at: request.created_at,
          client: request.client_id,
          matchScore: score,
          matchReasons: reasons
        };
      });

      // Sort by match score (highest first)
      matchedWithScores.sort((a, b) => b.matchScore - a.matchScore);

      setMatchedRequests(matchedWithScores);
    } catch (error) {
      console.error('Error fetching matched requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchedRequests();
  }, [user, userProfile]);

  const getMatchLevel = (score: number): { level: string; color: string } => {
    if (score >= 80) return { level: 'Excellent Match', color: 'bg-green-100 text-green-800' };
    if (score >= 60) return { level: 'Good Match', color: 'bg-blue-100 text-blue-800' };
    if (score >= 40) return { level: 'Fair Match', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Basic Match', color: 'bg-gray-100 text-gray-800' };
  };

  return {
    matchedRequests,
    loading,
    refetch: fetchMatchedRequests,
    getMatchLevel
  };
};