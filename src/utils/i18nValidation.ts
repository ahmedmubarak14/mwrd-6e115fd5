/**
 * i18n Validation Utilities
 * 
 * This module provides utilities to validate i18n compliance across the admin dashboard.
 * It helps detect missing translation keys, unused keys, and hardcoded strings.
 */

import { translations } from '@/constants/translations';

export interface ValidationResult {
  missingKeys: string[];
  unusedKeys: string[];
  hardcodedStrings: { file: string; line: number; content: string }[];
  coverage: number;
}

/**
 * Validates that all required admin translation keys exist
 */
export const validateAdminTranslationKeys = (): string[] => {
  const requiredKeys = [
    // Core Admin
    'admin.dashboard',
    'admin.users',
    'admin.requests', 
    'admin.offers',
    'admin.orders',
    'admin.communications',
    'admin.settings',
    'admin.profile',
    
    // Breadcrumbs
    'admin.breadcrumbs.admin',
    'admin.breadcrumbs.userManagement',
    'admin.breadcrumbs.requestsManagement',
    'admin.breadcrumbs.offersManagement',
    'admin.breadcrumbs.ordersManagement',
    'admin.breadcrumbs.communicationCenter',
    
    // Command Palette
    'admin.commandPalette.goToUsers',
    'admin.commandPalette.createNewUser',
    'admin.commandPalette.reviewRequests',
    'admin.commandPalette.manageOffers',
    'admin.commandPalette.viewAnalytics',
    'admin.commandPalette.financialTransactions',
    'admin.commandPalette.searchUsersRequestsOffers',
    
    // Verification
    'admin.verification.allCaughtUp',
    'admin.verification.noPendingVerifications',
    'admin.verification.verificationQueue',
    'admin.verification.approvedSuccessfully',
    'admin.verification.rejectedSuccessfully',
    
    // Common
    'common.errors.networkConnection',
    'common.errors.requestTimeout', 
    'common.errors.dataLoading',
    'common.placeholders.searchLogs',
    'common.placeholders.filterByAction',
    'common.placeholders.addNotes',
    'common.titles.adminOnline'
  ];

  const missingKeys: string[] = [];
  
  requiredKeys.forEach(key => {
    try {
      const value = getNestedTranslation(translations['en-US'], key);
      if (!value || typeof value !== 'string') {
        missingKeys.push(key);
      }
    } catch {
      missingKeys.push(key);
    }
  });

  return missingKeys;
};

/**
 * Helper function to get nested translation value
 */
const getNestedTranslation = (obj: any, path: string): string | undefined => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

/**
 * Validates RTL support for Arabic translations
 */
export const validateRTLSupport = (): boolean => {
  // Check if document RTL attributes are properly set
  const hasRTLSupport = document.documentElement.hasAttribute('dir');
  const hasLangAttribute = document.documentElement.hasAttribute('lang');
  
  return hasRTLSupport && hasLangAttribute;
};

/**
 * Development mode validation warnings
 */
export const logValidationWarnings = (): void => {
  if (process.env.NODE_ENV === 'development') {
    const missingKeys = validateAdminTranslationKeys();
    
    if (missingKeys.length > 0) {
      console.warn('[i18n Validation] Missing translation keys:', missingKeys);
    }
    
    if (!validateRTLSupport()) {
      console.warn('[i18n Validation] RTL support not properly configured');
    }
  }
};

/**
 * Translation coverage calculator
 */
export const calculateTranslationCoverage = (
  totalKeys: number, 
  translatedKeys: number
): number => {
  if (totalKeys === 0) return 100;
  return Math.round((translatedKeys / totalKeys) * 100);
};

/**
 * Best practices checker for component files
 */
export const validateComponentI18n = (componentCode: string, componentName: string): string[] => {
  const warnings: string[] = [];
  
  // Check for hardcoded strings (basic patterns)
  const hardcodedStringPatterns = [
    /["'][A-Z][a-zA-Z\s]{15,}["']/g, // Long capitalized strings
    /placeholder=["'][^{][^"']*["']/g, // Hardcoded placeholders
    /title=["'][^{][^"']*["']/g, // Hardcoded titles
    /toast\.(success|error|info)\s*\(\s*["']/g // Hardcoded toast messages
  ];
  
  hardcodedStringPatterns.forEach((pattern, index) => {
    const matches = componentCode.match(pattern);
    if (matches && matches.length > 0) {
      warnings.push(`${componentName}: Found ${matches.length} potential hardcoded strings (pattern ${index + 1})`);
    }
  });
  
  // Check for proper useOptionalLanguage import
  if (componentCode.includes('t(') && !componentCode.includes('useOptionalLanguage')) {
    warnings.push(`${componentName}: Uses t() function but missing useOptionalLanguage import`);
  }
  
  return warnings;
};