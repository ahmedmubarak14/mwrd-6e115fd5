import { enUS } from '@/constants/locales/en-US';
import { arSA } from '@/constants/locales/ar-SA';
import { getTranslation } from '@/constants/translations';

export interface TranslationIssue {
  key: string;
  type: 'missing' | 'empty' | 'mismatch' | 'placeholder' | 'icu' | 'rtl';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  enValue?: string;
  arValue?: string;
  suggestion?: string;
}

export interface TranslationCoverage {
  totalKeys: number;
  translatedKeys: number;
  missingKeys: string[];
  emptyKeys: string[];
  coveragePercentage: number;
}

export class TranslationQualityAnalyzer {
  private readonly enTranslations = enUS;
  private readonly arTranslations = arSA;
  
  analyzeTranslationQuality(): {
    issues: TranslationIssue[];
    coverage: TranslationCoverage;
    recommendations: string[];
  } {
    const issues: TranslationIssue[] = [];
    
    // Analyze coverage
    const coverage = this.analyzeCoverage();
    
    // Check for missing translations
    issues.push(...this.findMissingTranslations());
    
    // Check for empty translations
    issues.push(...this.findEmptyTranslations());
    
    // Check for ICU message format issues
    issues.push(...this.analyzeICUMessages());
    
    // Check for RTL-specific issues
    issues.push(...this.analyzeRTLIssues());
    
    // Check for placeholder mismatches
    issues.push(...this.analyzePlaceholderMismatches());
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(issues, coverage);
    
    return {
      issues: this.prioritizeIssues(issues),
      coverage,
      recommendations
    };
  }

  private analyzeCoverage(): TranslationCoverage {
    const enKeys = this.getAllKeys(this.enTranslations);
    const arKeys = this.getAllKeys(this.arTranslations);
    
    const missingKeys = enKeys.filter(key => !this.hasTranslation(key, 'ar'));
    const emptyKeys = enKeys.filter(key => {
      const arValue = this.getNestedValue(this.arTranslations, key);
      return arValue === '' || arValue === null || arValue === undefined;
    });
    
    return {
      totalKeys: enKeys.length,
      translatedKeys: enKeys.length - missingKeys.length - emptyKeys.length,
      missingKeys,
      emptyKeys,
      coveragePercentage: ((enKeys.length - missingKeys.length - emptyKeys.length) / enKeys.length) * 100
    };
  }

  private findMissingTranslations(): TranslationIssue[] {
    const issues: TranslationIssue[] = [];
    const enKeys = this.getAllKeys(this.enTranslations);
    
    for (const key of enKeys) {
      if (!this.hasTranslation(key, 'ar')) {
        const enValue = this.getNestedValue(this.enTranslations, key);
        issues.push({
          key,
          type: 'missing',
          severity: this.getSeverityForKey(key),
          description: `Missing Arabic translation for "${key}"`,
          enValue: enValue as string,
          suggestion: `Add Arabic translation for: "${enValue}"`
        });
      }
    }
    
    return issues;
  }

  private findEmptyTranslations(): TranslationIssue[] {
    const issues: TranslationIssue[] = [];
    const enKeys = this.getAllKeys(this.enTranslations);
    
    for (const key of enKeys) {
      const arValue = this.getNestedValue(this.arTranslations, key);
      if (arValue === '' || arValue === null) {
        const enValue = this.getNestedValue(this.enTranslations, key);
        issues.push({
          key,
          type: 'empty',
          severity: this.getSeverityForKey(key),
          description: `Empty Arabic translation for "${key}"`,
          enValue: enValue as string,
          arValue: arValue as string,
          suggestion: `Provide Arabic translation for: "${enValue}"`
        });
      }
    }
    
    return issues;
  }

  private analyzeICUMessages(): TranslationIssue[] {
    const issues: TranslationIssue[] = [];
    const enKeys = this.getAllKeys(this.enTranslations);
    
    // Check for plural forms and interpolation
    for (const key of enKeys) {
      const enValue = this.getNestedValue(this.enTranslations, key) as string;
      const arValue = this.getNestedValue(this.arTranslations, key) as string;
      
      if (typeof enValue === 'string' && typeof arValue === 'string') {
        // Check for interpolation variables
        const enVars = this.extractVariables(enValue);
        const arVars = this.extractVariables(arValue);
        
        if (enVars.length !== arVars.length || !this.arraysEqual(enVars, arVars)) {
          issues.push({
            key,
            type: 'icu',
            severity: 'high',
            description: `Variable mismatch in "${key}". EN: ${enVars.join(', ')}, AR: ${arVars.join(', ')}`,
            enValue,
            arValue,
            suggestion: `Ensure Arabic translation includes all variables: ${enVars.join(', ')}`
          });
        }
        
        // Check for plural forms
        if (this.hasPluralForm(enValue) && !this.hasPluralForm(arValue)) {
          issues.push({
            key,
            type: 'icu',
            severity: 'medium',
            description: `Missing plural forms in Arabic for "${key}"`,
            enValue,
            arValue,
            suggestion: 'Add Arabic plural forms (zero, one, two, few, many, other)'
          });
        }
      }
    }
    
    return issues;
  }

