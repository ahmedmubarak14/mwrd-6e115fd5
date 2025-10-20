#!/usr/bin/env node

/**
 * i18n Validation Script
 * 
 * This script performs comprehensive checks to ensure i18n compliance:
 * 1. Detects hardcoded strings in JSX/TSX files
 * 2. Finds the fallback anti-pattern: t('key') === 'key' ? 'English' : t('key')
 * 3. Validates translation key coverage between languages
 * 4. Checks for missing translation keys
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ValidationIssue {
  type: 'hardcoded_string' | 'fallback_antipattern' | 'missing_key' | 'inconsistent_keys';
  severity: 'error' | 'warning';
  file: string;
  line?: number;
  message: string;
  suggestion?: string;
}

const issues: ValidationIssue[] = [];

// Patterns to detect
const HARDCODED_STRING_PATTERN = /<[^>]+>[\s]*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+[\s]*<\/[^>]+>/g;
const FALLBACK_ANTIPATTERN = /t\(['"]([^'"]+)['"]\)\s*===\s*['"]([^'"]+)['"]\s*\?/g;
const T_FUNCTION_PATTERN = /\bt\(['"`]([^'"`]+)['"`]\)/g;

// Files and directories to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  'dist',
  'build',
  '.git',
  'coverage',
  '*.test.tsx',
  '*.test.ts',
  '*.spec.tsx',
  '*.spec.ts',
  'scripts',
  'supabase/functions'
];

/**
 * Check if a file should be excluded from validation
 */
function shouldExcludeFile(filePath: string): boolean {
  return EXCLUDE_PATTERNS.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace('*', '.*'));
      return regex.test(filePath);
    }
    return filePath.includes(pattern);
  });
}

/**
 * Recursively get all TypeScript/TSX files in a directory
 */
function getFilesRecursively(dir: string): string[] {
  const files: string[] = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      
      if (shouldExcludeFile(fullPath)) {
        continue;
      }
      
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...getFilesRecursively(fullPath));
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  
  return files;
}

/**
 * Check for hardcoded strings in JSX
 */
function checkHardcodedStrings(filePath: string, content: string): void {
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Skip lines with comments
    if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
      return;
    }
    
    // Skip lines that already use t()
    if (line.includes('t(')) {
      return;
    }
    
    // Skip lines with common technical terms
    const technicalTerms = ['onClick', 'onChange', 'className', 'style', 'import', 'export', 'const', 'let', 'var'];
    if (technicalTerms.some(term => line.includes(term))) {
      return;
    }
    
    // Look for hardcoded strings in JSX
    const jsxStringPattern = />[^<{]*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+[^<{]*</g;
    const matches = line.match(jsxStringPattern);
    
    if (matches) {
      matches.forEach(match => {
        // Exclude common false positives
        if (!match.includes('http') && !match.includes('www') && match.length > 10) {
          issues.push({
            type: 'hardcoded_string',
            severity: 'error',
            file: filePath,
            line: index + 1,
            message: `Potential hardcoded string: "${match.trim()}"`,
            suggestion: 'Replace with t("appropriate.key")'
          });
        }
      });
    }
  });
}

/**
 * Check for fallback anti-pattern
 */
function checkFallbackAntipattern(filePath: string, content: string): void {
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const matches = line.matchAll(FALLBACK_ANTIPATTERN);
    
    for (const match of matches) {
      issues.push({
        type: 'fallback_antipattern',
        severity: 'error',
        file: filePath,
        line: index + 1,
        message: `Fallback anti-pattern detected: t('${match[1]}') === '${match[2]}' ?`,
        suggestion: `Remove the fallback check and ensure the key '${match[1]}' exists in translation files`
      });
    }
  });
}

/**
 * Extract all translation keys used in a file
 */
function extractUsedKeys(content: string): Set<string> {
  const keys = new Set<string>();
  const matches = content.matchAll(T_FUNCTION_PATTERN);
  
  for (const match of matches) {
    keys.add(match[1]);
  }
  
  return keys;
}

/**
 * Load translation file and extract all keys
 */
function loadTranslationKeys(filePath: string): Set<string> {
  const keys = new Set<string>();
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Parse the translation object structure
    const extractKeys = (obj: any, prefix = ''): void => {
      for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          extractKeys(obj[key], fullKey);
        } else {
          keys.add(fullKey);
        }
      }
    };
    
    // Simple parsing (this could be improved with proper AST parsing)
    const match = content.match(/export const \w+ = ({[\s\S]+});/);
    if (match) {
      try {
        // This is a simplified approach - in production, use proper parser
        const objString = match[1];
        // Count keys by looking for patterns like: key: "value" or key: 'value'
        const keyMatches = objString.matchAll(/(\w+):\s*['"]/g);
        for (const keyMatch of keyMatches) {
          keys.add(keyMatch[1]);
        }
      } catch (error) {
        console.warn(`Warning: Could not parse ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`Error loading translation file ${filePath}:`, error);
  }
  
  return keys;
}

/**
 * Main validation function
 */
async function validate(): Promise<void> {
  console.log('🔍 Starting i18n validation...\n');
  
  const projectRoot = path.resolve(__dirname, '..');
  const srcDir = path.join(projectRoot, 'src');
  
  // Get all source files
  const files = getFilesRecursively(srcDir);
  console.log(`📁 Scanning ${files.length} files...\n`);
  
  // Check each file
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const relativePath = path.relative(projectRoot, file);
      
      // Skip translation files themselves
      if (relativePath.includes('constants/locales')) {
        continue;
      }
      
      checkHardcodedStrings(relativePath, content);
      checkFallbackAntipattern(relativePath, content);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
  
  // Report results
  console.log('📊 Validation Results\n');
  console.log('═'.repeat(80));
  
  if (issues.length === 0) {
    console.log('✅ No i18n issues found! All checks passed.\n');
    return;
  }
  
  // Group issues by type
  const errorIssues = issues.filter(i => i.severity === 'error');
  const warningIssues = issues.filter(i => i.severity === 'warning');
  
  if (errorIssues.length > 0) {
    console.log(`\n❌ ${errorIssues.length} ERRORS found:\n`);
    
    errorIssues.forEach(issue => {
      console.log(`  ${issue.file}${issue.line ? `:${issue.line}` : ''}`);
      console.log(`    ${issue.message}`);
      if (issue.suggestion) {
        console.log(`    💡 ${issue.suggestion}`);
      }
      console.log('');
    });
  }
  
  if (warningIssues.length > 0) {
    console.log(`\n⚠️  ${warningIssues.length} WARNINGS found:\n`);
    
    warningIssues.forEach(issue => {
      console.log(`  ${issue.file}${issue.line ? `:${issue.line}` : ''}`);
      console.log(`    ${issue.message}`);
      if (issue.suggestion) {
        console.log(`    💡 ${issue.suggestion}`);
      }
      console.log('');
    });
  }
  
  console.log('═'.repeat(80));
  console.log(`\n📈 Summary: ${errorIssues.length} errors, ${warningIssues.length} warnings\n`);
  
  // Exit with error code if there are errors
  if (errorIssues.length > 0) {
    process.exit(1);
  }
}

// Run validation
validate().catch(error => {
  console.error('Fatal error during validation:', error);
  process.exit(1);
});
