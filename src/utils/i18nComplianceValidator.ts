/**
 * i18n Compliance Validator
 * Automated validation system to ensure 100% i18n compliance across Admin Dashboard
 */

import { adminTranslationsEN } from '@/constants/admin-translations/en-US';
import { adminTranslationsAR } from '@/constants/admin-translations/ar-SA';

export interface ComplianceIssue {
  type: 'hardcoded_string' | 'missing_translation' | 'translation_mismatch' | 'fallback_usage';
  component: string;
  line?: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  fix?: string;
}

export interface ComplianceReport {
  totalIssues: number;
  errorCount: number;
  warningCount: number;
  complianceScore: number;
  issues: ComplianceIssue[];
  summary: {
    totalComponents: number;
    compliantComponents: number;
    nonCompliantComponents: string[];
  };
}

class I18nComplianceValidator {
  private issues: ComplianceIssue[] = [];
  
  /**
   * Validate translation key exists in both languages
   */
  validateTranslationKey(key: string): boolean {
    const enValue = this.getNestedValue(adminTranslationsEN, key);
    const arValue = this.getNestedValue(adminTranslationsAR, key);
    
    if (!enValue || !arValue) {
      this.issues.push({
        type: 'missing_translation',
        component: 'Translation Keys',
        message: `Missing translation for key: ${key}`,
        severity: 'error',
        fix: `Add translation key '${key}' to both en-US.ts and ar-SA.ts files`
      });
      return false;
    }
    
    return true;
  }