  private analyzeRTLIssues(): TranslationIssue[] {
    const issues: TranslationIssue[] = [];
    const enKeys = this.getAllKeys(this.enTranslations);
    
    for (const key of enKeys) {
      const arValue = this.getNestedValue(this.arTranslations, key) as string;
      
      if (typeof arValue === 'string') {
        // Check for mixed LTR/RTL content
        if (this.hasMixedDirection(arValue)) {
          issues.push({
            key,
            type: 'rtl',
            severity: 'medium',
            description: `Mixed LTR/RTL content in "${key}": "${arValue}"`,
            arValue,
            suggestion: 'Use proper RTL markers or separate LTR content'
          });
        }
        
        // Check for English text in Arabic translations
        if (this.hasEnglishText(arValue) && !key.includes('email') && !key.includes('url')) {
          issues.push({
            key,
            type: 'rtl',
            severity: 'low',
            description: `English text found in Arabic translation for "${key}"`,
            arValue,
            suggestion: 'Consider translating English terms or use proper embedding'
          });
        }
      }
    }
    
    return issues;
  }

  private analyzePlaceholderMismatches(): TranslationIssue[] {
    const issues: TranslationIssue[] = [];
    const enKeys = this.getAllKeys(this.enTranslations);
    
    for (const key of enKeys) {
      if (key.includes('placeholder') || key.includes('hint') || key.includes('example')) {
        const enValue = this.getNestedValue(this.enTranslations, key) as string;
        const arValue = this.getNestedValue(this.arTranslations, key) as string;
        
        if (typeof enValue === 'string' && typeof arValue === 'string') {
          // Check if placeholder maintains similar meaning
          if (enValue.includes('@') && !arValue.includes('@')) {
            issues.push({
              key,
              type: 'placeholder',
              severity: 'medium',
              description: `Email format missing in Arabic placeholder for "${key}"`,
              enValue,
              arValue,
              suggestion: 'Include email format example in Arabic placeholder'
            });
          }
        }
      }
    }
    
    return issues;
  }

  private getAllKeys(obj: any, prefix = ''): string[] {
    const keys: string[] = [];
    
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        keys.push(...this.getAllKeys(obj[key], fullKey));
      } else if (typeof obj[key] === 'string') {
        keys.push(fullKey);
      }
    }
    
    return keys;
  }

  private getNestedValue(obj: any, key: string): any {
    return key.split('.').reduce((current, part) => current?.[part], obj);
  }

  private hasTranslation(key: string, locale: 'en' | 'ar'): boolean {
    const translation = getTranslation(key, locale);
    return translation !== key && translation !== key.split('.').pop();
  }

  private extractVariables(text: string): string[] {
    const variables: string[] = [];
    
    // Extract {variable} patterns
    const braceMatches = text.match(/\{([^}]+)\}/g);
    if (braceMatches) {
      variables.push(...braceMatches);
    }
    
    // Extract {{variable}} patterns
    const doubleBraceMatches = text.match(/\{\{([^}]+)\}\}/g);
    if (doubleBraceMatches) {
      variables.push(...doubleBraceMatches);
    }
    
    return variables;
  }

  private arraysEqual(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every(val => b.includes(val));
  }

  private hasPluralForm(text: string): boolean {
    return /\{[^}]*,\s*plural/.test(text) || text.includes('one') || text.includes('other');
  }

  private hasMixedDirection(text: string): boolean {
    const hasArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
    const hasLatin = /[A-Za-z]/.test(text);
    return hasArabic && hasLatin;
  }

  private hasEnglishText(text: string): boolean {
    // Check for common English words in Arabic text
    const englishWords = /\b(the|and|or|in|on|at|to|for|of|with|by)\b/i;
    return englishWords.test(text) && /[\u0600-\u06FF]/.test(text);
  }

  private getSeverityForKey(key: string): 'critical' | 'high' | 'medium' | 'low' {
    // Critical: Error messages, navigation, core UI
    if (key.includes('error') || key.includes('nav') || key.includes('menu') || 
        key.includes('button') || key.includes('title')) {
      return 'critical';
    }
    
    // High: User-facing messages, forms, actions
    if (key.includes('form') || key.includes('message') || key.includes('action') ||
        key.includes('status') || key.includes('common')) {
      return 'high';
    }
    
    // Medium: Descriptions, help text
    if (key.includes('description') || key.includes('help') || key.includes('hint')) {
      return 'medium';
    }
    
    return 'low';
  }

  private prioritizeIssues(issues: TranslationIssue[]): TranslationIssue[] {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    
    return issues.sort((a, b) => {
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (severityDiff !== 0) return severityDiff;
      return a.key.localeCompare(b.key);
    });
  }

  private generateRecommendations(issues: TranslationIssue[], coverage: TranslationCoverage): string[] {
    const recommendations: string[] = [];
    
    if (coverage.coveragePercentage < 90) {
      recommendations.push(`🎯 **Priority**: Translation coverage is ${coverage.coveragePercentage.toFixed(1)}%. Focus on reaching 95%+ coverage.`);
    }
    
    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    if (criticalCount > 0) {
      recommendations.push(`🚨 **Critical**: ${criticalCount} critical translation issues need immediate attention.`);
    }
    
    const icuCount = issues.filter(i => i.type === 'icu').length;
    if (icuCount > 5) {
      recommendations.push(`📋 **ICU Format**: ${icuCount} issues with variable/plural handling. Consider implementing ICU message format.`);
    }
    
    const rtlCount = issues.filter(i => i.type === 'rtl').length;
    if (rtlCount > 3) {
      recommendations.push(`🔄 **RTL Support**: ${rtlCount} RTL-specific issues found. Review Arabic text embedding and direction.`);
    }
    
    if (coverage.missingKeys.length > 20) {
      recommendations.push(`📝 **Batch Translation**: ${coverage.missingKeys.length} missing keys. Consider batch translation workflow.`);
    }
    
    recommendations.push(`✅ **Next Steps**: Start with critical and high severity issues, then improve coverage to 95%+.`);
    
    return recommendations;
  }
}

export const translationQualityAnalyzer = new TranslationQualityAnalyzer();