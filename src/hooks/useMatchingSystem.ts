
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCategories } from '@/hooks/useCategories';

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
  const { categories, getAllCategories } = useCategories();

  const calculateMatchScore = (request: any, supplierProfile: any): { score: number; reasons: string[] } => {
    let score = 0;
    const reasons: string[] = [];

    // Base score for all requests
    score += 5;

    // Enhanced Category matching with subcategories
    const allCategories = getAllCategories();
    const requestCategory = allCategories.find(cat => cat.slug === request.category);
    const supplierCategories = supplierProfile?.categories || [];
    
    const categoryMatches = supplierCategories.includes(request.category);
    if (categoryMatches) {
      score += 30;
      const categoryName = requestCategory ? requestCategory.name_en : request.category;
      reasons.push(`Expertise in ${categoryName}`);
    } else {
      // Partial matching for related categories - check if request category is a parent/child of supplier categories
      let partialMatch = false;
      
      if (requestCategory) {
        // Check if supplier has the parent category when request is for subcategory
        if (requestCategory.parent_id) {
          const parentCategory = allCategories.find(cat => cat.id === requestCategory.parent_id);
          if (parentCategory && supplierCategories.includes(parentCategory.slug)) {
            score += 15;
            reasons.push(`Related experience: ${parentCategory.name_en}`);
            partialMatch = true;
          }
        }
        
        // Check if supplier has any subcategories when request is for parent category
        if (!partialMatch) {
          const subcategories = allCategories.filter(cat => cat.parent_id === requestCategory.id);
          const hasSubcategoryMatch = subcategories.some(sub => supplierCategories.includes(sub.slug));
          if (hasSubcategoryMatch) {
            score += 10;
            reasons.push(`Related subcategory experience`);
          }
        }
      }
    }

    // Supplier rating and experience
    if (supplierProfile?.rating) {
      const ratingScore = (supplierProfile.rating / 5) * 20;
      score += ratingScore;
      if (supplierProfile.rating >= 4.5) {
        reasons.push('Highly rated supplier (4.5+ stars)');
      } else if (supplierProfile.rating >= 4.0) {
        reasons.push('Well-rated supplier (4.0+ stars)');
      }
    }

    // Completed projects experience
    const completedProjects = supplierProfile?.completedProjects || 0;
    if (completedProjects >= 50) {
      score += 20;
      reasons.push('Highly experienced (50+ projects)');
    } else if (completedProjects >= 20) {
      score += 15;
      reasons.push('Experienced supplier (20+ projects)');
    } else if (completedProjects >= 10) {
      score += 10;
      reasons.push('Established supplier (10+ projects)');
    }

    // Response time factor
    const responseTime = supplierProfile?.responseTime || '24h';
    const hours = parseFloat(responseTime.replace('h', ''));
    if (hours <= 2) {
      score += 15;
      reasons.push('Very fast response time (≤2h)');
    } else if (hours <= 6) {
      score += 10;
      reasons.push('Fast response time (≤6h)');
    } else if (hours <= 12) {
      score += 5;
      reasons.push('Good response time (≤12h)');
    }

    // Urgency bonus with better logic
    if (request.urgency === 'urgent') {
      score += 25;
      reasons.push('Urgent request - immediate attention needed');
      
      // Extra bonus for suppliers with fast response
      if (hours <= 2) {
        score += 10;
        reasons.push('Perfect for urgent requests');
      }
    } else if (request.urgency === 'high') {
      score += 15;
      reasons.push('High priority request');
    } else if (request.urgency === 'medium') {
      score += 10;
      reasons.push('Medium priority - good timing');
    }

    // Enhanced Budget analysis
    const budgetMin = request.budget_min || 0;
    const budgetMax = request.budget_max || budgetMin * 1.5;
    const avgBudget = (budgetMin + budgetMax) / 2;
    
    // Supplier's typical project range (mock for now)
    const supplierMinBudget = supplierProfile?.minBudget || 1000;
    const supplierMaxBudget = supplierProfile?.maxBudget || 100000;
    
    if (avgBudget >= supplierMinBudget && avgBudget <= supplierMaxBudget) {
      score += 20;
      reasons.push('Budget matches supplier range');
    } else if (avgBudget >= 20000) {
      score += 15;
      reasons.push('High value project (20k+ SAR)');
    } else if (avgBudget >= 10000) {
      score += 10;
      reasons.push('Medium value project (10k+ SAR)');
    } else if (avgBudget >= 5000) {
      score += 5;
      reasons.push('Standard project budget');
    }

    // Recency bonus with decay
    const daysSinceCreated = Math.floor((Date.now() - new Date(request.created_at).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceCreated <= 0.5) { // Less than 12 hours
      score += 20;
      reasons.push('Just posted - be the first to respond!');
    } else if (daysSinceCreated <= 1) {
      score += 15;
      reasons.push('Recently posted (today)');
    } else if (daysSinceCreated <= 3) {
      score += 10;
      reasons.push('Fresh request (3 days old)');
    } else if (daysSinceCreated <= 7) {
      score += 5;
      reasons.push('Still relevant (1 week old)');
    }

    // Geographic proximity
    if (request.location && supplierProfile?.address) {
      const requestLocation = request.location.toLowerCase();
      const supplierLocation = (supplierProfile.address || '').toLowerCase();
      
      // Same city bonus
      const cities = ['riyadh', 'jeddah', 'dammam', 'mecca', 'medina', 'khobar'];
      const requestCity = cities.find(city => requestLocation.includes(city));
      const supplierCity = cities.find(city => supplierLocation.includes(city));
      
      if (requestCity && supplierCity && requestCity === supplierCity) {
        score += 20;
        reasons.push(`Local supplier in ${requestCity}`);
      } else if (requestCity && supplierCity) {
        // Different cities but both major
        score += 5;
        reasons.push('Regional coverage available');
      }
    }

    // Verification and certification bonus
    if (supplierProfile?.verified) {
      score += 10;
      reasons.push('Verified supplier');
    }

    if (supplierProfile?.certifications?.length > 0) {
      score += 5;
      reasons.push('Certified professional');
    }

    // Portfolio quality (mock scoring)
    const portfolioItems = supplierProfile?.portfolioItems?.length || 0;
    if (portfolioItems >= 10) {
      score += 10;
      reasons.push('Extensive portfolio (10+ projects)');
    } else if (portfolioItems >= 5) {
      score += 5;
      reasons.push('Good portfolio showcase');
    }

    // Industry-specific seasonal factors
    const currentMonth = new Date().getMonth();
    
    // Add seasonal bonus for construction/infrastructure during good weather
    if (requestCategory?.slug === 'construction-infrastructure' && 
        [10, 11, 0, 1, 2].includes(currentMonth)) { // Nov-Mar (cooler months)
      score += 5;
      reasons.push('Optimal construction season');
    }

    return { score: Math.min(score, 100), reasons };
  };

  const fetchMatchedRequests = async () => {
    if (!user || userProfile?.role !== 'vendor') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch open requests that don't have offers from this vendor yet
      const { data: requests, error } = await supabase
        .from('requests')
        .select(`
          *,
          offers!left (
            id,
            vendor_id
          )
        `)
        .eq('status', 'new')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter out requests where this vendor has already submitted an offer
      const availableRequests = (requests || []).filter(request => 
        !request.offers?.some((offer: any) => offer.vendor_id === user.id)
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
