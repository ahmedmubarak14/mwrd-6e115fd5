/**
 * Admin Translations - Export Configuration
 * Centralized export for structured admin translations
 */

export { adminTranslationsEN } from './en-US';
export { adminTranslationsAR } from './ar-SA';

// Type definitions for admin translations
export interface AdminTranslations {
  dashboard: {
    title: string;
    description: string;
    welcome: string;
    overview: string;
  };
  navigation: Record<string, string>;
  breadcrumbs: Record<string, string>;
  commandPalette: Record<string, string>;
  users: Record<string, string>;
  requests: Record<string, string>;
  offers: Record<string, string>;
  communication: Record<string, string>;
  financial: Record<string, string>;
  verification: Record<string, string>;
  analytics: Record<string, string>;
  system: Record<string, string>;
  security: Record<string, string>;
  actions: Record<string, string>;
  messages: Record<string, string>;
  forms: {
    placeholders: Record<string, string>;
    labels: Record<string, string>;
    validation: Record<string, string>;
  };
}

// Validation helper to ensure translation completeness
export const validateAdminTranslations = (translations: any): boolean => {
  const requiredSections = [
    'dashboard', 'navigation', 'breadcrumbs', 'commandPalette',
    'users', 'requests', 'offers', 'communication', 'financial',
    'verification', 'analytics', 'system', 'security', 
    'actions', 'messages', 'forms'
  ];

  return requiredSections.every(section => 
    translations && typeof translations[section] === 'object'
  );
};