  /**
   * Check for hardcoded strings in component files
   */
  validateComponentFile(fileName: string, content: string): ComplianceIssue[] {
    const componentIssues: ComplianceIssue[] = [];
    const lines = content.split('\n');
    
    // Patterns to detect hardcoded strings
    const hardcodedPatterns = [
      /className="[^"]*">\s*[A-Z][a-zA-Z\s]+\s*</g, // JSX text content
      /title="[A-Z][a-zA-Z\s]+"/, // Title attributes
      /placeholder="[A-Z][a-zA-Z\s]+"/, // Placeholder attributes
      /aria-label="[A-Z][a-zA-Z\s]+"/, // Aria labels
      /"[A-Z][a-zA-Z\s]{3,}"(?!\s*[;}])/g // Quoted strings (excluding short ones and code)
    ];

    // Anti-patterns that indicate non-compliance
    const antiPatterns = [
      /t\([^)]+\)\s*\|\|\s*['"][^'"]+['"]/g, // Fallback patterns like t('key') || 'Fallback'
      /languageContext\s*\?\s*t\([^)]+\)\s*:\s*['"][^'"]+['"]/g, // Conditional fallbacks
    ];

    lines.forEach((line, index) => {
      // Check for hardcoded strings
      hardcodedPatterns.forEach(pattern => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            componentIssues.push({
              type: 'hardcoded_string',
              component: fileName,
              line: index + 1,
              message: `Hardcoded string found: ${match.substring(0, 50)}...`,
              severity: 'error',
              fix: 'Replace with t() function call using structured translation key'
            });
          });
        }
      });

      // Check for anti-patterns (fallback usage)
      antiPatterns.forEach(pattern => {
        if (pattern.test(line)) {
          componentIssues.push({
            type: 'fallback_usage',
            component: fileName,
            line: index + 1,
            message: 'Fallback pattern detected - should use pure t() function calls',
            severity: 'warning',
            fix: 'Remove fallback patterns and ensure all translation keys exist'
          });
        }
      });

      // Check for missing useOptionalLanguage import
      if (line.includes('t(') && !content.includes('useOptionalLanguage')) {
        componentIssues.push({
          type: 'missing_translation',
          component: fileName,
          line: index + 1,
          message: 'Using t() function without importing useOptionalLanguage',
          severity: 'error',
          fix: 'Import { useOptionalLanguage } and destructure { t } from hook'
        });
      }
    });

    return componentIssues;
  }

  /**
   * Validate RTL compliance
   */
  validateRTLCompliance(fileName: string, content: string): ComplianceIssue[] {
    const rtlIssues: ComplianceIssue[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for missing RTL directionality
      if (line.includes('useOptionalLanguage') && !content.includes('isRTL')) {
        rtlIssues.push({
          type: 'missing_translation',
          component: fileName,
          line: index + 1,
          message: 'Component uses i18n but missing RTL support (isRTL)',
          severity: 'warning',
          fix: 'Destructure { isRTL } from useOptionalLanguage() and apply RTL classes'
        });
      }

      // Check for hardcoded left/right margins without RTL consideration
      const rtlSensitiveClasses = /className="[^"]*\b(ml-|mr-|pl-|pr-|left-|right-|text-left|text-right)/;
      if (rtlSensitiveClasses.test(line) && !line.includes('isRTL')) {
        rtlIssues.push({
          type: 'translation_mismatch',
          component: fileName,
          line: index + 1,
          message: 'RTL-sensitive CSS classes without RTL conditional logic',
          severity: 'warning',
          fix: 'Use conditional classes based on isRTL flag'
        });
      }
    });

    return rtlIssues;
  }

  /**
   * Generate comprehensive compliance report
   */
  generateComplianceReport(componentFiles: { name: string; content: string }[]): ComplianceReport {
    this.issues = [];
    
    // Validate each component file
    componentFiles.forEach(file => {
      const componentIssues = this.validateComponentFile(file.name, file.content);
      const rtlIssues = this.validateRTLCompliance(file.name, file.content);
      this.issues.push(...componentIssues, ...rtlIssues);
    });

    // Calculate compliance metrics
    const errorCount = this.issues.filter(issue => issue.severity === 'error').length;
    const warningCount = this.issues.filter(issue => issue.severity === 'warning').length;
    const totalIssues = this.issues.length;
    
    const compliantComponents = componentFiles.filter(file => 
      !this.issues.some(issue => issue.component === file.name && issue.severity === 'error')
    );
    
    const nonCompliantComponents = componentFiles
      .filter(file => this.issues.some(issue => issue.component === file.name && issue.severity === 'error'))
      .map(file => file.name);

    const complianceScore = totalIssues === 0 ? 100 : 
      Math.max(0, Math.round(((componentFiles.length - nonCompliantComponents.length) / componentFiles.length) * 100));

    return {
      totalIssues,
      errorCount,
      warningCount,
      complianceScore,
      issues: this.issues,
      summary: {
        totalComponents: componentFiles.length,
        compliantComponents: compliantComponents.length,
        nonCompliantComponents
      }
    };
  }

  /**
   * Validate translation key coverage
   */
  validateTranslationCoverage(): { missing: string[]; extra: string[] } {
    const enKeys = this.getAllTranslationKeys(adminTranslationsEN);
    const arKeys = this.getAllTranslationKeys(adminTranslationsAR);
    
    const missing = enKeys.filter(key => !arKeys.includes(key));
    const extra = arKeys.filter(key => !enKeys.includes(key));
    
    return { missing, extra };
  }

  /**
   * Helper method to get nested value from object using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Helper method to get all translation keys recursively
   */
  private getAllTranslationKeys(obj: any, prefix = ''): string[] {
    const keys: string[] = [];
    
    Object.keys(obj).forEach(key => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        keys.push(...this.getAllTranslationKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    });
    
    return keys;
  }

  /**
   * Test dynamic language switching functionality
   */
  testLanguageSwitching(): ComplianceIssue[] {
    const switchingIssues: ComplianceIssue[] = [];
    
    // This would ideally be integrated with actual DOM testing
    // For now, we provide a conceptual validation
    
    const requiredElements = [
      'language switcher component',
      'RTL layout changes', 
      'text direction changes',
      'number formatting changes',
      'date formatting changes'
    ];
    
    requiredElements.forEach(element => {
      switchingIssues.push({
        type: 'missing_translation',
        component: 'Language Switching',
        message: `Manual test required: Verify ${element} works correctly`,
        severity: 'info',
        fix: `Test ${element} by switching between English and Arabic`
      });
    });
    
    return switchingIssues;
  }
}

export const i18nValidator = new I18nComplianceValidator();

// Export validation functions for use in tests
export const validateI18nCompliance = (componentFiles: { name: string; content: string }[]) => {
  return i18nValidator.generateComplianceReport(componentFiles);
};

export const validateTranslationCoverage = () => {
  return i18nValidator.validateTranslationCoverage();
};

export const validateTranslationKey = (key: string) => {
  return i18nValidator.validateTranslationKey(key);
};