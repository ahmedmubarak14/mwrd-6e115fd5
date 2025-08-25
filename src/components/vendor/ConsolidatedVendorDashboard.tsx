
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useMatchingSystem } from '@/hooks/useMatchingSystem';
import { useOffers } from '@/hooks/useOffers';
import { LoadingState } from '@/components/dashboard/shared/LoadingState';
import { VendorStatsCards } from '@/components/vendor/VendorStatsCards';
import { VendorSearchFilters } from '@/components/vendor/VendorSearchFilters';
import { VendorOpportunitiesList } from '@/components/vendor/VendorOpportunitiesList';
import { UnifiedVerificationBanner } from '@/components/verification/UnifiedVerificationBanner';

export const ConsolidatedVendorDashboard = () => {
  const { t, language } = useLanguage();
  const { userProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const isRTL = language === 'ar';
  
  const { matchedRequests, loading: matchingLoading } = useMatchingSystem();
  const { offers, loading: offersLoading } = useOffers();

  // Check if user needs verification guidance
  const needsVerificationGuidance = userProfile && (
    userProfile.verification_status !== 'approved' || 
    userProfile.status !== 'approved'
  );

  const filteredRequests = matchedRequests.filter(request => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      request.title.toLowerCase().includes(searchLower) ||
      request.category.toLowerCase().includes(searchLower);
    const matchesCategory = categoryFilter === "all" || request.category === categoryFilter;
    const matchesUrgency = urgencyFilter === "all" || request.urgency === urgencyFilter;
    return matchesSearch && matchesCategory && matchesUrgency;
  });

  const handleSubmitOffer = (requestId: string) => {
    console.log('Submit offer for request:', requestId);
    // TODO: Implement offer submission logic
  };

  const handleViewDetails = (requestId: string) => {
    console.log('View details for request:', requestId);
    // TODO: Implement view details logic
  };

  if (matchingLoading || offersLoading) {
    return (
      <DashboardLayout className={isRTL ? 'font-arabic' : ''}>
        <LoadingState message={t('dashboard.loading')} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout className={isRTL ? 'font-arabic' : ''}>
      <div className="max-w-6xl mx-auto space-y-6 p-4 sm:p-6">
        {/* Verification Banner - Only show for non-verified users */}
        {needsVerificationGuidance && (
          <UnifiedVerificationBanner 
            userProfile={userProfile}
          />
        )}

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-lime/10 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                {t('vendor.welcome')}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                {t('vendor.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <VendorStatsCards loading={offersLoading} />

        {/* Search and Filters */}
        <VendorSearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          urgencyFilter={urgencyFilter}
          onUrgencyChange={setUrgencyFilter}
          resultsCount={filteredRequests.length}
        />

        {/* Opportunities List */}
        <VendorOpportunitiesList
          requests={filteredRequests}
          loading={matchingLoading}
          onSubmitOffer={handleSubmitOffer}
          onViewDetails={handleViewDetails}
        />
      </div>
    </DashboardLayout>
  );
};
