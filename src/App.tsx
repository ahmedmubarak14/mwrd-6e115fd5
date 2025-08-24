import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { RouteAwareThemeProvider } from "@/contexts/RouteAwareThemeContext";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { BackToTop } from "@/components/ui/BackToTop";
import { CallNotificationProvider } from "@/components/conversations/CallNotificationProvider";
import { PushNotificationManager } from "@/components/notifications/PushNotificationManager";

// Route components
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ProcurementSupplierDashboard } from "./pages/ProcurementSupplierDashboard";
import Requests from "./pages/Requests";
import Suppliers from "./pages/Suppliers";
import MyOffers from "./pages/MyOffers";
import BrowseRequests from "./pages/BrowseRequests";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Conversations from "./pages/Conversations";
import Notifications from "./pages/Notifications";
import Analytics from "./pages/Analytics";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import ExpertConsultation from "./pages/ExpertConsultation";
import AdminCategoryManagement from "./pages/admin/CategoryManagement";
import AdminUserManagement from "./pages/admin/UserManagement";
import AdminRequestManagement from "./pages/admin/RequestManagement";
import AdminOfferManagement from "./pages/admin/OfferManagement";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";
import AdminFinancialManagement from "./pages/admin/AdminFinancialManagement";
import AdminConsultationManagement from "./pages/admin/AdminConsultationManagement";
import AdminSystemHealth from "./pages/admin/AdminSystemHealth";
import AdminReports from "./pages/admin/AdminReports";
import AdminSupport from "./pages/admin/AdminSupport";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminBackup from "./pages/admin/AdminBackup";
import AdminIntegrations from "./pages/admin/AdminIntegrations";
import AdminAPIManagement from "./pages/admin/AdminAPIManagement";
import AdminSecurityCenter from "./pages/admin/AdminSecurityCenter";
import AdminContentManagement from "./pages/admin/AdminContentManagement";
import AdminWorkflowManagement from "./pages/admin/AdminWorkflowManagement";
import AdminComplianceCenter from "./pages/admin/AdminComplianceCenter";
import AdminPerformanceMonitoring from "./pages/admin/AdminPerformanceMonitoring";
import AdminResourceManagement from "./pages/admin/AdminResourceManagement";
import AdminEventManagement from "./pages/admin/AdminEventManagement";
import AdminVendorManagement from "./pages/admin/AdminVendorManagement";
import AdminClientManagement from "./pages/admin/AdminClientManagement";
import AdminSubscriptionManagement from "./pages/admin/AdminSubscriptionManagement";
import AdminPaymentManagement from "./pages/admin/AdminPaymentManagement";
import AdminTaxManagement from "./pages/admin/AdminTaxManagement";
import AdminInvoiceManagement from "./pages/admin/AdminInvoiceManagement";
import AdminContractManagement from "./pages/admin/AdminContractManagement";
import AdminDocumentManagement from "./pages/admin/AdminDocumentManagement";
import AdminTemplateManagement from "./pages/admin/AdminTemplateManagement";
import AdminEmailManagement from "./pages/admin/AdminEmailManagement";
import AdminSMSManagement from "./pages/admin/AdminSMSManagement";
import AdminPushNotificationManagement from "./pages/admin/AdminPushNotificationManagement";
import AdminCommunicationCenter from "./pages/admin/AdminCommunicationCenter";
import AdminMarketingCenter from "./pages/admin/AdminMarketingCenter";
import AdminCampaignManagement from "./pages/admin/AdminCampaignManagement";
import AdminLeadManagement from "./pages/admin/AdminLeadManagement";
import AdminCustomerSupport from "./pages/admin/AdminCustomerSupport";
import AdminTicketManagement from "./pages/admin/AdminTicketManagement";
import AdminKnowledgeBase from "./pages/admin/AdminKnowledgeBase";
import AdminFAQManagement from "./pages/admin/AdminFAQManagement";
import AdminTrainingCenter from "./pages/admin/AdminTrainingCenter";
import AdminCertificationManagement from "./pages/admin/AdminCertificationManagement";
import AdminSkillAssessment from "./pages/admin/AdminSkillAssessment";
import AdminQualityAssurance from "./pages/admin/AdminQualityAssurance";
import AdminRiskManagement from "./pages/admin/AdminRiskManagement";
import AdminInsuranceManagement from "./pages/admin/AdminInsuranceManagement";
import AdminLegalCenter from "./pages/admin/AdminLegalCenter";
import AdminDisputeResolution from "./pages/admin/AdminDisputeResolution";
import AdminArbitrationCenter from "./pages/admin/AdminArbitrationCenter";
import AdminMediationCenter from "./pages/admin/AdminMediationCenter";
import AdminEscrowManagement from "./pages/admin/AdminEscrowManagement";
import AdminTrustCenter from "./pages/admin/AdminTrustCenter";
import AdminReputationManagement from "./pages/admin/AdminReputationManagement";
import AdminRatingSystem from "./pages/admin/AdminRatingSystem";
import AdminReviewManagement from "./pages/admin/AdminReviewManagement";
import AdminFeedbackCenter from "./pages/admin/AdminFeedbackCenter";
import AdminSurveyManagement from "./pages/admin/AdminSurveyManagement";
import AdminPollManagement from "./pages/admin/AdminPollManagement";
import AdminVotingSystem from "./pages/admin/AdminVotingSystem";
import AdminGovernanceCenter from "./pages/admin/AdminGovernanceCenter";
import AdminPolicyManagement from "./pages/admin/AdminPolicyManagement";
import AdminProcedureManagement from "./pages/admin/AdminProcedureManagement";
import AdminGuidelineManagement from "./pages/admin/AdminGuidelineManagement";
import AdminStandardManagement from "./pages/admin/AdminStandardManagement";
import AdminBestPractices from "./pages/admin/AdminBestPractices";
import AdminInnovationCenter from "./pages/admin/AdminInnovationCenter";
import AdminResearchCenter from "./pages/admin/AdminResearchCenter";
import AdminDevelopmentCenter from "./pages/admin/AdminDevelopmentCenter";
import AdminTestingCenter from "./pages/admin/AdminTestingCenter";
import AdminDeploymentCenter from "./pages/admin/AdminDeploymentCenter";
import AdminMaintenanceCenter from "./pages/admin/AdminMaintenanceCenter";
import AdminUpdateCenter from "./pages/admin/AdminUpdateCenter";
import AdminVersionControl from "./pages/admin/AdminVersionControl";
import AdminChangeManagement from "./pages/admin/AdminChangeManagement";
import AdminConfigurationManagement from "./pages/admin/AdminConfigurationManagement";
import AdminEnvironmentManagement from "./pages/admin/AdminEnvironmentManagement";
import AdminInfrastructureManagement from "./pages/admin/AdminInfrastructureManagement";
import AdminCloudManagement from "./pages/admin/AdminCloudManagement";
import AdminServerManagement from "./pages/admin/AdminServerManagement";
import AdminDatabaseManagement from "./pages/admin/AdminDatabaseManagement";
import AdminNetworkManagement from "./pages/admin/AdminNetworkManagement";
import AdminSecurityManagement from "./pages/admin/AdminSecurityManagement";
import AdminAccessControl from "./pages/admin/AdminAccessControl";
import AdminPermissionManagement from "./pages/admin/AdminPermissionManagement";
import AdminRoleManagement from "./pages/admin/AdminRoleManagement";
import AdminGroupManagement from "./pages/admin/AdminGroupManagement";
import AdminTeamManagement from "./pages/admin/AdminTeamManagement";
import AdminDepartmentManagement from "./pages/admin/AdminDepartmentManagement";
import AdminOrganizationManagement from "./pages/admin/AdminOrganizationManagement";
import AdminHierarchyManagement from "./pages/admin/AdminHierarchyManagement";
import AdminStructureManagement from "./pages/admin/AdminStructureManagement";
import AdminWorkflowDesigner from "./pages/admin/AdminWorkflowDesigner";
import AdminProcessManagement from "./pages/admin/AdminProcessManagement";
import AdminAutomationCenter from "./pages/admin/AdminAutomationCenter";
import AdminSchedulerManagement from "./pages/admin/AdminSchedulerManagement";
import AdminJobManagement from "./pages/admin/AdminJobManagement";
import AdminTaskManagement from "./pages/admin/AdminTaskManagement";
import AdminProjectManagement from "./pages/admin/AdminProjectManagement";
import AdminPortfolioManagement from "./pages/admin/AdminPortfolioManagement";
import AdminProgramManagement from "./pages/admin/AdminProgramManagement";
import AdminInitiativeManagement from "./pages/admin/AdminInitiativeManagement";
import AdminStrategyManagement from "./pages/admin/AdminStrategyManagement";
import AdminPlanningCenter from "./pages/admin/AdminPlanningCenter";
import AdminForecastingCenter from "./pages/admin/AdminForecastingCenter";
import AdminBudgetingCenter from "./pages/admin/AdminBudgetingCenter";
import AdminCostManagement from "./pages/admin/AdminCostManagement";
import AdminRevenueManagement from "./pages/admin/AdminRevenueManagement";
import AdminProfitManagement from "./pages/admin/AdminProfitManagement";
import AdminLossManagement from "./pages/admin/AdminLossManagement";
import AdminAssetManagement from "./pages/admin/AdminAssetManagement";
import AdminLiabilityManagement from "./pages/admin/AdminLiabilityManagement";
import AdminEquityManagement from "./pages/admin/AdminEquityManagement";
import AdminCashFlowManagement from "./pages/admin/AdminCashFlowManagement";
import AdminTreasuryManagement from "./pages/admin/AdminTreasuryManagement";
import AdminInvestmentManagement from "./pages/admin/AdminInvestmentManagement";
import AdminFundingManagement from "./pages/admin/AdminFundingManagement";
import AdminGrantManagement from "./pages/admin/AdminGrantManagement";
import AdminDonationManagement from "./pages/admin/AdminDonationManagement";
import AdminSponsorshipManagement from "./pages/admin/AdminSponsorshipManagement";
import AdminPartnershipManagement from "./pages/admin/AdminPartnershipManagement";
import AdminAllianceManagement from "./pages/admin/AdminAllianceManagement";
import AdminNetworkingCenter from "./pages/admin/AdminNetworkingCenter";
import AdminCommunityManagement from "./pages/admin/AdminCommunityManagement";
import AdminForumManagement from "./pages/admin/AdminForumManagement";
import AdminDiscussionManagement from "./pages/admin/AdminDiscussionManagement";
import AdminChatManagement from "./pages/admin/AdminChatManagement";
import AdminMessagingCenter from "./pages/admin/AdminMessagingCenter";
import AdminVideoConferencing from "./pages/admin/AdminVideoConferencing";
import AdminWebinarManagement from "./pages/admin/AdminWebinarManagement";
import AdminEventStreaming from "./pages/admin/AdminEventStreaming";
import AdminBroadcastCenter from "./pages/admin/AdminBroadcastCenter";
import AdminAnnouncementCenter from "./pages/admin/AdminAnnouncementCenter";
import AdminNewsCenter from "./pages/admin/AdminNewsCenter";
import AdminBlogManagement from "./pages/admin/AdminBlogManagement";
import AdminArticleManagement from "./pages/admin/AdminArticleManagement";
import AdminPublicationCenter from "./pages/admin/AdminPublicationCenter";
import AdminLibraryManagement from "./pages/admin/AdminLibraryManagement";
import AdminArchiveManagement from "./pages/admin/AdminArchiveManagement";
import AdminHistoryCenter from "./pages/admin/AdminHistoryCenter";
import AdminTimelineManagement from "./pages/admin/AdminTimelineManagement";
import AdminMilestoneManagement from "./pages/admin/AdminMilestoneManagement";
import AdminAchievementCenter from "./pages/admin/AdminAchievementCenter";
import AdminAwardManagement from "./pages/admin/AdminAwardManagement";
import AdminRecognitionCenter from "./pages/admin/AdminRecognitionCenter";
import AdminBadgeManagement from "./pages/admin/AdminBadgeManagement";
import AdminPointSystem from "./pages/admin/AdminPointSystem";
import AdminLoyaltyProgram from "./pages/admin/AdminLoyaltyProgram";
import AdminRewardManagement from "./pages/admin/AdminRewardManagement";
import AdminIncentiveManagement from "./pages/admin/AdminIncentiveManagement";
import AdminPromotionCenter from "./pages/admin/AdminPromotionCenter";
import AdminDiscountManagement from "./pages/admin/AdminDiscountManagement";
import AdminCouponManagement from "./pages/admin/AdminCouponManagement";
import AdminVoucherManagement from "./pages/admin/AdminVoucherManagement";
import AdminGiftCardManagement from "./pages/admin/AdminGiftCardManagement";
import AdminCreditManagement from "./pages/admin/AdminCreditManagement";
import AdminWalletManagement from "./pages/admin/AdminWalletManagement";
import AdminBalanceManagement from "./pages/admin/AdminBalanceManagement";
import AdminTransactionCenter from "./pages/admin/AdminTransactionCenter";
import AdminPaymentGateway from "./pages/admin/AdminPaymentGateway";
import AdminBillingCenter from "./pages/admin/AdminBillingCenter";
import AdminInvoicingCenter from "./pages/admin/AdminInvoicingCenter";
import AdminReceiptManagement from "./pages/admin/AdminReceiptManagement";
import AdminRefundCenter from "./pages/admin/AdminRefundCenter";
import AdminChargebackManagement from "./pages/admin/AdminChargebackManagement";
import AdminDisputeCenter from "./pages/admin/AdminDisputeCenter";
import AdminFraudDetection from "./pages/admin/AdminFraudDetection";
import AdminRiskAssessment from "./pages/admin/AdminRiskAssessment";
import AdminComplianceMonitoring from "./pages/admin/AdminComplianceMonitoring";
import AdminAuditTrail from "./pages/admin/AdminAuditTrail";
import AdminForensicsCenter from "./pages/admin/AdminForensicsCenter";
import AdminIncidentManagement from "./pages/admin/AdminIncidentManagement";
import AdminEmergencyResponse from "./pages/admin/AdminEmergencyResponse";
import AdminCrisisManagement from "./pages/admin/AdminCrisisManagement";
import AdminDisasterRecovery from "./pages/admin/AdminDisasterRecovery";
import AdminBusinessContinuity from "./pages/admin/AdminBusinessContinuity";
import AdminBackupStrategy from "./pages/admin/AdminBackupStrategy";
import AdminRecoveryPlanning from "./pages/admin/AdminRecoveryPlanning";
import AdminTestingStrategy from "./pages/admin/AdminTestingStrategy";
import AdminValidationCenter from "./pages/admin/AdminValidationCenter";
import AdminVerificationCenter from "./pages/admin/AdminVerificationCenter";
import AdminCertificationCenter from "./pages/admin/AdminCertificationCenter";
import AdminAccreditationCenter from "./pages/admin/AdminAccreditationCenter";
import AdminLicensingCenter from "./pages/admin/AdminLicensingCenter";
import AdminPermitManagement from "./pages/admin/AdminPermitManagement";
import AdminApprovalCenter from "./pages/admin/AdminApprovalCenter";
import AdminAuthorizationCenter from "./pages/admin/AdminAuthorizationCenter";
import AdminEndorsementCenter from "./pages/admin/AdminEndorsementCenter";
import AdminRecommendationCenter from "./pages/admin/AdminRecommendationCenter";
import AdminReferralManagement from "./pages/admin/AdminReferralManagement";
import AdminAffiliateManagement from "./pages/admin/AdminAffiliateManagement";
import AdminInfluencerManagement from "./pages/admin/AdminInfluencerManagement";
import AdminAmbassadorProgram from "./pages/admin/AdminAmbassadorProgram";
import AdminAdvocacyCenter from "./pages/admin/AdminAdvocacyCenter";
import AdminTestimonialCenter from "./pages/admin/AdminTestimonialCenter";
import AdminCaseStudyManagement from "./pages/admin/AdminCaseStudyManagement";
import AdminSuccessStoryCenter from "./pages/admin/AdminSuccessStoryCenter";
import AdminPortfolioCenter from "./pages/admin/AdminPortfolioCenter";
import AdminShowcaseManagement from "./pages/admin/AdminShowcaseManagement";
import AdminGalleryManagement from "./pages/admin/AdminGalleryManagement";
import AdminMediaCenter from "./pages/admin/AdminMediaCenter";
import AdminAssetLibrary from "./pages/admin/AdminAssetLibrary";
import AdminResourceCenter from "./pages/admin/AdminResourceCenter";
import AdminToolManagement from "./pages/admin/AdminToolManagement";
import AdminUtilityCenter from "./pages/admin/AdminUtilityCenter";
import AdminHelperManagement from "./pages/admin/AdminHelperManagement";
import AdminAssistantCenter from "./pages/admin/AdminAssistantCenter";
import AdminBotManagement from "./pages/admin/AdminBotManagement";
import AdminAICenter from "./pages/admin/AdminAICenter";
import AdminMLManagement from "./pages/admin/AdminMLManagement";
import AdminDataScience from "./pages/admin/AdminDataScience";
import AdminAnalyticsEngine from "./pages/admin/AdminAnalyticsEngine";
import AdminInsightsCenter from "./pages/admin/AdminInsightsCenter";
import AdminIntelligenceCenter from "./pages/admin/AdminIntelligenceCenter";
import AdminPredictiveAnalytics from "./pages/admin/AdminPredictiveAnalytics";
import AdminForecastingEngine from "./pages/admin/AdminForecastingEngine";
import AdminTrendAnalysis from "./pages/admin/AdminTrendAnalysis";
import AdminPatternRecognition from "./pages/admin/AdminPatternRecognition";
import AdminAnomalyDetection from "./pages/admin/AdminAnomalyDetection";
import AdminOutlierAnalysis from "./pages/admin/AdminOutlierAnalysis";
import AdminStatisticalAnalysis from "./pages/admin/AdminStatisticalAnalysis";
import AdminDataMining from "./pages/admin/AdminDataMining";
import AdminDataWarehouse from "./pages/admin/AdminDataWarehouse";
import AdminDataLake from "./pages/admin/AdminDataLake";
import AdminBigDataManagement from "./pages/admin/AdminBigDataManagement";
import AdminCloudDataManagement from "./pages/admin/AdminCloudDataManagement";
import AdminDataGovernance from "./pages/admin/AdminDataGovernance";
import AdminDataQuality from "./pages/admin/AdminDataQuality";
import AdminDataIntegrity from "./pages/admin/AdminDataIntegrity";
import AdminDataSecurity from "./pages/admin/AdminDataSecurity";
import AdminDataPrivacy from "./pages/admin/AdminDataPrivacy";
import AdminDataProtection from "./pages/admin/AdminDataProtection";
import AdminDataRetention from "./pages/admin/AdminDataRetention";
import AdminDataArchival from "./pages/admin/AdminDataArchival";
import AdminDataPurging from "./pages/admin/AdminDataPurging";
import AdminDataMigration from "./pages/admin/AdminDataMigration";
import AdminDataTransformation from "./pages/admin/AdminDataTransformation";
import AdminDataCleansing from "./pages/admin/AdminDataCleansing";
import AdminDataValidation from "./pages/admin/AdminDataValidation";
import AdminDataEnrichment from "./pages/admin/AdminDataEnrichment";
import AdminDataStandardization from "./pages/admin/AdminDataStandardization";
import AdminDataNormalization from "./pages/admin/AdminDataNormalization";
import AdminDataOptimization from "./pages/admin/AdminDataOptimization";
import AdminPerformanceOptimization from "./pages/admin/AdminPerformanceOptimization";
import AdminScalabilityManagement from "./pages/admin/AdminScalabilityManagement";
import AdminCapacityPlanning from "./pages/admin/AdminCapacityPlanning";
import AdminLoadBalancing from "./pages/admin/AdminLoadBalancing";
import AdminTrafficManagement from "./pages/admin/AdminTrafficManagement";
import AdminBandwidthManagement from "./pages/admin/AdminBandwidthManagement";
import AdminLatencyOptimization from "./pages/admin/AdminLatencyOptimization";
import AdminThroughputOptimization from "./pages/admin/AdminThroughputOptimization";
import AdminResponseTimeOptimization from "./pages/admin/AdminResponseTimeOptimization";
import AdminAvailabilityManagement from "./pages/admin/AdminAvailabilityManagement";
import AdminReliabilityManagement from "./pages/admin/AdminReliabilityManagement";
import AdminStabilityManagement from "./pages/admin/AdminStabilityManagement";
import AdminRobustnessManagement from "./pages/admin/AdminRobustnessManagement";
import AdminResilienceManagement from "./pages/admin/AdminResilienceManagement";
import AdminFaultTolerance from "./pages/admin/AdminFaultTolerance";
import AdminErrorHandling from "./pages/admin/AdminErrorHandling";
import AdminExceptionManagement from "./pages/admin/AdminExceptionManagement";
import AdminLoggingCenter from "./pages/admin/AdminLoggingCenter";
import AdminMonitoringCenter from "./pages/admin/AdminMonitoringCenter";
import AdminAlertingCenter from "./pages/admin/AdminAlertingCenter";
import AdminNotificationEngine from "./pages/admin/AdminNotificationEngine";
import AdminEscalationManagement from "./pages/admin/AdminEscalationManagement";
import AdminIncidentResponse from "./pages/admin/AdminIncidentResponse";
import AdminProblemManagement from "./pages/admin/AdminProblemManagement";
import AdminChangeControl from "./pages/admin/AdminChangeControl";
import AdminReleaseManagement from "./pages/admin/AdminReleaseManagement";
import AdminDeploymentManagement from "./pages/admin/AdminDeploymentManagement";
import AdminConfigurationControl from "./pages/admin/AdminConfigurationControl";
import AdminAssetTracking from "./pages/admin/AdminAssetTracking";
import AdminInventoryManagement from "./pages/admin/AdminInventoryManagement";
import AdminStockManagement from "./pages/admin/AdminStockManagement";
import AdminWarehouseManagement from "./pages/admin/AdminWarehouseManagement";
import AdminSupplyChainManagement from "./pages/admin/AdminSupplyChainManagement";
import AdminLogisticsManagement from "./pages/admin/AdminLogisticsManagement";
import AdminDistributionManagement from "./pages/admin/AdminDistributionManagement";
import AdminFulfillmentCenter from "./pages/admin/AdminFulfillmentCenter";
import AdminShippingManagement from "./pages/admin/AdminShippingManagement";
import AdminDeliveryManagement from "./pages/admin/AdminDeliveryManagement";
import AdminTrackingCenter from "./pages/admin/AdminTrackingCenter";
import AdminOrderManagement from "./pages/admin/AdminOrderManagement";
import AdminPurchaseManagement from "./pages/admin/AdminPurchaseManagement";
import AdminProcurementCenter from "./pages/admin/AdminProcurementCenter";
import AdminSourcingManagement from "./pages/admin/AdminSourcingManagement";
import AdminVendorPortal from "./pages/admin/AdminVendorPortal";
import AdminSupplierPortal from "./pages/admin/AdminSupplierPortal";
import AdminPartnerPortal from "./pages/admin/AdminPartnerPortal";
import AdminClientPortal from "./pages/admin/AdminClientPortal";
import AdminCustomerPortal from "./pages/admin/AdminCustomerPortal";
import AdminUserPortal from "./pages/admin/AdminUserPortal";
import AdminMemberPortal from "./pages/admin/AdminMemberPortal";
import AdminSubscriberPortal from "./pages/admin/AdminSubscriberPortal";
import AdminGuestPortal from "./pages/admin/AdminGuestPortal";
import AdminVisitorCenter from "./pages/admin/AdminVisitorCenter";
import AdminWelcomeCenter from "./pages/admin/AdminWelcomeCenter";
import AdminOnboardingCenter from "./pages/admin/AdminOnboardingCenter";
import AdminOrientationCenter from "./pages/admin/AdminOrientationCenter";
import AdminIntroductionCenter from "./pages/admin/AdminIntroductionCenter";
import AdminTutorialCenter from "./pages/admin/AdminTutorialCenter";
import AdminGuideCenter from "./pages/admin/AdminGuideCenter";
import AdminHelpCenter from "./pages/admin/AdminHelpCenter";
import AdminSupportCenter from "./pages/admin/AdminSupportCenter";
import AdminServiceCenter from "./pages/admin/AdminServiceCenter";
import AdminAssistanceCenter from "./pages/admin/AdminAssistanceCenter";
import AdminGuidanceCenter from "./pages/admin/AdminGuidanceCenter";
import AdminConsultingCenter from "./pages/admin/AdminConsultingCenter";
import AdminAdvisoryCenter from "./pages/admin/AdminAdvisoryCenter";
import AdminMentoringCenter from "./pages/admin/AdminMentoringCenter";
import AdminCoachingCenter from "./pages/admin/AdminCoachingCenter";
import AdminTrainingManagement from "./pages/admin/AdminTrainingManagement";
import AdminEducationCenter from "./pages/admin/AdminEducationCenter";
import AdminLearningCenter from "./pages/admin/AdminLearningCenter";
import AdminDevelopmentCenter from "./pages/admin/AdminDevelopmentCenter";
import AdminGrowthCenter from "./pages/admin/AdminGrowthCenter";
import AdminImprovementCenter from "./pages/admin/AdminImprovementCenter";
import AdminEnhancementCenter from "./pages/admin/AdminEnhancementCenter";
import AdminOptimizationCenter from "./pages/admin/AdminOptimizationCenter";
import AdminEfficiencyCenter from "./pages/admin/AdminEfficiencyCenter";
import AdminProductivityCenter from "./pages/admin/AdminProductivityCenter";
import AdminQualityCenter from "./pages/admin/AdminQualityCenter";
import AdminExcellenceCenter from "./pages/admin/AdminExcellenceCenter";
import AdminInnovationHub from "./pages/admin/AdminInnovationHub";
import AdminCreativityCenter from "./pages/admin/AdminCreativityCenter";
import AdminIdeationCenter from "./pages/admin/AdminIdeationCenter";
import AdminBrainstormingCenter from "./pages/admin/AdminBrainstormingCenter";
import AdminCollaborationCenter from "./pages/admin/AdminCollaborationCenter";
import AdminTeamworkCenter from "./pages/admin/AdminTeamworkCenter";
import AdminPartnershipCenter from "./pages/admin/AdminPartnershipCenter";
import AdminAllianceCenter from "./pages/admin/AdminAllianceCenter";
import AdminNetworkCenter from "./pages/admin/AdminNetworkCenter";
import AdminEcosystemManagement from "./pages/admin/AdminEcosystemManagement";
import AdminPlatformManagement from "./pages/admin/AdminPlatformManagement";
import AdminMarketplaceManagement from "./pages/admin/AdminMarketplaceManagement";
import AdminExchangeManagement from "./pages/admin/AdminExchangeManagement";
import AdminTradingCenter from "./pages/admin/AdminTradingCenter";
import AdminCommercePlatform from "./pages/admin/AdminCommercePlatform";
import AdminBusinessCenter from "./pages/admin/AdminBusinessCenter";
import AdminEnterpriseCenter from "./pages/admin/AdminEnterpriseCenter";
import AdminCorporateCenter from "./pages/admin/AdminCorporateCenter";
import AdminOrganizationalCenter from "./pages/admin/AdminOrganizationalCenter";
import AdminInstitutionalCenter from "./pages/admin/AdminInstitutionalCenter";
import AdminGovernmentalCenter from "./pages/admin/AdminGovernmentalCenter";
import AdminPublicSectorCenter from "./pages/admin/AdminPublicSectorCenter";
import AdminPrivateSectorCenter from "./pages/admin/AdminPrivateSectorCenter";
import AdminNonProfitCenter from "./pages/admin/AdminNonProfitCenter";
import AdminCharityCenter from "./pages/admin/AdminCharityCenter";
import AdminFoundationCenter from "./pages/admin/AdminFoundationCenter";
import AdminTrustCenter from "./pages/admin/AdminTrustCenter";
import AdminEndowmentCenter from "./pages/admin/AdminEndowmentCenter";
import AdminScholarshipCenter from "./pages/admin/AdminScholarshipCenter";
import AdminGrantCenter from "./pages/admin/AdminGrantCenter";
import AdminFundingCenter from "./pages/admin/AdminFundingCenter";
import AdminInvestmentCenter from "./pages/admin/AdminInvestmentCenter";
import AdminCapitalCenter from "./pages/admin/AdminCapitalCenter";
import AdminFinanceCenter from "./pages/admin/AdminFinanceCenter";
import AdminBankingCenter from "./pages/admin/AdminBankingCenter";
import AdminInsuranceCenter from "./pages/admin/AdminInsuranceCenter";
import AdminRealEstateCenter from "./pages/admin/AdminRealEstateCenter";
import AdminPropertyManagement from "./pages/admin/AdminPropertyManagement";
import AdminFacilityManagement from "./pages/admin/AdminFacilityManagement";
import AdminMaintenanceManagement from "./pages/admin/AdminMaintenanceManagement";
import AdminOperationsCenter from "./pages/admin/AdminOperationsCenter";
import AdminProductionCenter from "./pages/admin/AdminProductionCenter";
import AdminManufacturingCenter from "./pages/admin/AdminManufacturingCenter";
import AdminAssemblyCenter from "./pages/admin/AdminAssemblyCenter";
import AdminProcessingCenter from "./pages/admin/AdminProcessingCenter";
import AdminRefinementCenter from "./pages/admin/AdminRefinementCenter";
import AdminTransformationCenter from "./pages/admin/AdminTransformationCenter";
import AdminConversionCenter from "./pages/admin/AdminConversionCenter";
import AdminAdaptationCenter from "./pages/admin/AdminAdaptationCenter";
import AdminCustomizationCenter from "./pages/admin/AdminCustomizationCenter";
import AdminPersonalizationCenter from "./pages/admin/AdminPersonalizationCenter";
import AdminIndividualizationCenter from "./pages/admin/AdminIndividualizationCenter";
import AdminSpecializationCenter from "./pages/admin/AdminSpecializationCenter";
import AdminExpertiseCenter from "./pages/admin/AdminExpertiseCenter";
import AdminProficiencyCenter from "./pages/admin/AdminProficiencyCenter";
import AdminMasteryCenter from "./pages/admin/AdminMasteryCenter";
import AdminCompetencyCenter from "./pages/admin/AdminCompetencyCenter";
import AdminCapabilityCenter from "./pages/admin/AdminCapabilityCenter";
import AdminSkillCenter from "./pages/admin/AdminSkillCenter";
import AdminTalentCenter from "./pages/admin/AdminTalentCenter";
import AdminAbilityCenter from "./pages/admin/AdminAbilityCenter";
import AdminPotentialCenter from "./pages/admin/AdminPotentialCenter";
import AdminOpportunityCenter from "./pages/admin/AdminOpportunityCenter";
import AdminPossibilityCenter from "./pages/admin/AdminPossibilityCenter";
import AdminProspectCenter from "./pages/admin/AdminProspectCenter";
import AdminFutureCenter from "./pages/admin/AdminFutureCenter";
import AdminVisionCenter from "./pages/admin/AdminVisionCenter";
import AdminMissionCenter from "./pages/admin/AdminMissionCenter";
import AdminPurposeCenter from "./pages/admin/AdminPurposeCenter";
import AdminGoalCenter from "./pages/admin/AdminGoalCenter";
import AdminObjectiveCenter from "./pages/admin/AdminObjectiveCenter";
import AdminTargetCenter from "./pages/admin/AdminTargetCenter";
import AdminAimCenter from "./pages/admin/AdminAimCenter";
import AdminIntentionCenter from "./pages/admin/AdminIntentionCenter";
import AdminAmbitionCenter from "./pages/admin/AdminAmbitionCenter";
import AdminAspirationCenter from "./pages/admin/AdminAspirationCenter";
import AdminDreamCenter from "./pages/admin/AdminDreamCenter";
import AdminHopeCenter from "./pages/admin/AdminHopeCenter";
import AdminWishCenter from "./pages/admin/AdminWishCenter";
import AdminDesireCenter from "./pages/admin/AdminDesireCenter";
import AdminWantCenter from "./pages/admin/AdminWantCenter";
import AdminNeedCenter from "./pages/admin/AdminNeedCenter";
import AdminRequirementCenter from "./pages/admin/AdminRequirementCenter";
import AdminDemandCenter from "./pages/admin/AdminDemandCenter";
import AdminRequestCenter from "./pages/admin/AdminRequestCenter";
import AdminOrderCenter from "./pages/admin/AdminOrderCenter";
import AdminCommandCenter from "./pages/admin/AdminCommandCenter";
import AdminControlCenter from "./pages/admin/AdminControlCenter";
import AdminManagementCenter from "./pages/admin/AdminManagementCenter";
import AdminAdministrationCenter from "./pages/admin/AdminAdministrationCenter";
import AdminGovernanceHub from "./pages/admin/AdminGovernanceHub";
import AdminLeadershipCenter from "./pages/admin/AdminLeadershipCenter";
import AdminDirectionCenter from "./pages/admin/AdminDirectionCenter";
import AdminGuidanceHub from "./pages/admin/AdminGuidanceHub";
import AdminSupervisionCenter from "./pages/admin/AdminSupervisionCenter";
import AdminOversightCenter from "./pages/admin/AdminOversightCenter";
import AdminMonitoringHub from "./pages/admin/AdminMonitoringHub";
import AdminSurveillanceCenter from "./pages/admin/AdminSurveillanceCenter";
import AdminObservationCenter from "./pages/admin/AdminObservationCenter";
import AdminWatchCenter from "./pages/admin/AdminWatchCenter";
import AdminGuardCenter from "./pages/admin/AdminGuardCenter";
import AdminProtectionCenter from "./pages/admin/AdminProtectionCenter";
import AdminSecurityHub from "./pages/admin/AdminSecurityHub";
import AdminSafetyCenter from "./pages/admin/AdminSafetyCenter";
import AdminWellnessCenter from "./pages/admin/AdminWellnessCenter";
import AdminHealthCenter from "./pages/admin/AdminHealthCenter";
import AdminFitnessCenter from "./pages/admin/AdminFitnessCenter";
import AdminVitalityCenter from "./pages/admin/AdminVitalityCenter";
import AdminEnergyCenter from "./pages/admin/AdminEnergyCenter";
import AdminPowerCenter from "./pages/admin/AdminPowerCenter";
import AdminStrengthCenter from "./pages/admin/AdminStrengthCenter";
import AdminForceCenter from "./pages/admin/AdminForceCenter";
import AdminImpactCenter from "./pages/admin/AdminImpactCenter";
import AdminInfluenceCenter from "./pages/admin/AdminInfluenceCenter";
import AdminEffectCenter from "./pages/admin/AdminEffectCenter";
import AdminResultCenter from "./pages/admin/AdminResultCenter";
import AdminOutcomeCenter from "./pages/admin/AdminOutcomeCenter";
import AdminConsequenceCenter from "./pages/admin/AdminConsequenceCenter";
import AdminImplicationCenter from "./pages/admin/AdminImplicationCenter";
import AdminSignificanceCenter from "./pages/admin/AdminSignificanceCenter";
import AdminImportanceCenter from "./pages/admin/AdminImportanceCenter";
import AdminValueCenter from "./pages/admin/AdminValueCenter";
import AdminWorthCenter from "./pages/admin/AdminWorthCenter";
import AdminMeritCenter from "./pages/admin/AdminMeritCenter";
import AdminQualityHub from "./pages/admin/AdminQualityHub";
import AdminStandardCenter from "./pages/admin/AdminStandardCenter";
import AdminBenchmarkCenter from "./pages/admin/AdminBenchmarkCenter";
import AdminMetricCenter from "./pages/admin/AdminMetricCenter";
import AdminMeasurementCenter from "./pages/admin/AdminMeasurementCenter";
import AdminAssessmentHub from "./pages/admin/AdminAssessmentHub";
import AdminEvaluationCenter from "./pages/admin/AdminEvaluationCenter";
import AdminAnalysisHub from "./pages/admin/AdminAnalysisHub";
import AdminExaminationCenter from "./pages/admin/AdminExaminationCenter";
import AdminInspectionCenter from "./pages/admin/AdminInspectionCenter";
import AdminReviewHub from "./pages/admin/AdminReviewHub";
import AdminAuditCenter from "./pages/admin/AdminAuditCenter";
import AdminCheckCenter from "./pages/admin/AdminCheckCenter";
import AdminVerificationHub from "./pages/admin/AdminVerificationHub";
import AdminValidationHub from "./pages/admin/AdminValidationHub";
import AdminConfirmationCenter from "./pages/admin/AdminConfirmationCenter";
import AdminApprovalHub from "./pages/admin/AdminApprovalHub";
import AdminAuthorizationHub from "./pages/admin/AdminAuthorizationHub";
import AdminPermissionHub from "./pages/admin/AdminPermissionHub";
import AdminAccessHub from "./pages/admin/AdminAccessHub";
import AdminEntryCenter from "./pages/admin/AdminEntryCenter";
import AdminAdmissionCenter from "./pages/admin/AdminAdmissionCenter";
import AdminAcceptanceCenter from "./pages/admin/AdminAcceptanceCenter";
import AdminWelcomeHub from "./pages/admin/AdminWelcomeHub";
import AdminGreetingCenter from "./pages/admin/AdminGreetingCenter";
import AdminReceptionCenter from "./pages/admin/AdminReceptionCenter";
import AdminHospitalityCenter from "./pages/admin/AdminHospitalityCenter";
import AdminServiceHub from "./pages/admin/AdminServiceHub";
import AdminSupportHub from "./pages/admin/AdminSupportHub";
import AdminAssistanceHub from "./pages/admin/AdminAssistanceHub";
import AdminHelpHub from "./pages/admin/AdminHelpHub";
import AdminAidCenter from "./pages/admin/AdminAidCenter";
import AdminReliefCenter from "./pages/admin/AdminReliefCenter";
import AdminRescueCenter from "./pages/admin/AdminRescueCenter";
import AdminEmergencyCenter from "./pages/admin/AdminEmergencyCenter";
import AdminUrgentCareCenter from "./pages/admin/AdminUrgentCareCenter";
import AdminCriticalCareCenter from "./pages/admin/AdminCriticalCareCenter";
import AdminIntensiveCareCenter from "./pages/admin/AdminIntensiveCareCenter";
import AdminSpecialCareCenter from "./pages/admin/AdminSpecialCareCenter";
import AdminPremiumCareCenter from "./pages/admin/AdminPremiumCareCenter";
import AdminVIPCenter from "./pages/admin/AdminVIPCenter";
import AdminExecutiveCenter from "./pages/admin/AdminExecutiveCenter";
import AdminManagementHub from "./pages/admin/AdminManagementHub";
import AdminLeadershipHub from "./pages/admin/AdminLeadershipHub";
import AdminDirectorCenter from "./pages/admin/AdminDirectorCenter";
import AdminExecutiveHub from "./pages/admin/AdminExecutiveHub";
import AdminPresidentialCenter from "./pages/admin/AdminPresidentialCenter";
import AdminChairmanCenter from "./pages/admin/AdminChairmanCenter";
import AdminBoardCenter from "./pages/admin/AdminBoardCenter";
import AdminCouncilCenter from "./pages/admin/AdminCouncilCenter";
import AdminCommitteeCenter from "./pages/admin/AdminCommitteeCenter";
import AdminPanelCenter from "./pages/admin/AdminPanelCenter";
import AdminGroupHub from "./pages/admin/AdminGroupHub";
import AdminTeamHub from "./pages/admin/AdminTeamHub";
import AdminSquadCenter from "./pages/admin/AdminSquadCenter";
import AdminCrewCenter from "./pages/admin/AdminCrewCenter";
import AdminStaffCenter from "./pages/admin/AdminStaffCenter";
import AdminPersonnelCenter from "./pages/admin/AdminPersonnelCenter";
import AdminWorkforceCenter from "./pages/admin/AdminWorkforceCenter";
import AdminEmployeeCenter from "./pages/admin/AdminEmployeeCenter";
import AdminWorkerCenter from "./pages/admin/AdminWorkerCenter";
import AdminLaborCenter from "./pages/admin/AdminLaborCenter";
import AdminResourceHub from "./pages/admin/AdminResourceHub";
import AdminAssetHub from "./pages/admin/AdminAssetHub";
import AdminCapitalHub from "./pages/admin/AdminCapitalHub";
import AdminFundHub from "./pages/admin/AdminFundHub";
import AdminBudgetHub from "./pages/admin/AdminBudgetHub";
import AdminFinanceHub from "./pages/admin/AdminFinanceHub";
import AdminMoneyCenter from "./pages/admin/AdminMoneyCenter";
import AdminCurrencyCenter from "./pages/admin/AdminCurrencyCenter";
import AdminCashCenter from "./pages/admin/AdminCashCenter";
import AdminCreditHub from "./pages/admin/AdminCreditHub";
import AdminDebitCenter from "./pages/admin/AdminDebitCenter";
import AdminAccountCenter from "./pages/admin/AdminAccountCenter";
import AdminLedgerCenter from "./pages/admin/AdminLedgerCenter";
import AdminBookkeepingCenter from "./pages/admin/AdminBookkeepingCenter";
import AdminAccountingHub from "./pages/admin/AdminAccountingHub";
import AdminAuditingCenter from "./pages/admin/AdminAuditingCenter";
import AdminTaxCenter from "./pages/admin/AdminTaxCenter";
import AdminRevenueHub from "./pages/admin/AdminRevenueHub";
import AdminIncomeCenter from "./pages/admin/AdminIncomeCenter";
import AdminEarningsCenter from "./pages/admin/AdminEarningsCenter";
import AdminProfitHub from "./pages/admin/AdminProfitHub";
import AdminGainCenter from "./pages/admin/AdminGainCenter";
import AdminBenefitCenter from "./pages/admin/AdminBenefitCenter";
import AdminAdvantageCenter from "./pages/admin/AdminAdvantageCenter";
import AdminOpportunityHub from "./pages/admin/AdminOpportunityHub";
import AdminChanceCenter from "./pages/admin/AdminChanceCenter";
import AdminPossibilityHub from "./pages/admin/AdminPossibilityHub";
import AdminPotentialHub from "./pages/admin/AdminPotentialHub";
import AdminProspectHub from "./pages/admin/AdminProspectHub";
import AdminFutureHub from "./pages/admin/AdminFutureHub";
import AdminTomorrowCenter from "./pages/admin/AdminTomorrowCenter";
import AdminNextCenter from "./pages/admin/AdminNextCenter";
import AdminUpcomingCenter from "./pages/admin/AdminUpcomingCenter";
import AdminPendingCenter from "./pages/admin/AdminPendingCenter";
import AdminWaitingCenter from "./pages/admin/AdminWaitingCenter";
import AdminQueueCenter from "./pages/admin/AdminQueueCenter";
import AdminLineCenter from "./pages/admin/AdminLineCenter";
import AdminSequenceCenter from "./pages/admin/AdminSequenceCenter";
import AdminOrderHub from "./pages/admin/AdminOrderHub";
import AdminArrangementCenter from "./pages/admin/AdminArrangementCenter";
import AdminOrganizationHub from "./pages/admin/AdminOrganizationHub";
import AdminStructureHub from "./pages/admin/AdminStructureHub";
import AdminSystemHub from "./pages/admin/AdminSystemHub";
import AdminFrameworkCenter from "./pages/admin/AdminFrameworkCenter";
import AdminArchitectureCenter from "./pages/admin/AdminArchitectureCenter";
import AdminDesignCenter from "./pages/admin/AdminDesignCenter";
import AdminPlanCenter from "./pages/admin/AdminPlanCenter";
import AdminSchemeCenter from "./pages/admin/AdminSchemeCenter";
import AdminStrategyHub from "./pages/admin/AdminStrategyHub";
import AdminTacticCenter from "./pages/admin/AdminTacticCenter";
import AdminApproachCenter from "./pages/admin/AdminApproachCenter";
import AdminMethodCenter from "./pages/admin/AdminMethodCenter";
import AdminTechniqueCenter from "./pages/admin/AdminTechniqueCenter";
import AdminProcedureHub from "./pages/admin/AdminProcedureHub";
import AdminProcessHub from "./pages/admin/AdminProcessHub";
import AdminWorkflowHub from "./pages/admin/AdminWorkflowHub";
import AdminOperationHub from "./pages/admin/AdminOperationHub";
import AdminFunctionCenter from "./pages/admin/AdminFunctionCenter";
import AdminActivityCenter from "./pages/admin/AdminActivityCenter";
import AdminTaskHub from "./pages/admin/AdminTaskHub";
import AdminJobHub from "./pages/admin/AdminJobHub";
import AdminWorkCenter from "./pages/admin/AdminWorkCenter";
import AdminLaborHub from "./pages/admin/AdminLaborHub";
import AdminEffortCenter from "./pages/admin/AdminEffortCenter";
import AdminEnergyHub from "./pages/admin/AdminEnergyHub";
import AdminPowerHub from "./pages/admin/AdminPowerHub";
import AdminForceHub from "./pages/admin/AdminForceHub";
import AdminStrengthHub from "./pages/admin/AdminStrengthHub";
import AdminMightCenter from "./pages/admin/AdminMightCenter";
import AdminCapacityHub from "./pages/admin/AdminCapacityHub";
import AdminAbilityHub from "./pages/admin/AdminAbilityHub";
import AdminSkillHub from "./pages/admin/AdminSkillHub";
import AdminTalentHub from "./pages/admin/AdminTalentHub";
import AdminGiftCenter from "./pages/admin/AdminGiftCenter";
import AdminEndowmentHub from "./pages/admin/AdminEndowmentHub";
import AdminNatureCenter from "./pages/admin/AdminNatureCenter";
import AdminCharacterCenter from "./pages/admin/AdminCharacterCenter";
import AdminPersonalityCenter from "./pages/admin/AdminPersonalityCenter";
import AdminIdentityCenter from "./pages/admin/AdminIdentityCenter";
import AdminProfileHub from "./pages/admin/AdminProfileHub";
import AdminBiographyCenter from "./pages/admin/AdminBiographyCenter";
import AdminHistoryHub from "./pages/admin/AdminHistoryHub";
import AdminRecordCenter from "./pages/admin/AdminRecordCenter";
import AdminDocumentHub from "./pages/admin/AdminDocumentHub";
import AdminFileCenter from "./pages/admin/AdminFileCenter";
import AdminFolderCenter from "./pages/admin/AdminFolderCenter";
import AdminDirectoryCenter from "./pages/admin/AdminDirectoryCenter";
import AdminCatalogCenter from "./pages/admin/AdminCatalogCenter";
import AdminIndexCenter from "./pages/admin/AdminIndexCenter";
import AdminListCenter from "./pages/admin/AdminListCenter";
import AdminRegistryCenter from "./pages/admin/AdminRegistryCenter";
import AdminDatabaseHub from "./pages/admin/AdminDatabaseHub";
import AdminRepositoryCenter from "./pages/admin/AdminRepositoryCenter";
import AdminStorageCenter from "./pages/admin/AdminStorageCenter";
import AdminWarehouseHub from "./pages/admin/AdminWarehouseHub";
import AdminDepotCenter from "./pages/admin/AdminDepotCenter";
import AdminVaultCenter from "./pages/admin/AdminVaultCenter";
import AdminSafeCenter from "./pages/admin/AdminSafeCenter";
import AdminSecureCenter from "./pages/admin/AdminSecureCenter";
import AdminProtectedCenter from "./pages/admin/AdminProtectedCenter";
import AdminPrivateCenter from "./pages/admin/AdminPrivateCenter";
import AdminConfidentialCenter from "./pages/admin/AdminConfidentialCenter";
import AdminClassifiedCenter from "./pages/admin/AdminClassifiedCenter";
import AdminRestrictedCenter from "./pages/admin/AdminRestrictedCenter";
import AdminLimitedCenter from "./pages/admin/AdminLimitedCenter";
import AdminControlledCenter from "./pages/admin/AdminControlledCenter";
import AdminRegulatedCenter from "./pages/admin/AdminRegulatedCenter";
import AdminManagedCenter from "./pages/admin/AdminManagedCenter";
import AdminSupervisedCenter from "./pages/admin/AdminSupervisedCenter";
import AdminOversightHub from "./pages/admin/AdminOversightHub";
import AdminGovernanceCenter from "./pages/admin/AdminGovernanceCenter";
import AdminRuleCenter from "./pages/admin/AdminRuleCenter";
import AdminRegulationCenter from "./pages/admin/AdminRegulationCenter";
import AdminLawCenter from "./pages/admin/AdminLawCenter";
import AdminLegalHub from "./pages/admin/AdminLegalHub";
import AdminJudicialCenter from "./pages/admin/AdminJudicialCenter";
import AdminCourtCenter from "./pages/admin/AdminCourtCenter";
import AdminTribunalCenter from "./pages/admin/AdminTribunalCenter";
import AdminJusticeCenter from "./pages/admin/AdminJusticeCenter";
import AdminFairnessCenter from "./pages/admin/AdminFairnessCenter";
import AdminEquityHub from "./pages/admin/AdminEquityHub";
import AdminEqualityCenter from "./pages/admin/AdminEqualityCenter";
import AdminBalanceCenter from "./pages/admin/AdminBalanceCenter";
import AdminHarmonyCenter from "./pages/admin/AdminHarmonyCenter";
import AdminPeaceCenter from "./pages/admin/AdminPeaceCenter";
import AdminTranquilityCenter from "./pages/admin/AdminTranquilityCenter";
import AdminSerenityCenter from "./pages/admin/AdminSerenityCenter";
import AdminCalmCenter from "./pages/admin/AdminCalmCenter";
import AdminQuietCenter from "./pages/admin/AdminQuietCenter";
import AdminSilenceCenter from "./pages/admin/AdminSilenceCenter";
import AdminStillnessCenter from "./pages/admin/AdminStillnessCenter";
import AdminRestCenter from "./pages/admin/AdminRestCenter";
import AdminRelaxationCenter from "./pages/admin/AdminRelaxationCenter";
import AdminComfortCenter from "./pages/admin/AdminComfortCenter";
import AdminEaseCenter from "./pages/admin/AdminEaseCenter";
import AdminConvenienceCenter from "./pages/admin/AdminConvenienceCenter";
import AdminSimplicityCenter from "./pages/admin/AdminSimplicityCenter";
import AdminClarityCenter from "./pages/admin/AdminClarityCenter";
import AdminTransparencyCenter from "./pages/admin/AdminTransparencyCenter";
import AdminOpennessCenter from "./pages/admin/AdminOpennessCenter";
import AdminHonestyCenter from "./pages/admin/AdminHonestyCenter";
import AdminIntegrityHub from "./pages/admin/AdminIntegrityHub";
import AdminTrustworthinessCenter from "./pages/admin/AdminTrustworthinessCenter";
import AdminReliabilityHub from "./pages/admin/AdminReliabilityHub";
import AdminDependabilityCenter from "./pages/admin/AdminDependabilityCenter";
import AdminConsistencyCenter from "./pages/admin/AdminConsistencyCenter";
import AdminStabilityHub from "./pages/admin/AdminStabilityHub";
import AdminSteadinessCenter from "./pages/admin/AdminSteadinessCenter";
import AdminFirmnessCenter from "./pages/admin/AdminFirmnessCenter";
import AdminSolidityCenter from "./pages/admin/AdminSolidityCenter";
import AdminStrengthCenter from "./pages/admin/AdminStrengthCenter";
import AdminDurabilityCenter from "./pages/admin/AdminDurabilityCenter";
import AdminLongevityCenter from "./pages/admin/AdminLongevityCenter";
import AdminPermanenceCenter from "./pages/admin/AdminPermanenceCenter";
import AdminContinuityCenter from "./pages/admin/AdminContinuityCenter";
import AdminPersistenceCenter from "./pages/admin/AdminPersistenceCenter";
import AdminEnduranceCenter from "./pages/admin/AdminEnduranceCenter";
import AdminResilienceHub from "./pages/admin/AdminResilienceHub";
import AdminToughnessCenter from "./pages/admin/AdminToughnessCenter";
import AdminHardnessCenter from "./pages/admin/AdminHardnessCenter";
import AdminRigidityCenter from "./pages/admin/AdminRigidityCenter";
import AdminStiffnessCenter from "./pages/admin/AdminStiffnessCenter";
import AdminInflexibilityCenter from "./pages/admin/AdminInflexibilityCenter";
import AdminImmobilityCenter from "./pages/admin/AdminImmobilityCenter";
import AdminFixityCenter from "./pages/admin/AdminFixityCenter";
import AdminStabilityCenter from "./pages/admin/AdminStabilityCenter";
import AdminSteadinessHub from "./pages/admin/AdminSteadinessHub";
import AdminConstancyCenter from "./pages/admin/AdminConstancyCenter";
import AdminUniformityCenter from "./pages/admin/AdminUniformityCenter";
import AdminRegularityCenter from "./pages/admin/AdminRegularityCenter";
import AdminOrderlinessCenter from "./pages/admin/AdminOrderlinessCenter";
import AdminMethodicalnessCenter from "./pages/admin/AdminMethodicalnessCenter";
import AdminSystematicnessCenter from "./pages/admin/AdminSystematicnessCenter";
import AdminOrganizationCenter from "./pages/admin/AdminOrganizationCenter";
import AdminArrangementHub from "./pages/admin/AdminArrangementHub";
import AdminCoordinationCenter from "./pages/admin/AdminCoordinationCenter";
import AdminSynchronizationCenter from "./pages/admin/AdminSynchronizationCenter";
import AdminHarmonizationCenter from "./pages/admin/AdminHarmonizationCenter";
import AdminIntegrationHub from "./pages/admin/AdminIntegrationHub";
import AdminUnificationCenter from "./pages/admin/AdminUnificationCenter";
import AdminConsolidationCenter from "./pages/admin/AdminConsolidationCenter";
import AdminCentralizationCenter from "./pages/admin/AdminCentralizationCenter";
import AdminConcentrationCenter from "./pages/admin/AdminConcentrationCenter";
import AdminFocusCenter from "./pages/admin/AdminFocusCenter";
import AdminAttentionCenter from "./pages/admin/AdminAttentionCenter";
import AdminAwarenessCenter from "./pages/admin/AdminAwarenessCenter";
import AdminConsciousnessCenter from "./pages/admin/AdminConsciousnessCenter";
import AdminMindfulnessCenter from "./pages/admin/AdminMindfulnessCenter";
import AdminThoughtfulnessCenter from "./pages/admin/AdminThoughtfulnessCenter";
import AdminConsiderationCenter from "./pages/admin/AdminConsiderationCenter";
import AdminReflectionCenter from "./pages/admin/AdminReflectionCenter";
import AdminContemplationCenter from "./pages/admin/AdminContemplationCenter";
import AdminMeditationCenter from "./pages/admin/AdminMeditationCenter";
import AdminIntrospectionCenter from "./pages/admin/AdminIntrospectionCenter";
import AdminSelfExaminationCenter from "./pages/admin/AdminSelfExaminationCenter";
import AdminSelfAnalysisCenter from "./pages/admin/AdminSelfAnalysisCenter";
import AdminSelfAssessmentCenter from "./pages/admin/AdminSelfAssessmentCenter";
import AdminSelfEvaluationCenter from "./pages/admin/AdminSelfEvaluationCenter";
import AdminSelfReflectionCenter from "./pages/admin/AdminSelfReflectionCenter";
import AdminSelfAwarenessCenter from "./pages/admin/AdminSelfAwarenessCenter";
import AdminSelfKnowledgeCenter from "./pages/admin/AdminSelfKnowledgeCenter";
import AdminSelfUnderstandingCenter from "./pages/admin/AdminSelfUnderstandingCenter";
import AdminSelfInsightCenter from "./pages/admin/AdminSelfInsightCenter";
import AdminSelfDiscoveryCenter from "./pages/admin/AdminSelfDiscoveryCenter";
import AdminSelfRealizationCenter from "./pages/admin/AdminSelfRealizationCenter";
import AdminSelfActualizationCenter from "./pages/admin/AdminSelfActualizationCenter";
import AdminSelfFulfillmentCenter from "./pages/admin/AdminSelfFulfillmentCenter";
import AdminSelfDevelopmentCenter from "./pages/admin/AdminSelfDevelopmentCenter";
import AdminSelfImprovementCenter from "./pages/admin/AdminSelfImprovementCenter";
import AdminSelfEnhancementCenter from "./pages/admin/AdminSelfEnhancementCenter";
import AdminSelfOptimizationCenter from "./pages/admin/AdminSelfOptimizationCenter";
import AdminSelfPerfectionCenter from "./pages/admin/AdminSelfPerfectionCenter";
import AdminSelfMasteryCenter from "./pages/admin/AdminSelfMasteryCenter";
import AdminSelfExcellenceCenter from "./pages/admin/AdminSelfExcellenceCenter";
import AdminSelfTransformationCenter from "./pages/admin/AdminSelfTransformationCenter";
import AdminSelfEvolutionCenter from "./pages/admin/AdminSelfEvolutionCenter";
import AdminSelfProgressCenter from "./pages/admin/AdminSelfProgressCenter";
import AdminSelfAdvancementCenter from "./pages/admin/AdminSelfAdvancementCenter";
import AdminSelfGrowthCenter from "./pages/admin/AdminSelfGrowthCenter";
import AdminSelfExpansionCenter from "./pages/admin/AdminSelfExpansionCenter";
import AdminSelfExtensionCenter from "./pages/admin/AdminSelfExtensionCenter";
import AdminSelfEnlargementCenter from "./pages/admin/AdminSelfEnlargementCenter";
import AdminSelfAmplificationCenter from "./pages/admin/AdminSelfAmplificationCenter";
import AdminSelfMagnificationCenter from "./pages/admin/AdminSelfMagnificationCenter";
import AdminSelfIntensificationCenter from "./pages/admin/AdminSelfIntensificationCenter";
import AdminSelfStrengtheningCenter from "./pages/admin/AdminSelfStrengtheningCenter";
import AdminSelfEmpowermentCenter from "./pages/admin/AdminSelfEmpowermentCenter";
import AdminSelfEnablementCenter from "./pages/admin/AdminSelfEnablementCenter";
import AdminSelfCapacitationCenter from "./pages/admin/AdminSelfCapacitationCenter";
import AdminSelfQualificationCenter from "./pages/admin/AdminSelfQualificationCenter";
import AdminSelfCertificationCenter from "./pages/admin/AdminSelfCertificationCenter";
import AdminSelfValidationCenter from "./pages/admin/AdminSelfValidationCenter";
import AdminSelfVerificationCenter from "./pages/admin/AdminSelfVerificationCenter";
import AdminSelfAuthenticationCenter from "./pages/admin/AdminSelfAuthenticationCenter";
import AdminSelfAuthorizationCenter from "./pages/admin/AdminSelfAuthorizationCenter";
import AdminSelfApprovalCenter from "./pages/admin/AdminSelfApprovalCenter";
import AdminSelfEndorsementCenter from "./pages/admin/AdminSelfEndorsementCenter";
import AdminSelfSanctionCenter from "./pages/admin/AdminSelfSanctionCenter";
import AdminSelfPermissionCenter from "./pages/admin/AdminSelfPermissionCenter";
import AdminSelfLicenseCenter from "./pages/admin/AdminSelfLicenseCenter";
import AdminSelfCredentialCenter from "./pages/admin/AdminSelfCredentialCenter";
import AdminSelfAccreditationCenter from "./pages/admin/AdminSelfAccreditationCenter";
import AdminSelfRecognitionCenter from "./pages/admin/AdminSelfRecognitionCenter";
import AdminSelfAcknowledgmentCenter from "./pages/admin/AdminSelfAcknowledgmentCenter";
import AdminSelfAppreciationCenter from "./pages/admin/AdminSelfAppreciationCenter";
import AdminSelfGratitudeCenter from "./pages/admin/AdminSelfGratitudeCenter";
import AdminSelfThankfulnessCenter from "./pages/admin/AdminSelfThankfulnessCenter";
import AdminSelfGratefulnessCenter from "./pages/admin/AdminSelfGratefulnessCenter";
import AdminSelfContentmentCenter from "./pages/admin/AdminSelfContentmentCenter";
import AdminSelfSatisfactionCenter from "./pages/admin/AdminSelfSatisfactionCenter";
import AdminSelfHappinessCenter from "./pages/admin/AdminSelfHappinessCenter";
import AdminSelfJoyCenter from "./pages/admin/AdminSelfJoyCenter";
import AdminSelfPleasureCenter from "./pages/admin/AdminSelfPleasureCenter";
import AdminSelfDelightCenter from "./pages/admin/AdminSelfDelightCenter";
import AdminSelfBlissCenter from "./pages/admin/AdminSelfBlissCenter";
import AdminSelfEcstasyCenter from "./pages/admin/AdminSelfEcstasyCenter";
import AdminSelfEuphoriaCenter from "./pages/admin/AdminSelfEuphoriaCenter";
import AdminSelfElationCenter from "./pages/admin/AdminSelfElationCenter";
import AdminSelfExhilarationCenter from "./pages/admin/AdminSelfExhilarationCenter";
import AdminSelfExcitementCenter from "./pages/admin/AdminSelfExcitementCenter";
import AdminSelfEnthusiasmCenter from "./pages/admin/AdminSelfEnthusiasmCenter";
import AdminSelfPassionCenter from "./pages/admin/AdminSelfPassionCenter";
import AdminSelfFervorCenter from "./pages/admin/AdminSelfFervorCenter";
import AdminSelfZealCenter from "./pages/admin/AdminSelfZealCenter";
import AdminSelfArdorCenter from "./pages/admin/AdminSelfArdorCenter";
import AdminSelfIntensityCenter from "./pages/admin/AdminSelfIntensityCenter";
import AdminSelfVehemenceCenter from "./pages/admin/AdminSelfVehemenceCenter";
import AdminSelfVigorCenter from "./pages/admin/AdminSelfVigorCenter";
import AdminSelfVitalityCenter from "./pages/admin/AdminSelfVitalityCenter";
import AdminSelfEnergyCenter from "./pages/admin/AdminSelfEnergyCenter";
import AdminSelfDynamismCenter from "./pages/admin/AdminSelfDynamismCenter";
import AdminSelfForceCenter from "./pages/admin/AdminSelfForceCenter";
import AdminSelfPowerCenter from "./pages/admin/AdminSelfPowerCenter";
import AdminSelfMightCenter from "./pages/admin/AdminSelfMightCenter";
import AdminSelfStrengthCenter from "./pages/admin/AdminSelfStrengthCenter";
import AdminSelfPotencyCenter from "./pages/admin/AdminSelfPotencyCenter";
import AdminSelfCapabilityCenter from "./pages/admin/AdminSelfCapabilityCenter";
import AdminSelfCompetenceCenter from "./pages/admin/AdminSelfCompetenceCenter";
import AdminSelfProficiencyCenter from "./pages/admin/AdminSelfProficiencyCenter";
import AdminSelfSkillCenter from "./pages/admin/AdminSelfSkillCenter";
import AdminSelfExpertiseCenter from "./pages/admin/AdminSelfExpertiseCenter";
import AdminSelfMasteryCenter from "./pages/admin/AdminSelfMasteryCenter";
import AdminSelfVirtuosityCenter from "./pages/admin/AdminSelfVirtuosityCenter";
import AdminSelfArtistryCenter from "./pages/admin/AdminSelfArtistryCenter";
import AdminSelfCraftsmanshipCenter from "./pages/admin/AdminSelfCraftsmanshipCenter";
import AdminSelfWorkmanshipCenter from "./pages/admin/AdminSelfWorkmanshipCenter";
import AdminSelfTechniqueCenter from "./pages/admin/AdminSelfTechniqueCenter";
import AdminSelfMethodCenter from "./pages/admin/AdminSelfMethodCenter";
import AdminSelfApproachCenter from "./pages/admin/AdminSelfApproachCenter";
import AdminSelfStrategyCenter from "./pages/admin/AdminSelfStrategyCenter";
import AdminSelfTacticCenter from "./pages/admin/AdminSelfTacticCenter";
import AdminSelfPlanCenter from "./pages/admin/AdminSelfPlanCenter";
import AdminSelfSchemeCenter from "./pages/admin/AdminSelfSchemeCenter";
import AdminSelfDesignCenter from "./pages/admin/AdminSelfDesignCenter";
import AdminSelfBlueprint from "./pages/admin/AdminSelfBlueprint";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthContextProvider>
            <LanguageProvider>
              <RouteAwareThemeProvider>
                <CallNotificationProvider>
                  <TooltipProvider>
                    <SmoothScroll />
                    <PushNotificationManager />
                    
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/landing" element={<Landing />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/supplier-dashboard" element={<ProcurementSupplierDashboard />} />
                      <Route path="/requests" element={<Requests />} />
                      <Route path="/suppliers" element={<Suppliers />} />
                      <Route path="/my-offers" element={<MyOffers />} />
                      <Route path="/browse-requests" element={<BrowseRequests />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/conversations" element={<Conversations />} />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/projects/:id" element={<ProjectDetails />} />
                      <Route path="/expert-consultation" element={<ExpertConsultation />} />
                      <Route path="/admin/categories" element={<AdminCategoryManagement />} />
                      <Route path="/admin/users" element={<AdminUserManagement />} />
                      <Route path="/admin/requests" element={<AdminRequestManagement />} />
                      <Route path="/admin/offers" element={<AdminOfferManagement />} />
                      <Route path="/admin/analytics" element={<AdminAnalytics />} />
                      <Route path="/admin/settings" element={<AdminSettings />} />
                      <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
                      <Route path="/admin/financial" element={<AdminFinancialManagement />} />
                      <Route path="/admin/consultations" element={<AdminConsultationManagement />} />
                      <Route path="/admin/system-health" element={<AdminSystemHealth />} />
                      <Route path="/admin/reports" element={<AdminReports />} />
                      <Route path="/admin/support" element={<AdminSupport />} />
                      <Route path="/admin/notifications" element={<AdminNotifications />} />
                      <Route path="/admin/backup" element={<AdminBackup />} />
                      <Route path="/admin/integrations" element={<AdminIntegrations />} />
                      <Route path="/admin/api" element={<AdminAPIManagement />} />
                      <Route path="/admin/security" element={<AdminSecurityCenter />} />
                      <Route path="/admin/content" element={<AdminContentManagement />} />
                      <Route path="/admin/workflows" element={<AdminWorkflowManagement />} />
                      <Route path="/admin/compliance" element={<AdminComplianceCenter />} />
                      <Route path="/admin/performance" element={<AdminPerformanceMonitoring />} />
                      <Route path="/admin/resources" element={<AdminResourceManagement />} />
                      <Route path="/admin/events" element={<AdminEventManagement />} />
                      <Route path="/admin/vendors" element={<AdminVendorManagement />} />
                      <Route path="/admin/clients" element={<AdminClientManagement />} />
                      <Route path="/admin/subscriptions" element={<AdminSubscriptionManagement />} />
                      <Route path="/admin/payments" element={<AdminPaymentManagement />} />
                      <Route path="/admin/taxes" element={<AdminTaxManagement />} />
                      <Route path="/admin/invoices" element={<AdminInvoiceManagement />} />
                      <Route path="/admin/contracts" element={<AdminContractManagement />} />
                      <Route path="/admin/documents" element={<AdminDocumentManagement />} />
                      <Route path="/admin/templates" element={<AdminTemplateManagement />} />
                      <Route path="/admin/email" element={<AdminEmailManagement />} />
                      <Route path="/admin/sms" element={<AdminSMSManagement />} />
                      <Route path="/admin/push-notifications" element={<AdminPushNotificationManagement />} />
                      <Route path="/admin/communications" element={<AdminCommunicationCenter />} />
                      <Route path="/admin/marketing" element={<AdminMarketingCenter />} />
                      <Route path="/admin/campaigns" element={<AdminCampaignManagement />} />
                      <Route path="/admin/leads" element={<AdminLeadManagement />} />
                      <Route path="/admin/customer-support" element={<AdminCustomerSupport />} />
                      <Route path="/admin/tickets" element={<AdminTicketManagement />} />
                      <Route path="/admin/knowledge-base" element={<AdminKnowledgeBase />} />
                      <Route path="/admin/faq" element={<AdminFAQManagement />} />
                      <Route path="/admin/training" element={<AdminTrainingCenter />} />
                      <Route path="/admin/certifications" element={<AdminCertificationManagement />} />
                      <Route path="/admin/skill-assessment" element={<AdminSkillAssessment />} />
                      <Route path="/admin/quality-assurance" element={<AdminQualityAssurance />} />
                      <Route path="/admin/risk-management" element={<AdminRiskManagement />} />
                      <Route path="/admin/insurance" element={<AdminInsuranceManagement />} />
                      <Route path="/admin/legal" element={<AdminLegalCenter />} />
                      <Route path="/admin/dispute-resolution" element={<AdminDisputeResolution />} />
                      <Route path="/admin/arbitration" element={<AdminArbitrationCenter />} />
                      <Route path="/admin/mediation" element={<AdminMediationCenter />} />
                      <Route path="/admin/escrow" element={<AdminEscrowManagement />} />
                      <Route path="/admin/trust" element={<AdminTrustCenter />} />
                      <Route path="/admin/reputation" element={<AdminReputationManagement />} />
                      <Route path="/admin/ratings" element={<AdminRatingSystem />} />
                      <Route path="/admin/reviews" element={<AdminReviewManagement />} />
                      <Route path="/admin/feedback" element={<AdminFeedbackCenter />} />
                      <Route path="/admin/surveys" element={<AdminSurveyManagement />} />
                      <Route path="/admin/polls" element={<AdminPollManagement />} />
                      <Route path="/admin/voting" element={<AdminVotingSystem />} />
                      <Route path="/admin/governance" element={<AdminGovernanceCenter />} />
                      <Route path="/admin/policies" element={<AdminPolicyManagement />} />
                      <Route path="/admin/procedures" element={<AdminProcedureManagement />} />
                      <Route path="/admin/guidelines" element={<AdminGuidelineManagement />} />
                      <Route path="/admin/standards" element={<AdminStandardManagement />} />
                      <Route path="/admin/best-practices" element={<AdminBestPractices />} />
                      <Route path="/admin/innovation" element={<AdminInnovationCenter />} />
                      <Route path="/admin/research" element={<AdminResearchCenter />} />
                      <Route path="/admin/development" element={<AdminDevelopmentCenter />} />
                      <Route path="/admin/testing" element={<AdminTestingCenter />} />
                      <Route path="/admin/deployment" element={<AdminDeploymentCenter />} />
                      <Route path="/admin/maintenance" element={<AdminMaintenanceCenter />} />
                      <Route path="/admin/updates" element={<AdminUpdateCenter />} />
                      <Route path="/admin/version-control" element={<AdminVersionControl />} />
                      <Route path="/admin/change-management" element={<AdminChangeManagement />} />
                      <Route path="/admin/configuration" element={<AdminConfigurationManagement />} />
                      <Route path="/admin/environments" element={<AdminEnvironmentManagement />} />
                      <Route path="/admin/infrastructure" element={<AdminInfrastructureManagement />} />
                      <Route path="/admin/cloud" element={<AdminCloudManagement />} />
                      <Route path="/admin/servers" element={<AdminServerManagement />} />
                      <Route path="/admin/databases" element={<AdminDatabaseManagement />} />
                      <Route path="/admin/networks" element={<AdminNetworkManagement />} />
                      <Route path="/admin/security-management" element={<AdminSecurityManagement />} />
                      <Route path="/admin/access-control" element={<AdminAccessControl />} />
                      <Route path="/admin/permissions" element={<AdminPermissionManagement />} />
                      <Route path="/admin/roles" element={<AdminRoleManagement />} />
                      <Route path="/admin/groups" element={<AdminGroupManagement />} />
                      <Route path="/admin/teams" element={<AdminTeamManagement />} />
                      <Route path="/admin/departments" element={<AdminDepartmentManagement />} />
                      <Route path="/admin/organizations" element={<AdminOrganizationManagement />} />
                      <Route path="/admin/hierarchy" element={<AdminHierarchyManagement />} />
                      <Route path="/admin/structure" element={<AdminStructureManagement />} />
                      <Route path="/admin/workflow-designer" element={<AdminWorkflowDesigner />} />
                      <Route path="/admin/processes" element={<AdminProcessManagement />} />
                      <Route path="/admin/automation" element={<AdminAutomationCenter />} />
                      <Route path="/admin/scheduler" element={<AdminSchedulerManagement />} />
                      <Route path="/admin/jobs" element={<AdminJobManagement />} />
                      <Route path="/admin/tasks" element={<AdminTaskManagement />} />
                      <Route path="/admin/projects" element={<AdminProjectManagement />} />
                      <Route path="/admin/portfolios" element={<AdminPortfolioManagement />} />
                      <Route path="/admin/programs" element={<AdminProgramManagement />} />
                      <Route path="/admin/initiatives" element={<AdminInitiativeManagement />} />
                      <Route path="/admin/strategy" element={<AdminStrategyManagement />} />
                      <Route path="/admin/planning" element={<AdminPlanningCenter />} />
                      <Route path="/admin/forecasting" element={<AdminForecastingCenter />} />
                      <Route path="/admin/budgeting" element={<AdminBudgetingCenter />} />
                      <Route path="/admin/cost-management" element={<AdminCostManagement />} />
                      <Route path="/admin/revenue-management" element={<AdminRevenueManagement />} />
                      <Route path="/admin/profit-management" element={<AdminProfitManagement />} />
                      <Route path="/admin/loss-management" element={<AdminLossManagement />} />
                      <Route path="/admin/asset-management" element={<AdminAssetManagement />} />
                      <Route path="/admin/liability-management" element={<AdminLiabilityManagement />} />
                      <Route path="/admin/equity-management" element={<AdminEquityManagement />} />
                      <Route path="/admin/cash-flow" element={<AdminCashFlowManagement />} />
                      <Route path="/admin/treasury" element={<AdminTreasuryManagement />} />
                      <Route path="/admin/investments" element={<AdminInvestmentManagement />} />
                      <Route path="/admin/funding" element={<AdminFundingManagement />} />
                      <Route path="/admin/grants" element={<AdminGrantManagement />} />
                      <Route path="/admin/donations" element={<AdminDonationManagement />} />
                      <Route path="/admin/sponsorships" element={<AdminSponsorshipManagement />} />
                      <Route path="/admin/partnerships" element={<AdminPartnershipManagement />} />
                      <Route path="/admin/alliances" element={<AdminAllianceManagement />} />
                      <Route path="/admin/networking" element={<AdminNetworkingCenter />} />
                      <Route path="/admin/community" element={<AdminCommunityManagement />} />
                      <Route path="/admin/forums" element={<AdminForumManagement />} />
                      <Route path="/admin/discussions" element={<AdminDiscussionManagement />} />
                      <Route path="/admin/chat" element={<AdminChatManagement />} />
                      <Route path="/admin/messaging" element={<AdminMessagingCenter />} />
                      <Route path="/admin/video-conferencing" element={<AdminVideoConferencing />} />
                      <Route path="/admin/webinars" element={<AdminWebinarManagement />} />
                      <Route path="/admin/streaming" element={<AdminEventStreaming />} />
                      <Route path="/admin/broadcast" element={<AdminBroadcastCenter />} />
                      <Route path="/admin/announcements" element={<AdminAnnouncementCenter />} />
                      <Route path="/admin/news" element={<AdminNewsCenter />} />
                      <Route path="/admin/blog" element={<AdminBlogManagement />} />
                      <Route path="/admin/articles" element={<AdminArticleManagement />} />
                      <Route path="/admin/publications" element={<AdminPublicationCenter />} />
                      <Route path="/admin/library" element={<AdminLibraryManagement />} />
                      <Route path="/admin/archive" element={<AdminArchiveManagement />} />
                      <Route path="/admin/history" element={<AdminHistoryCenter />} />
                      <Route path="/admin/timeline" element={<AdminTimelineManagement />} />
                      <Route path="/admin/milestones" element={<AdminMilestoneManagement />} />
                      <Route path="/admin/achievements" element={<AdminAchievementCenter />} />
                      <Route path="/admin/awards" element={<AdminAwardManagement />} />
                      <Route path="/admin/recognition" element={<AdminRecognitionCenter />} />
                      <Route path="/admin/badges" element={<AdminBadgeManagement />} />
                      <Route path="/admin/points" element={<AdminPointSystem />} />
                      <Route path="/admin/loyalty" element={<AdminLoyaltyProgram />} />
                      <Route path="/admin/rewards" element={<AdminRewardManagement />} />
                      <Route path="/admin/incentives" element={<AdminIncentiveManagement />} />
                      <Route path="/admin/promotions" element={<AdminPromotionCenter />} />
                      <Route path="/admin/discounts" element={<AdminDiscountManagement />} />
                      <Route path="/admin/coupons" element={<AdminCouponManagement />} />
                      <Route path="/admin/vouchers" element={<AdminVoucherManagement />} />
                      <Route path="/admin/gift-cards" element={<AdminGiftCardManagement />} />
                      <Route path="/admin/credits" element={<AdminCreditManagement />} />
                      <Route path="/admin/wallets" element={<AdminWalletManagement />} />
                      <Route path="/admin/balances" element={<AdminBalanceManagement />} />
                      <Route path="/admin/transactions" element={<AdminTransactionCenter />} />
                      <Route path="/admin/payment-gateway" element={<AdminPaymentGateway />} />
                      <Route path="/admin/billing" element={<AdminBillingCenter />} />
                      <Route path="/admin/invoicing" element={<AdminInvoicingCenter />} />
                      <Route path="/admin/receipts" element={<AdminReceiptManagement />} />
                      <Route path="/admin/refunds" element={<AdminRefundCenter />} />
                      <Route path="/admin/chargebacks" element={<AdminChargebackManagement />} />
                      <Route path="/admin/disputes" element={<AdminDisputeCenter />} />
                      <Route path="/admin/fraud-detection" element={<AdminFraudDetection />} />
                      <Route path="/admin/risk-assessment" element={<AdminRiskAssessment />} />
                      <Route path="/admin/compliance-monitoring" element={<AdminComplianceMonitoring />} />
                      <Route path="/admin/audit-trail" element={<AdminAuditTrail />} />
                      <Route path="/admin/forensics" element={<AdminForensicsCenter />} />
                      <Route path="/admin/incidents" element={<AdminIncidentManagement />} />
                      <Route path="/admin/emergency-response" element={<AdminEmergencyResponse />} />
                      <Route path="/admin/crisis-management" element={<AdminCrisisManagement />} />
                      <Route path="/admin/disaster-recovery" element={<AdminDisasterRecovery />} />
                      <Route path="/admin/business-continuity" element={<AdminBusinessContinuity />} />
                      <Route path="/admin/backup-strategy" element={<AdminBackupStrategy />} />
                      <Route path="/admin/recovery-planning" element={<AdminRecoveryPlanning />} />
                      <Route path="/admin/testing-strategy" element={<AdminTestingStrategy />} />
                      <Route path="/admin/validation" element={<AdminValidationCenter />} />
                      <Route path="/admin/verification" element={<AdminVerificationCenter />} />
                      <Route path="/admin/certification" element={<AdminCertificationCenter />} />
                      <Route path="/admin/accreditation" element={<AdminAccreditationCenter />} />
                      <Route path="/admin/licensing" element={<AdminLicensingCenter />} />
                      <Route path="/admin/permits" element={<AdminPermitManagement />} />
                      <Route path="/admin/approvals" element={<AdminApprovalCenter />} />
                      <Route path="/admin/authorization" element={<AdminAuthorizationCenter />} />
                      <Route path="/admin/endorsements" element={<AdminEndorsementCenter />} />
                      <Route path="/admin/recommendations" element={<AdminRecommendationCenter />} />
                      <Route path="/admin/referrals" element={<AdminReferralManagement />} />
                      <Route path="/admin/affiliates" element={<AdminAffiliateManagement />} />
                      <Route path="/admin/influencers" element={<AdminInfluencerManagement />} />
                      <Route path="/admin/ambassadors" element={<AdminAmbassadorProgram />} />
                      <Route path="/admin/advocacy" element={<AdminAdvocacyCenter />} />
                      <Route path="/admin/testimonials" element={<AdminTestimonialCenter />} />
                      <Route path="/admin/case-studies" element={<AdminCaseStudyManagement />} />
                      <Route path="/admin/success-stories" element={<AdminSuccessStoryCenter />} />
                      <Route path="/admin/portfolio" element={<AdminPortfolioCenter />} />
                      <Route path="/admin/showcase" element={<AdminShowcaseManagement />} />
                      <Route path="/admin/gallery" element={<AdminGalleryManagement />} />
                      <Route path="/admin/media" element={<AdminMediaCenter />} />
                      <Route path="/admin/assets" element={<AdminAssetLibrary />} />
                      <Route path="/admin/resource-center" element={<AdminResourceCenter />} />
                      <Route path="/admin/tools" element={<AdminToolManagement />} />
                      <Route path="/admin/utilities" element={<AdminUtilityCenter />} />
                      <Route path="/admin/helpers" element={<AdminHelperManagement />} />
                      <Route path="/admin/assistants" element={<AdminAssistantCenter />} />
                      <Route path="/admin/bots" element={<AdminBotManagement />} />
                      <Route path="/admin/ai" element={<AdminAICenter />} />
                      <Route path="/admin/ml" element={<AdminMLManagement />} />
                      <Route path="/admin/data-science" element={<AdminDataScience />} />
                      <Route path="/admin/analytics-engine" element={<AdminAnalyticsEngine />} />
                      <Route path="/admin/insights" element={<AdminInsightsCenter />} />
                      <Route path="/admin/intelligence" element={<AdminIntelligenceCenter />} />
                      <Route path="/admin/predictive-analytics" element={<AdminPredictiveAnalytics />} />
                      <Route path="/admin/forecasting-engine" element={<AdminForecastingEngine />} />
                      <Route path="/admin/trend-analysis" element={<AdminTrendAnalysis />} />
                      <Route path="/admin/pattern-recognition" element={<AdminPatternRecognition />} />
                      <Route path="/admin/anomaly-detection" element={<AdminAnomalyDetection />} />
                      <Route path="/admin/outlier-analysis" element={<AdminOutlierAnalysis />} />
                      <Route path="/admin/statistical-analysis" element={<AdminStatisticalAnalysis />} />
                      <Route path="/admin/data-mining" element={<AdminDataMining />} />
                      <Route path="/admin/data-warehouse" element={<AdminDataWarehouse />} />
                      <Route path="/admin/data-lake" element={<AdminDataLake />} />
                      <Route path="/admin/big-data" element={<AdminBigDataManagement />} />
                      <Route path="/admin/cloud-data" element={<AdminCloudDataManagement />} />
                      <Route path="/admin/data-governance" element={<AdminDataGovernance />} />
                      <Route path="/admin/data-quality" element={<AdminDataQuality />} />
                      <Route path="/admin/data-integrity" element={<AdminDataIntegrity />} />
                      <Route path="/admin/data-security" element={<AdminDataSecurity />} />
                      <Route path="/admin/data-privacy" element={<AdminDataPrivacy />} />
                      <Route path="/admin/data-protection" element={<AdminDataProtection />} />
                      <Route path="/admin/data-retention" element={<AdminDataRetention />} />
                      <Route path="/admin/data-archival" element={<AdminDataArchival />} />
                      <Route path="/admin/data-purging" element={<AdminDataPurging />} />
                      <Route path="/admin/data-migration" element={<AdminDataMigration />} />
                      <Route path="/admin/data-transformation" element={<AdminDataTransformation />} />
                      <Route path="/admin/data-cleansing" element={<AdminDataCleansing />} />
                      <Route path="/admin/data-validation" element={<AdminDataValidation />} />
                      <Route path="/admin/data-enrichment" element={<AdminDataEnrichment />} />
                      <Route path="/admin/data-standardization" element={<AdminDataStandardization />} />
                      <Route path="/admin/data-normalization" element={<AdminDataNormalization />} />
                      <Route path="/admin/data-optimization" element={<AdminDataOptimization />} />
                      <Route path="/admin/performance-optimization" element={<AdminPerformanceOptimization />} />
                      <Route path="/admin/scalability" element={<AdminScalabilityManagement />} />
                      <Route path="/admin/capacity-planning" element={<AdminCapacityPlanning />} />
                      <Route path="/admin/load-balancing" element={<AdminLoadBalancing />} />
                      <Route path="/admin/traffic-management" element={<AdminTrafficManagement />} />
                      <Route path="/admin/bandwidth" element={<AdminBandwidthManagement />} />
                      <Route path="/admin/latency-optimization" element={<AdminLatencyOptimization />} />
                      <Route path="/admin/throughput-optimization" element={<AdminThroughputOptimization />} />
                      <Route path="/admin/response-time-optimization" element={<AdminResponseTimeOptimization />} />
                      <Route path="/admin/availability" element={<AdminAvailabilityManagement />} />
                      <Route path="/admin/reliability" element={<AdminReliabilityManagement />} />
                      <Route path="/admin/stability" element={<AdminStabilityManagement />} />
                      <Route path="/admin/robustness" element={<AdminRobustnessManagement />} />
                      <Route path="/admin/resilience" element={<AdminResilienceManagement />} />
                      <Route path="/admin/fault-tolerance" element={<AdminFaultTolerance />} />
                      <Route path="/admin/error-handling" element={<AdminErrorHandling />} />
                      <Route path="/admin/exception-management" element={<AdminExceptionManagement />} />
                      <Route path="/admin/logging" element={<AdminLoggingCenter />} />
                      <Route path="/admin/monitoring" element={<AdminMonitoringCenter />} />
                      <Route path="/admin/alerting" element={<AdminAlertingCenter />} />
                      <Route path="/admin/notification-engine" element={<AdminNotificationEngine />} />
                      <Route path="/admin/escalation" element={<AdminEscalationManagement />} />
                      <Route path="/admin/incident-response" element={<AdminIncidentResponse />} />
                      <Route path="/admin/problem-management" element={<AdminProblemManagement />} />
                      <Route path="/admin/change-control" element={<AdminChangeControl />} />
                      <Route path="/admin/release-management" element={<AdminReleaseManagement />} />
                      <Route path="/admin/deployment-management" element={<AdminDeploymentManagement />} />
                      <Route path="/admin/configuration-control" element={<AdminConfigurationControl />} />
                      <Route path="/admin/asset-tracking" element={<AdminAssetTracking />} />
                      <Route path="/admin/inventory" element={<AdminInventoryManagement />} />
                      <Route path="/admin/stock" element={<AdminStockManagement />} />
                      <Route path="/admin/warehouse" element={<AdminWarehouseManagement />} />
                      <Route path="/admin/supply-chain" element={<AdminSupplyChainManagement />} />
                      <Route path="/admin/logistics" element={<AdminLogisticsManagement />} />
                      <Route path="/admin/distribution" element={<AdminDistributionManagement />} />
                      <Route path="/admin/fulfillment" element={<AdminFulfillmentCenter />} />
                      <Route path="/admin/shipping" element={<AdminShippingManagement />} />
                      <Route path="/admin/delivery" element={<AdminDeliveryManagement />} />
                      <Route path="/admin/tracking" element={<AdminTrackingCenter />} />
                      <Route path="/admin/orders" element={<AdminOrderManagement />} />
                      <Route path="/admin/purchases" element={<AdminPurchaseManagement />} />
                      <Route path="/admin/procurement" element={<AdminProcurementCenter />} />
                      <Route path="/admin/sourcing" element={<AdminSourcingManagement />} />
                      <Route path="/admin/vendor-portal" element={<AdminVendorPortal />} />
                      <Route path="/admin/supplier-portal" element={<AdminSupplierPortal />} />
                      <Route path="/admin/partner-portal" element={<AdminPartnerPortal />} />
                      <Route path="/admin/client-portal" element={<AdminClientPortal />} />
                      <Route path="/admin/customer-portal" element={<AdminCustomerPortal />} />
                      <Route path="/admin/user-portal" element={<AdminUserPortal />} />
                      <Route path="/admin/member-portal" element={<AdminMemberPortal />} />
                      <Route path="/admin/subscriber-portal" element={<AdminSubscriberPortal />} />
                      <Route path="/admin/guest-portal" element={<AdminGuestPortal />} />
                      <Route path="/admin/visitor-center" element={<AdminVisitorCenter />} />
                      <Route path="/admin/welcome-center" element={<AdminWelcomeCenter />} />
                      <Route path="/admin/onboarding" element={<AdminOnboardingCenter />} />
                      <Route path="/admin/orientation" element={<AdminOrientationCenter />} />
                      <Route path="/admin/introduction" element={<AdminIntroductionCenter />} />
                      <Route path="/admin/tutorials" element={<AdminTutorialCenter />} />
                      <Route path="/admin/guides" element={<AdminGuideCenter />} />
                      <Route path="/admin/help" element={<AdminHelpCenter />} />
                      <Route path="/admin/support" element={<AdminSupportCenter />} />
                      <Route path="/admin/service" element={<AdminServiceCenter />} />
                      <Route path="/admin/assistance" element={<AdminAssistanceCenter />} />
                      <Route path="/admin/guidance" element={<AdminGuidanceCenter />} />
                      <Route path="/admin/consulting" element={<AdminConsultingCenter />} />
                      <Route path="/admin/advisory" element={<AdminAdvisoryCenter />} />
                      <Route path="/admin/mentoring" element={<AdminMentoringCenter />} />
                      <Route path="/admin/coaching" element={<AdminCoachingCenter />} />
                      <Route path="/admin/training-management" element={<AdminTrainingManagement />} />
                      <Route path="/admin/education" element={<AdminEducationCenter />} />
                      <Route path="/admin/learning" element={<AdminLearningCenter />} />
                      <Route path="/admin/development" element={<AdminDevelopmentCenter />} />
                      <Route path="/admin/growth" element={<AdminGrowthCenter />} />
                      <Route path="/admin/improvement" element={<AdminImprovementCenter />} />
                      <Route path="/admin/enhancement" element={<AdminEnhancementCenter />} />
                      <Route path="/admin/optimization" element={<AdminOptimizationCenter />} />
                      <Route path="/admin/efficiency" element={<AdminEfficiencyCenter />} />
                      <Route path="/admin/productivity" element={<AdminProductivityCenter />} />
                      <Route path="/admin/quality" element={<AdminQualityCenter />} />
                      <Route path="/admin/excellence" element={<AdminExcellenceCenter />} />
                      <Route path="/admin/innovation-hub" element={<AdminInnovationHub />} />
                      <Route path="/admin/creativity" element={<AdminCreativityCenter />} />
                      <Route path="/admin/ideation" element={<AdminIdeationCenter />} />
                      <Route path="/admin/brainstorming" element={<AdminBrainstormingCenter />} />
                      <Route path="/admin/collaboration" element={<AdminCollaborationCenter />} />
                      <Route path="/admin/teamwork" element={<AdminTeamworkCenter />} />
                      <Route path="/admin/partnership" element={<AdminPartnershipCenter />} />
                      <Route path="/admin/alliance" element={<AdminAllianceCenter />} />
                      <Route path="/admin/network" element={<AdminNetworkCenter />} />
                      <Route path="/admin/ecosystem" element={<AdminEcosystemManagement />} />
                      <Route path="/admin/platform" element={<AdminPlatformManagement />} />
                      <Route path="/admin/marketplace" element={<AdminMarketplaceManagement />} />
                      <Route path="/admin/exchange" element={<AdminExchangeManagement />} />
                      <Route path="/admin/trading" element={<AdminTradingCenter />} />
                      <Route path="/admin/commerce" element={<AdminCommercePlatform />} />
                      <Route path="/admin/business" element={<AdminBusinessCenter />} />
                      <Route path="/admin/enterprise" element={<AdminEnterpriseCenter />} />
                      <Route path="/admin/corporate" element={<AdminCorporateCenter />} />
                      <Route path="/admin/organizational" element={<AdminOrganizationalCenter />} />
                      <Route path="/admin/institutional" element={<AdminInstitutionalCenter />} />
                      <Route path="/admin/governmental" element={<AdminGovernmentalCenter />} />
                      <Route path="/admin/public-sector" element={<AdminPublicSectorCenter />} />
                      <Route path="/admin/private-sector" element={<AdminPrivateSectorCenter />} />
                      <Route path="/admin/non-profit" element={<AdminNonProfitCenter />} />
                      <Route path="/admin/charity" element={<AdminCharityCenter />} />
                      <Route path="/admin/foundation" element={<AdminFoundationCenter />} />
                      <Route path="/admin/trust-center" element={<AdminTrustCenter />} />
                      <Route path="/admin/endowment" element={<AdminEndowmentCenter />} />
                      <Route path="/admin/scholarship" element={<AdminScholarshipCenter />} />
                      <Route path="/admin/grant" element={<AdminGrantCenter />} />
                      <Route path="/admin/funding-center" element={<AdminFundingCenter />} />
                      <Route path="/admin/investment-center" element={<AdminInvestmentCenter />} />
                      <Route path="/admin/capital" element={<AdminCapitalCenter />} />
                      <Route path="/admin/finance" element={<AdminFinanceCenter />} />
                      <Route path="/admin/banking" element={<AdminBankingCenter />} />
                      <Route path="/admin/insurance-center" element={<AdminInsuranceCenter />} />
                      <Route path="/admin/real-estate" element={<AdminRealEstateCenter />} />
                      <Route path="/admin/property" element={<AdminPropertyManagement />} />
                      <Route path="/admin/facility" element={<AdminFacilityManagement />} />
                      <Route path="/admin/maintenance-management" element={<AdminMaintenanceManagement />} />
                      <Route path="/admin/operations" element={<AdminOperationsCenter />} />
                      <Route path="/admin/production" element={<AdminProductionCenter />} />
                      <Route path="/admin/manufacturing" element={<AdminManufacturingCenter />} />
                      <Route path="/admin/assembly" element={<AdminAssemblyCenter />} />
                      <Route path="/admin/processing" element={<AdminProcessingCenter />} />
                      <Route path="/admin/refinement" element={<AdminRefinementCenter />} />
                      <Route path="/admin/transformation" element={<AdminTransformationCenter />} />
                      <Route path="/admin/conversion" element={<AdminConversionCenter />} />
                      <Route path="/admin/adaptation" element={<AdminAdaptationCenter />} />
                      <Route path="/admin/customization" element={<AdminCustomizationCenter />} />
                      <Route path="/admin/personalization" element={<AdminPersonalizationCenter />} />
                      <Route path="/admin/individualization" element={<AdminIndividualizationCenter />} />
                      <Route path="/admin/specialization" element={<AdminSpecializationCenter />} />
                      <Route path="/admin/expertise" element={<AdminExpertiseCenter />} />
                      <Route path="/admin/proficiency" element={<AdminProficiencyCenter />} />
                      <Route path="/admin/mastery" element={<AdminMasteryCenter />} />
                      <Route path="/admin/competency" element={<AdminCompetencyCenter />} />
                      <Route path="/admin/capability" element={<AdminCapabilityCenter />} />
                      <Route path="/admin/skill" element={<AdminSkillCenter />} />
                      <Route path="/admin/talent" element={<AdminTalentCenter />} />
                      <Route path="/admin/ability" element={<AdminAbilityCenter />} />
                      <Route path="/admin/potential" element={<AdminPotentialCenter />} />
                      <Route path="/admin/opportunity" element={<AdminOpportunityCenter />} />
                      <Route path="/admin/possibility" element={<AdminPossibilityCenter />} />
                      <Route path="/admin/prospect" element={<AdminProspectCenter />} />
                      <Route path="/admin/future" element={<AdminFutureCenter />} />
                      <Route path="/admin/vision" element={<AdminVisionCenter />} />
                      <Route path="/admin/mission" element={<AdminMissionCenter />} />
                      <Route path="/admin/purpose" element={<AdminPurposeCenter />} />
                      <Route path="/admin/goal" element={<AdminGoalCenter />} />
                      <Route path="/admin/objective" element={<AdminObjectiveCenter />} />
                      <Route path="/admin/target" element={<AdminTargetCenter />} />
                      <Route path="/admin/aim" element={<AdminAimCenter />} />
                      <Route path="/admin/intention" element={<AdminIntentionCenter />} />
                      <Route path="/admin/ambition" element={<AdminAmbitionCenter />} />
                      <Route path="/admin/aspiration" element={<AdminAspirationCenter />} />
                      <Route path="/admin/dream" element={<AdminDreamCenter />} />
                      <Route path="/admin/hope" element={<AdminHopeCenter />} />
                      <Route path="/admin/wish" element={<AdminWishCenter />} />
                      <Route path="/admin/desire" element={<AdminDesireCenter />} />
                      <Route path="/admin/want" element={<AdminWantCenter />} />
                      <Route path="/admin/need" element={<AdminNeedCenter />} />
                      <Route path="/admin/requirement" element={<AdminRequirementCenter />} />
                      <Route path="/admin/demand" element={<AdminDemandCenter />} />
                      <Route path="/admin/request" element={<AdminRequestCenter />} />
                      <Route path="/admin/order" element={<AdminOrderCenter />} />
                      <Route path="/admin/command" element={<AdminCommandCenter />} />
                      <Route path="/admin/control" element={<AdminControlCenter />} />
                      <Route path="/admin/management" element={<AdminManagementCenter />} />
                      <Route path="/admin/administration" element={<AdminAdministrationCenter />} />
                      <Route path="/admin/governance-hub" element={<AdminGovernanceHub />} />
                      <Route path="/admin/leadership" element={<AdminLeadershipCenter />} />
                      <Route path="/admin/direction" element={<AdminDirectionCenter />} />
                      <Route path="/admin/guidance-hub" element={<AdminGuidanceHub />} />
                      <Route path="/admin/supervision" element={<AdminSupervisionCenter />} />
                      <Route path="/admin/oversight" element={<AdminOversightCenter />} />
                      <Route path="/admin/monitoring-hub" element={<AdminMonitoringHub />} />
                      <Route path="/admin/surveillance" element={<AdminSurveillanceCenter />} />
                      <Route path="/admin/observation" element={<AdminObservationCenter />} />
                      <Route path="/admin/watch" element={<AdminWatchCenter />} />
                      <Route path="/admin/guard" element={<AdminGuardCenter />} />
                      <Route path="/admin/protection" element={<AdminProtectionCenter />} />
                      <Route path="/admin/security-hub" element={<AdminSecurityHub />} />
                      <Route path="/admin/safety" element={<AdminSafetyCenter />} />
                      <Route path="/admin/wellness" element={<AdminWellnessCenter />} />
                      <Route path="/admin/health" element={<AdminHealthCenter />} />
                      <Route path="/admin/fitness" element={<AdminFitnessCenter />} />
                      <Route path="/admin/vitality" element={<AdminVitalityCenter />} />
                      <Route path="/admin/energy" element={<AdminEnergyCenter />} />
                      <Route path="/admin/power" element={<AdminPowerCenter />} />
                      <Route path="/admin/strength" element={<AdminStrengthCenter />} />
                      <Route path="/admin/force" element={<AdminForceCenter />} />
                      <Route path="/admin/impact" element={<AdminImpactCenter />} />
                      <Route path="/admin/influence" element={<AdminInfluenceCenter />} />
                      <Route path="/admin/effect" element={<AdminEffectCenter />} />
                      <Route path="/admin/result" element={<AdminResultCenter />} />
                      <Route path="/admin/outcome" element={<AdminOutcomeCenter />} />
                      <Route path="/admin/consequence" element={<AdminConsequenceCenter />} />
                      <Route path="/admin/implication" element={<AdminImplicationCenter />} />
                      <Route path="/admin/significance" element={<AdminSignificanceCenter />} />
                      <Route path="/admin/importance" element={<AdminImportanceCenter />} />
                      <Route path="/admin/value" element={<AdminValueCenter />} />
                      <Route path="/admin/worth" element={<AdminWorthCenter />} />
                      <Route path="/admin/merit" element={<AdminMeritCenter />} />
                      <Route path="/admin/quality-hub" element={<AdminQualityHub />} />
                      <Route path="/admin/standard" element={<AdminStandardCenter />} />
                      <Route path="/admin/benchmark" element={<AdminBenchmarkCenter />} />
                      <Route path="/admin/metric" element={<AdminMetricCenter />} />
                      <Route path="/admin/measurement" element={<AdminMeasurementCenter />} />
                      <Route path="/admin/assessment-hub" element={<AdminAssessmentHub />} />
                      <Route path="/admin/evaluation" element={<AdminEvaluationCenter />} />
                      <Route path="/admin/analysis-hub" element={<AdminAnalysisHub />} />
                      <Route path="/admin/examination" element={<AdminExaminationCenter />} />
                      <Route path="/admin/inspection" element={<AdminInspectionCenter />} />
                      <Route path="/admin/review-hub" element={<AdminReviewHub />} />
                      <Route path="/admin/audit-center" element={<AdminAuditCenter />} />
                      <Route path="/admin/check" element={<AdminCheckCenter />} />
                      <Route path="/admin/verification-hub" element={<AdminVerificationHub />} />
                      <Route path="/admin/validation-hub" element={<AdminValidationHub />} />
                      <Route path="/admin/confirmation" element={<AdminConfirmationCenter />} />
                      <Route path="/admin/approval-hub" element={<AdminApprovalHub />} />
                      <Route path="/admin/authorization-hub" element={<AdminAuthorizationHub />} />
                      <Route path="/admin/permission-hub" element={<AdminPermissionHub />} />
                      <Route path="/admin/access-hub" element={<AdminAccessHub />} />
                      <Route path="/admin/entry" element={<AdminEntryCenter />} />
                      <Route path="/admin/admission" element={<AdminAdmissionCenter />} />
                      <Route path="/admin/acceptance" element={<AdminAcceptanceCenter />} />
                      <Route path="/admin/welcome-hub" element={<AdminWelcomeHub />} />
                      <Route path="/admin/greeting" element={<AdminGreetingCenter />} />
                      <Route path="/admin/reception" element={<AdminReceptionCenter />} />
                      <Route path="/admin/hospitality" element={<AdminHospitalityCenter />} />
                      <Route path="/admin/service-hub" element={<AdminServiceHub />} />
                      <Route path="/admin/support-hub" element={<AdminSupportHub />} />
                      <Route path="/admin/assistance-hub" element={<AdminAssistanceHub />} />
                      <Route path="/admin/help-hub" element={<AdminHelpHub />} />
                      <Route path="/admin/aid" element={<AdminAidCenter />} />
                      <Route path="/admin/relief" element={<AdminReliefCenter />} />
                      <Route path="/admin/rescue" element={<AdminRescueCenter />} />
                      <Route path="/admin/emergency" element={<AdminEmergencyCenter />} />
                      <Route path="/admin/urgent-care" element={<AdminUrgentCareCenter />} />
                      <Route path="/admin/critical-care" element={<AdminCriticalCareCenter />} />
                      <Route path="/admin/intensive-care" element={<AdminIntensiveCareCenter />} />
                      <Route path="/admin/special-care" element={<AdminSpecialCareCenter />} />
                      <Route path="/admin/premium-care" element={<AdminPremiumCareCenter />} />
                      <Route path="/admin/vip" element={<AdminVIPCenter />} />
                      <Route path="/admin/executive" element={<AdminExecutiveCenter />} />
                      <Route path="/admin/management-hub" element={<AdminManagementHub />} />
                      <Route path="/admin/leadership-hub" element={<AdminLeadershipHub />} />
                      <Route path="/admin/director" element={<AdminDirectorCenter />} />
                      <Route path="/admin/executive-hub" element={<AdminExecutiveHub />} />
                      <Route path="/admin/presidential" element={<AdminPresidentialCenter />} />
                      <Route path="/admin/chairman" element={<AdminChairmanCenter />} />
                      <Route path="/admin/board" element={<AdminBoardCenter />} />
                      <Route path="/admin/council" element={<AdminCouncilCenter />} />
                      <Route path="/admin/committee" element={<AdminCommitteeCenter />} />
                      <Route path="/admin/panel" element={<AdminPanelCenter />} />
                      <Route path="/admin/group-hub" element={<AdminGroupHub />} />
                      <Route path="/admin/team-hub" element={<AdminTeamHub />} />
                      <Route path="/admin/squad" element={<AdminSquadCenter />} />
                      <Route path="/admin/crew" element={<AdminCrewCenter />} />
                      <Route path="/admin/staff" element={<AdminStaffCenter />} />
                      <Route path="/admin/personnel" element={<AdminPersonnelCenter />} />
                      <Route path="/admin/workforce" element={<AdminWorkforceCenter />} />
                      <Route path="/admin/employee" element={<AdminEmployeeCenter />} />
                      <Route path="/admin/worker" element={<AdminWorkerCenter />} />
                      <Route path="/admin/labor" element={<AdminLaborCenter />} />
                      <Route path="/admin/resource-hub" element={<AdminResourceHub />} />
                      <Route path="/admin/asset-hub" element={<AdminAssetHub />} />
                      <Route path="/admin/capital-hub" element={<AdminCapitalHub />} />
                      <Route path="/admin/fund-hub" element={<AdminFundHub />} />
                      <Route path="/admin/budget-hub" element={<AdminBudgetHub />} />
                      <Route path="/admin/finance-hub" element={<AdminFinanceHub />} />
                      <Route path="/admin/money" element={<AdminMoneyCenter />} />
                      <Route path="/admin/currency" element={<AdminCurrencyCenter />} />
                      <Route path="/admin/cash" element={<AdminCashCenter />} />
                      <Route path="/admin/credit-hub" element={<AdminCreditHub />} />
                      <Route path="/admin/debit" element={<AdminDebitCenter />} />
                      <Route path="/admin/account" element={<AdminAccountCenter />} />
                      <Route path="/admin/ledger" element={<AdminLedgerCenter />} />
                      <Route path="/admin/bookkeeping" element={<AdminBookkeepingCenter />} />
                      <Route path="/admin/accounting-hub" element={<AdminAccountingHub />} />
                      <Route path="/admin/auditing" element={<AdminAuditingCenter />} />
                      <Route path="/admin/tax" element={<AdminTaxCenter />} />
                      <Route path="/admin/revenue-hub" element={<AdminRevenueHub />} />
                      <Route path="/admin/income" element={<AdminIncomeCenter />} />
                      <Route path="/admin/earnings" element={<AdminEarningsCenter />} />
                      <Route path="/admin/profit-hub" element={<AdminProfitHub />} />
                      <Route path="/admin/gain" element={<AdminGainCenter />} />
                      <Route path="/admin/benefit" element={<AdminBenefitCenter />} />
                      <Route path="/admin/advantage" element={<AdminAdvantageCenter />} />
                      <Route path="/admin/opportunity-hub" element={<AdminOpportunityHub />} />
                      <Route path="/admin/chance" element={<AdminChanceCenter />} />
                      <Route path="/admin/possibility-hub" element={<AdminPossibilityHub />} />
                      <Route path="/admin/potential-hub" element={<AdminPotentialHub />} />
                      <Route path="/admin/prospect-hub" element={<AdminProspectHub />} />
                      <Route path="/admin/future-hub" element={<AdminFutureHub />} />
                      <Route path="/admin/tomorrow" element={<AdminTomorrowCenter />} />
                      <Route path="/admin/next" element={<AdminNextCenter />} />
                      <Route path="/admin/upcoming" element={<AdminUpcomingCenter />} />
                      <Route path="/admin/pending" element={<AdminPendingCenter />} />
                      <Route path="/admin/waiting" element={<AdminWaitingCenter />} />
                      <Route path="/admin/queue" element={<AdminQueueCenter />} />
                      <Route path="/admin/line" element={<AdminLineCenter />} />
                      <Route path="/admin/sequence" element={<AdminSequenceCenter />} />
                      <Route path="/admin/order-hub" element={<AdminOrderHub />} />
                      <Route path="/admin/arrangement" element={<AdminArrangementCenter />} />
                      <Route path="/admin/organization-hub" element={<AdminOrganizationHub />} />
                      <Route path="/admin/structure-hub" element={<AdminStructureHub />} />
                      <Route path="/admin/system-hub" element={<AdminSystemHub />} />
                      <Route path="/admin/framework" element={<AdminFrameworkCenter />} />
                      <Route path="/admin/architecture" element={<AdminArchitectureCenter />} />
                      <Route path="/admin/design" element={<AdminDesignCenter />} />
                      <Route path="/admin/plan" element={<AdminPlanCenter />} />
                      <Route path="/admin/scheme" element={<AdminSchemeCenter />} />
                      <Route path="/admin/strategy-hub" element={<AdminStrategyHub />} />
                      <Route path="/admin/tactic" element={<AdminTacticCenter />} />
                      <Route path="/admin/approach" element={<AdminApproachCenter />} />
                      <Route path="/admin/method" element={<AdminMethodCenter />} />
                      <Route path="/admin/technique" element={<AdminTechniqueCenter />} />
                      <Route path="/admin/procedure-hub" element={<AdminProcedureHub />} />
                      <Route path="/admin/process-hub" element={<AdminProcessHub />} />
                      <Route path="/admin/workflow-hub" element={<AdminWorkflowHub />} />
                      <Route path="/admin/operation-hub" element={<AdminOperationHub />} />
                      <Route path="/admin/function" element={<AdminFunctionCenter />} />
                      <Route path="/admin/activity" element={<AdminActivityCenter />} />
                      <Route path="/admin/task-hub" element={<AdminTaskHub />} />
                      <Route path="/admin/job-hub" element={<AdminJobHub />} />
                      <Route path="/admin/work" element={<AdminWorkCenter />} />
                      <Route path="/admin/labor-hub" element={<AdminLaborHub />} />
                      <Route path="/admin/effort" element={<AdminEffortCenter />} />
                      <Route path="/admin/energy-hub" element={<AdminEnergyHub />} />
                      <Route path="/admin/power-hub" element={<AdminPowerHub />} />
                      <Route path="/admin/force-hub" element={<AdminForceHub />} />
                      <Route path="/admin/strength-hub" element={<AdminStrengthHub />} />
                      <Route path="/admin/might" element={<AdminMightCenter />} />
                      <Route path="/admin/capacity-hub" element={<AdminCapacityHub />} />
                      <Route path="/admin/ability-hub" element={<AdminAbilityHub />} />
                      <Route path="/admin/skill-hub" element={<AdminSkillHub />} />
                      <Route path="/admin/talent-hub" element={<AdminTalentHub />} />
                      <Route path="/admin/gift" element={<AdminGiftCenter />} />
                      <Route path="/admin/endowment-hub" element={<AdminEndowmentHub />} />
                      <Route path="/admin/nature" element={<AdminNatureCenter />} />
                      <Route path="/admin/character" element={<AdminCharacterCenter />} />
                      <Route path="/admin/personality" element={<AdminPersonalityCenter />} />
                      <Route path="/admin/identity" element={<AdminIdentityCenter />} />
                      <Route path="/admin/profile-hub" element={<AdminProfileHub />} />
                      <Route path="/admin/biography" element={<AdminBiographyCenter />} />
                      <Route path="/admin/history-hub" element={<AdminHistoryHub />} />
                      <Route path="/admin/record" element={<AdminRecordCenter />} />
                      <Route path="/admin/document-hub" element={<AdminDocumentHub />} />
                      <Route path="/admin/file" element={<AdminFileCenter />} />
                      <Route path="/admin/folder" element={<AdminFolderCenter />} />
                      <Route path="/admin/directory" element={<AdminDirectoryCenter />} />
                      <Route path="/admin/catalog" element={<AdminCatalogCenter />} />
                      <Route path="/admin/index" element={<AdminIndexCenter />} />
                      <Route path="/admin/list" element={<AdminListCenter />} />
                      <Route path="/admin/registry" element={<AdminRegistryCenter />} />
                      <Route path="/admin/database-hub" element={<AdminDatabaseHub />} />
                      <Route path="/admin/repository" element={<AdminRepositoryCenter />} />
                      <Route path="/admin/storage" element={<AdminStorageCenter />} />
                      <Route path="/admin/warehouse-hub" element={<AdminWarehouseHub />} />
                      <Route path="/admin/depot" element={<AdminDepotCenter />} />
                      <Route path="/admin/vault" element={<AdminVaultCenter />} />
                      <Route path="/admin/safe" element={<AdminSafeCenter />} />
                      <Route path="/admin/secure" element={<AdminSecureCenter />} />
                      <Route path="/admin/protected" element={<AdminProtectedCenter />} />
                      <Route path="/admin/private" element={<AdminPrivateCenter />} />
                      <Route path="/admin/confidential" element={<AdminConfidentialCenter />} />
                      <Route path="/admin/classified" element={<AdminClassifiedCenter />} />
                      <Route path="/admin/restricted" element={<AdminRestrictedCenter />} />
                      <Route path="/admin/limited" element={<AdminLimitedCenter />} />
                      <Route path="/admin/controlled" element={<AdminControlledCenter />} />
                      <Route path="/admin/regulated" element={<AdminRegulatedCenter />} />
                      <Route path="/admin/managed" element={<AdminManagedCenter />} />
                      <Route path="/admin/supervised" element={<AdminSupervisedCenter />} />
                      <Route path="/admin/oversight-hub" element={<AdminOversightHub />} />
                      <Route path="/admin/governance-center" element={<AdminGovernanceCenter />} />
                      <Route path="/admin/rule" element={<AdminRuleCenter />} />
                      <Route path="/admin/regulation" element={<AdminRegulationCenter />} />
                      <Route path="/admin/law" element={<AdminLawCenter />} />
                      <Route path="/admin/legal-hub" element={<AdminLegalHub />} />
                      <Route path="/admin/judicial" element={<AdminJudicialCenter />} />
                      <Route path="/admin/court" element={<AdminCourtCenter />} />
                      <Route path="/admin/tribunal" element={<AdminTribunalCenter />} />
                      <Route path="/admin/justice" element={<AdminJusticeCenter />} />
                      <Route path="/admin/fairness" element={<AdminFairnessCenter />} />
                      <Route path="/admin/equity-hub" element={<AdminEquityHub />} />
                      <Route path="/admin/equality" element={<AdminEqualityCenter />} />
                      <Route path="/admin/balance" element={<AdminBalanceCenter />} />
                      <Route path="/admin/harmony" element={<AdminHarmonyCenter />} />
                      <Route path="/admin/peace" element={<AdminPeaceCenter />} />
                      <Route path="/admin/tranquility" element={<AdminTranquilityCenter />} />
                      <Route path="/admin/serenity" element={<AdminSerenityCenter />} />
                      <Route path="/admin/calm" element={<AdminCalmCenter />} />
                      <Route path="/admin/quiet" element={<AdminQuietCenter />} />
                      <Route path="/admin/silence" element={<AdminSilenceCenter />} />
                      <Route path="/admin/stillness" element={<AdminStillnessCenter />} />
                      <Route path="/admin/rest" element={<AdminRestCenter />} />
                      <Route path="/admin/relaxation" element={<AdminRelaxationCenter />} />
                      <Route path="/admin/comfort" element={<AdminComfortCenter />} />
                      <Route path="/admin/ease" element={<AdminEaseCenter />} />
                      <Route path="/admin/convenience" element={<AdminConvenienceCenter />} />
                      <Route path="/admin/simplicity" element={<AdminSimplicityCenter />} />
                      <Route path="/admin/clarity" element={<AdminClarityCenter />} />
                      <Route path="/admin/transparency" element={<AdminTransparencyCenter />} />
                      <Route path="/admin/openness" element={<AdminOpennessCenter />} />
                      <Route path="/admin/honesty" element={<AdminHonestyCenter />} />
                      <Route path="/admin/integrity-hub" element={<AdminIntegrityHub />} />
                      <Route path="/admin/trustworthiness" element={<AdminTrustworthinessCenter />} />
                      <Route path="/admin/reliability-hub" element={<AdminReliabilityHub />} />
                      <Route path="/admin/dependability" element={<AdminDependabilityCenter />} />
                      <Route path="/admin/consistency" element={<AdminConsistencyCenter />} />
                      <Route path="/admin/stability-hub" element={<AdminStabilityHub />} />
                      <Route path="/admin/steadiness" element={<AdminSteadinessCenter />} />
                      <Route path="/admin/firmness" element={<AdminFirmnessCenter />} />
                      <Route path="/admin/solidity" element={<AdminSolidityCenter />} />
                      <Route path="/admin/strength-center" element={<AdminStrengthCenter />} />
                      <Route path="/admin/durability" element={<AdminDurabilityCenter />} />
                      <Route path="/admin/longevity" element={<AdminLongevityCenter />} />
                      <Route path="/admin/permanence" element={<AdminPermanenceCenter />} />
                      <Route path="/admin/continuity" element={<AdminContinuityCenter />} />
                      <Route path="/admin/persistence" element={<AdminPersistenceCenter />} />
                      <Route path="/admin/endurance" element={<AdminEnduranceCenter />} />
                      <Route path="/admin/resilience-hub" element={<AdminResilienceHub />} />
                      <Route path="/admin/toughness" element={<AdminToughnessCenter />} />
                      <Route path="/admin/hardness" element={<AdminHardnessCenter />} />
                      <Route path="/admin/rigidity" element={<AdminRigidityCenter />} />
                      <Route path="/admin/stiffness" element={<AdminStiffnessCenter />} />
                      <Route path="/admin/inflexibility" element={<AdminInflexibilityCenter />} />
                      <Route path="/admin/immobility" element={<AdminImmobilityCenter />} />
                      <Route path="/admin/fixity" element={<AdminFixityCenter />} />
                      <Route path="/admin/stability-center" element={<AdminStabilityCenter />} />
                      <Route path="/admin/steadiness-hub" element={<AdminSteadinessHub />} />
                      <Route path="/admin/constancy" element={<AdminConstancyCenter />} />
                      <Route path="/admin/uniformity" element={<AdminUniformityCenter />} />
                      <Route path="/admin/regularity" element={<AdminRegularityCenter />} />
                      <Route path="/admin/orderliness" element={<AdminOrderlinessCenter />} />
                      <Route path="/admin/methodicalness" element={<AdminMethodicalnessCenter />} />
                      <Route path="/admin/systematicness" element={<AdminSystematicnessCenter />} />
                      <Route path="/admin/organization-center" element={<AdminOrganizationCenter />} />
                      <Route path="/admin/arrangement-hub" element={<AdminArrangementHub />} />
                      <Route path="/admin/coordination" element={<AdminCoordinationCenter />} />
                      <Route path="/admin/synchronization" element={<AdminSynchronizationCenter />} />
                      <Route path="/admin/harmonization" element={<AdminHarmonizationCenter />} />
                      <Route path="/admin/integration-hub" element={<AdminIntegrationHub />} />
                      <Route path="/admin/unification" element={<AdminUnificationCenter />} />
                      <Route path="/admin/consolidation" element={<AdminConsolidationCenter />} />
                      <Route path="/admin/centralization" element={<AdminCentralizationCenter />} />
                      <Route path="/admin/concentration" element={<AdminConcentrationCenter />} />
                      <Route path="/admin/focus" element={<AdminFocusCenter />} />
                      <Route path="/admin/attention" element={<AdminAttentionCenter />} />
                      <Route path="/admin/awareness" element={<AdminAwarenessCenter />} />
                      <Route path="/admin/consciousness" element={<AdminConsciousnessCenter />} />
                      <Route path="/admin/mindfulness" element={<AdminMindfulnessCenter />} />
                      <Route path="/admin/thoughtfulness" element={<AdminThoughtfulnessCenter />} />
                      <Route path="/admin/consideration" element={<AdminConsiderationCenter />} />
                      <Route path="/admin/reflection" element={<AdminReflectionCenter />} />
                      <Route path="/admin/contemplation" element={<AdminContemplationCenter />} />
                      <Route path="/admin/meditation" element={<AdminMeditationCenter />} />
                      <Route path="/admin/introspection" element={<AdminIntrospectionCenter />} />
                      <Route path="/admin/self-examination" element={<AdminSelfExaminationCenter />} />
                      <Route path="/admin/self-analysis" element={<AdminSelfAnalysisCenter />} />
                      <Route path="/admin/self-assessment" element={<AdminSelfAssessmentCenter />} />
                      <Route path="/admin/self-evaluation" element={<AdminSelfEvaluationCenter />} />
                      <Route path="/admin/self-reflection" element={<AdminSelfReflectionCenter />} />
                      <Route path="/admin/self-awareness" element={<AdminSelfAwarenessCenter />} />
                      <Route path="/admin/self-knowledge" element={<AdminSelfKnowledgeCenter />} />
                      <Route path="/admin/self-understanding" element={<AdminSelfUnderstandingCenter />} />
                      <Route path="/admin/self-insight" element={<AdminSelfInsightCenter />} />
                      <Route path="/admin/self-discovery" element={<AdminSelfDiscoveryCenter />} />
                      <Route path="/admin/self-realization" element={<AdminSelfRealizationCenter />} />
                      <Route path="/admin/self-actualization" element={<AdminSelfActualizationCenter />} />
                      <Route path="/admin/self-fulfillment" element={<AdminSelfFulfillmentCenter />} />
                      <Route path="/admin/self-development" element={<AdminSelfDevelopmentCenter />} />
                      <Route path="/admin/self-improvement" element={<AdminSelfImprovementCenter />} />
                      <Route path="/admin/self-enhancement" element={<AdminSelfEnhancementCenter />} />
                      <Route path="/admin/self-optimization" element={<AdminSelfOptimizationCenter />} />
                      <Route path="/admin/self-perfection" element={<AdminSelfPerfectionCenter />} />
                      <Route path="/admin/self-mastery" element={<AdminSelfMasteryCenter />} />
                      <Route path="/admin/self-excellence" element={<AdminSelfExcellenceCenter />} />
                      <Route path="/admin/self-transformation" element={<AdminSelfTransformationCenter />} />
                      <Route path="/admin/self-evolution" element={<AdminSelfEvolutionCenter />} />
                      <Route path="/admin/self-progress" element={<AdminSelfProgressCenter />} />
                      <Route path="/admin/self-advancement" element={<AdminSelfAdvancementCenter />} />
                      <Route path="/admin/self-growth" element={<AdminSelfGrowthCenter />} />
                      <Route path="/admin/self-expansion" element={<AdminSelfExpansionCenter />} />
                      <Route path="/admin/self-extension" element={<AdminSelfExtensionCenter />} />
                      <Route path="/admin/self-enlargement" element={<AdminSelfEnlargementCenter />} />
                      <Route path="/admin/self-amplification" element={<AdminSelfAmplificationCenter />} />
                      <Route path="/admin/self-magnification" element={<AdminSelfMagnificationCenter />} />
                      <Route path="/admin/self-intensification" element={<AdminSelfIntensificationCenter />} />
                      <Route path="/admin/self-strengthening" element={<AdminSelfStrengtheningCenter />} />
                      <Route path="/admin/self-empowerment" element={<AdminSelfEmpowermentCenter />} />
                      <Route path="/admin/self-enablement" element={<AdminSelfEnablementCenter />} />
                      <Route path="/admin/self-capacitation" element={<AdminSelfCapacitationCenter />} />
                      <Route path="/admin/self-qualification" element={<AdminSelfQualificationCenter />} />
                      <Route path="/admin/self-certification" element={<AdminSelfCertificationCenter />} />
                      <Route path="/admin/self-validation" element={<AdminSelfValidationCenter />} />
                      <Route path="/admin/self-verification" element={<AdminSelfVerificationCenter />} />
                      <Route path="/admin/self-authentication" element={<AdminSelfAuthenticationCenter />} />
                      <Route path="/admin/self-authorization" element={<AdminSelfAuthorizationCenter />} />
                      <Route path="/admin/self-approval" element={<AdminSelfApprovalCenter />} />
                      <Route path="/admin/self-endorsement" element={<AdminSelfEndorsementCenter />} />
                      <Route path="/admin/self-sanction" element={<AdminSelfSanctionCenter />} />
                      <Route path="/admin/self-permission" element={<AdminSelfPermissionCenter />} />
                      <Route path="/admin/self-license" element={<AdminSelfLicenseCenter />} />
                      <Route path="/admin/self-credential" element={<AdminSelfCredentialCenter />} />
                      <Route path="/admin/self-accreditation" element={<AdminSelfAccreditationCenter />} />
                      <Route path="/admin/self-recognition" element={<AdminSelfRecognitionCenter />} />
                      <Route path="/admin/self-acknowledgment" element={<AdminSelfAcknowledgmentCenter />} />
                      <Route path="/admin/self-appreciation" element={<AdminSelfAppreciationCenter />} />
                      <Route path="/admin/self-gratitude" element={<AdminSelfGratitudeCenter />} />
                      <Route path="/admin/self-thankfulness" element={<AdminSelfThankfulnessCenter />} />
                      <Route path="/admin/self-gratefulness" element={<AdminSelfGratefulnessCenter />} />
                      <Route path="/admin/self-contentment" element={<AdminSelfContentmentCenter />} />
                      <Route path="/admin/self-satisfaction" element={<AdminSelfSatisfactionCenter />} />
                      <Route path="/admin/self-happiness" element={<AdminSelfHappinessCenter />} />
                      <Route path="/admin/self-joy" element={<AdminSelfJoyCenter />} />
                      <Route path="/admin/self-pleasure" element={<AdminSelfPleasureCenter />} />
                      <Route path="/admin/self-delight" element={<AdminSelfDelightCenter />} />
                      <Route path="/admin/self-bliss" element={<AdminSelfBlissCenter />} />
                      <Route path="/admin/self-ecstasy" element={<AdminSelfEcstasyCenter />} />
                      <Route path="/admin/self-euphoria" element={<AdminSelfEuphoriaCenter />} />
                      <Route path="/admin/self-elation" element={<AdminSelfElationCenter />} />
                      <Route path="/admin/self-exhilaration" element={<AdminSelfExhilarationCenter />} />
                      <Route path="/admin/self-excitement" element={<AdminSelfExcitementCenter />} />
                      <Route path="/admin/self-enthusiasm" element={<AdminSelfEnthusiasmCenter />} />
                      <Route path="/admin/self-passion" element={<AdminSelfPassionCenter />} />
                      <Route path="/admin/self-fervor" element={<AdminSelfFervorCenter />} />
                      <Route path="/admin/self-zeal" element={<AdminSelfZealCenter />} />
                      <Route path="/admin/self-ardor" element={<AdminSelfArdorCenter />} />
                      <Route path="/admin/self-intensity" element={<AdminSelfIntensityCenter />} />
                      <Route path="/admin/self-vehemence" element={<AdminSelfVehemenceCenter />} />
                      <Route path="/admin/self-vigor" element={<AdminSelfVigorCenter />} />
                      <Route path="/admin/self-vitality" element={<AdminSelfVitalityCenter />} />
                      <Route path="/admin/self-energy" element={<AdminSelfEnergyCenter />} />
                      <Route path="/admin/self-dynamism" element={<AdminSelfDynamismCenter />} />
                      <Route path="/admin/self-force" element={<AdminSelfForceCenter />} />
                      <Route path="/admin/self-power" element={<AdminSelfPowerCenter />} />
                      <Route path="/admin/self-might" element={<AdminSelfMightCenter />} />
                      <Route path="/admin/self-strength" element={<AdminSelfStrengthCenter />} />
                      <Route path="/admin/self-potency" element={<AdminSelfPotencyCenter />} />
                      <Route path="/admin/self-capability" element={<AdminSelfCapabilityCenter />} />
                      <Route path="/admin/self-competence" element={<AdminSelfCompetenceCenter />} />
                      <Route path="/admin/self-proficiency" element={<AdminSelfProficiencyCenter />} />
                      <Route path="/admin/self-skill" element={<AdminSelfSkillCenter />} />
                      <Route path="/admin/self-expertise" element={<AdminSelfExpertiseCenter />} />
                      <Route path="/admin/self-mastery-center" element={<AdminSelfMasteryCenter />} />
                      <Route path="/admin/self-virtuosity" element={<AdminSelfVirtuosityCenter />} />
                      <Route path="/admin/self-artistry" element={<AdminSelfArtistryCenter />} />
                      <Route path="/admin/self-craftsmanship" element={<AdminSelfCraftsmanshipCenter />} />
                      <Route path="/admin/self-workmanship" element={<AdminSelfWorkmanshipCenter />} />
                      <Route path="/admin/self-technique" element={<AdminSelfTechniqueCenter />} />
                      <Route path="/admin/self-method" element={<AdminSelfMethodCenter />} />
                      <Route path="/admin/self-approach" element={<AdminSelfApproachCenter />} />
                      <Route path="/admin/self-strategy" element={<AdminSelfStrategyCenter />} />
                      <Route path="/admin/self-tactic" element={<AdminSelfTacticCenter />} />
                      <Route path="/admin/self-plan" element={<AdminSelfPlanCenter />} />
                      <Route path="/admin/self-scheme" element={<AdminSelfSchemeCenter />} />
                      <Route path="/admin/self-design" element={<AdminSelfDesignCenter />} />
                      <Route path="/admin/self-blueprint" element={<AdminSelfBlueprint />} />
                    </Routes>
                    
                    <BackToTop />
                    <Toaster />
                    <Sonner />
                  </TooltipProvider>
                </CallNotificationProvider>
              </RouteAwareThemeProvider>
            </LanguageProvider>
          </AuthContextProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
