import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

export interface HardcodedStringIssue {
  file: string;
  line: number;
  column: number;
  text: string;
  severity: 'high' | 'medium' | 'low';
  type: 'literal' | 'template' | 'jsx' | 'attribute';
  context: string;
}

export class HardcodedStringScanner {
  private readonly vendorComponentPattern = 'src/components/vendor/**/*.{ts,tsx}';
  private readonly vendorPagePattern = 'src/pages/vendor/**/*.{ts,tsx}';
  
  // Enhanced regex patterns for different string types
  private readonly patterns = {
    // JSX text content: >text< or >text with spaces<
    jsxText: /(?<=>)\s*([^<{}\n]+?\w[^<{}\n]*?)\s*(?=<)/g,
    
    // String literals in quotes (excluding translation keys and common patterns)
    stringLiterals: /"([^"\\]*(\\.[^"\\]*)*)"(?!\s*[,\]\}])|'([^'\\]*(\\.[^'\\]*)*)'(?!\s*[,\]\}])/g,
    
    // Template literals with text
    templateLiterals: /`([^`\\]*(\\.[^`\\]*)*)`/g,
    
    // JSX attributes with hardcoded text (excluding standard HTML attributes)
    jsxAttributes: /(\w+)=["']([^"']*[a-zA-Z][^"']*)["']/g,
    
    // Placeholder text patterns
    placeholders: /placeholder\s*=\s*["']([^"']+)["']/g,
    
    // Alt text and aria labels
    altText: /(?:alt|aria-label)\s*=\s*["']([^"']+)["']/g,
    
    // Toast/notification messages
    notifications: /(?:title|description|message)\s*:\s*["']([^"']+)["']/g
  };

  // Patterns to ignore (common false positives)
  private readonly ignorePatterns = [
    /^[a-z]+\.[a-z.]+$/,  // Translation keys like 'common.save'
    /^#[0-9a-fA-F]{3,8}$/, // Color codes
    /^https?:\/\//, // URLs
    /^\d+(?:px|em|rem|%|vh|vw)$/, // CSS units
    /^[A-Z_][A-Z0-9_]*$/, // Constants
    /^className$|^id$|^key$|^type$|^role$/, // Standard HTML attributes
    /^(?:div|span|p|h[1-6]|button|input|form)$/i, // HTML tags
    /^(?:en|ar|ltr|rtl)$/i, // Language codes
    /^t\(/, // Translation function calls
  ];

  async scanVendorComponents(): Promise<HardcodedStringIssue[]> {
    const issues: HardcodedStringIssue[] = [];
    
    // Get all vendor component files
    const componentFiles = await glob(this.vendorComponentPattern);
    const pageFiles = await glob(this.vendorPagePattern);
    const allFiles = [...componentFiles, ...pageFiles];
    
    console.log(`Scanning ${allFiles.length} vendor files for hardcoded strings...`);
    
    for (const file of allFiles) {
      const fileIssues = await this.scanFile(file);
      issues.push(...fileIssues);
    }
    
    return this.deduplicateAndPrioritize(issues);
  }

  private async scanFile(filePath: string): Promise<HardcodedStringIssue[]> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const issues: HardcodedStringIssue[] = [];
    
    // Check each line for hardcoded strings
    lines.forEach((line, lineIndex) => {
      // Skip comments and imports
      if (this.shouldSkipLine(line)) return;
      
      // Check for different types of hardcoded strings
      this.checkJSXText(line, lineIndex, filePath, issues);
      this.checkStringLiterals(line, lineIndex, filePath, issues);
      this.checkTemplateStrings(line, lineIndex, filePath, issues);
      this.checkJSXAttributes(line, lineIndex, filePath, issues);
    });
    
    return issues;
  }

  private shouldSkipLine(line: string): boolean {
    const trimmed = line.trim();
    return (
      trimmed.startsWith('//') ||
      trimmed.startsWith('/*') ||
      trimmed.startsWith('*') ||
      trimmed.startsWith('import ') ||
      trimmed.startsWith('export ') ||
      trimmed.includes('console.') ||
      trimmed.includes('eslint-disable') ||
      trimmed.length < 3
    );
  }

  private checkJSXText(line: string, lineIndex: number, filePath: string, issues: HardcodedStringIssue[]): void {
    const matches = [...line.matchAll(this.patterns.jsxText)];
    
    matches.forEach(match => {
      const text = match[1]?.trim();
      if (text && !this.shouldIgnoreString(text) && this.containsReadableText(text)) {
        issues.push({
          file: filePath,
          line: lineIndex + 1,
          column: match.index || 0,
          text,
          severity: this.getSeverity(text, 'jsx'),
          type: 'jsx',
          context: line.trim()
        });
      }
    });
  }

  private checkStringLiterals(line: string, lineIndex: number, filePath: string, issues: HardcodedStringIssue[]): void {
    const matches = [...line.matchAll(this.patterns.stringLiterals)];
    
    matches.forEach(match => {
      const text = match[1] || match[3]; // Handle both single and double quotes
      if (text && !this.shouldIgnoreString(text) && this.containsReadableText(text)) {
        // Skip if it's part of a translation function call
        const beforeMatch = line.substring(0, match.index || 0);
        if (beforeMatch.includes('t(') || beforeMatch.includes('getTranslation(')) return;
        
        issues.push({
          file: filePath,
          line: lineIndex + 1,
          column: match.index || 0,
          text,
          severity: this.getSeverity(text, 'literal'),
          type: 'literal',
          context: line.trim()
        });
      }
    });
  }

  private checkTemplateStrings(line: string, lineIndex: number, filePath: string, issues: HardcodedStringIssue[]): void {
    const matches = [...line.matchAll(this.patterns.templateLiterals)];
    
    matches.forEach(match => {
      const text = match[1];
      if (text && !this.shouldIgnoreString(text) && this.containsReadableText(text)) {
        issues.push({
          file: filePath,
          line: lineIndex + 1,
          column: match.index || 0,
          text,
          severity: this.getSeverity(text, 'template'),
          type: 'template',
          context: line.trim()
        });
      }
    });
  }

  private checkJSXAttributes(line: string, lineIndex: number, filePath: string, issues: HardcodedStringIssue[]): void {
    const matches = [...line.matchAll(this.patterns.jsxAttributes)];
    
    matches.forEach(match => {
      const attrName = match[1];
      const attrValue = match[2];
      
      // Focus on user-facing attributes
      if (this.isUserFacingAttribute(attrName) && 
          !this.shouldIgnoreString(attrValue) && 
          this.containsReadableText(attrValue)) {
        issues.push({
          file: filePath,
          line: lineIndex + 1,
          column: match.index || 0,
          text: attrValue,
          severity: this.getSeverity(attrValue, 'attribute'),
          type: 'attribute',
          context: `${attrName}="${attrValue}"`
        });
      }
    });
  }

  private shouldIgnoreString(text: string): boolean {
    return this.ignorePatterns.some(pattern => pattern.test(text));
  }

  private containsReadableText(text: string): boolean {
    // Must contain at least one letter and be longer than 2 characters
    return /[a-zA-Z]/.test(text) && text.length > 2 && !/^[0-9\s\-_.]+$/.test(text);
  }

  private isUserFacingAttribute(attrName: string): boolean {
    const userFacingAttrs = [
      'placeholder', 'title', 'alt', 'aria-label', 'aria-describedby',
      'label', 'tooltip', 'description', 'text'
    ];
    return userFacingAttrs.includes(attrName.toLowerCase());
  }

  private getSeverity(text: string, type: string): 'high' | 'medium' | 'low' {
    // High severity: User-facing text that should definitely be translated
    if (type === 'jsx' || 
        (type === 'attribute' && text.length > 5) ||
        text.includes('Error') || 
        text.includes('Success') ||
        text.includes('Please') ||
        text.includes('Click')) {
      return 'high';
    }
    
    // Medium severity: Likely user-facing but might be acceptable
    if (text.length > 10 || type === 'template') {
      return 'medium';
    }
    
    return 'low';
  }

  private deduplicateAndPrioritize(issues: HardcodedStringIssue[]): HardcodedStringIssue[] {
    // Remove duplicates based on file + text combination
    const seen = new Set<string>();
    const unique = issues.filter(issue => {
      const key = `${issue.file}:${issue.text}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    
    // Sort by severity, then by file
    return unique.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (severityDiff !== 0) return severityDiff;
      return a.file.localeCompare(b.file);
    });
  }

  // Generate summary statistics
  generateSummary(issues: HardcodedStringIssue[]) {
    const stats = {
      total: issues.length,
      high: issues.filter(i => i.severity === 'high').length,
      medium: issues.filter(i => i.severity === 'medium').length,
      low: issues.filter(i => i.severity === 'low').length,
      byType: {
        jsx: issues.filter(i => i.type === 'jsx').length,
        literal: issues.filter(i => i.type === 'literal').length,
        template: issues.filter(i => i.type === 'template').length,
        attribute: issues.filter(i => i.type === 'attribute').length
      },
      byFile: issues.reduce((acc, issue) => {
        acc[issue.file] = (acc[issue.file] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    
    return stats;
  }
}

export const hardcodedStringScanner = new HardcodedStringScanner();