#!/usr/bin/env node

/**
 * i18n Validation Script
 * 
 * Validates translation coverage and compliance across the admin dashboard.
 * Run this script before commits to ensure i18n quality.
 * 
 * Usage: node scripts/validate-i18n.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const ADMIN_COMPONENTS_DIR = './src/components/admin';
const TRANSLATION_FILES = {
  en: './src/constants/locales/en-US.ts',
  ar: './src/constants/locales/ar-SA.ts'
};

// Validation results
let validationResults = {
  totalFiles: 0,
  filesWithIssues: 0,
  hardcodedStrings: [],
  missingTranslations: [],
  passed: true
};

/**
 * Recursively find all TypeScript files in a directory
 */
function findTsFiles(dir) {
  let files = [];
  
  if (!fs.existsSync(dir)) {
    console.warn(`Directory ${dir} does not exist`);
    return files;
  }
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files = files.concat(findTsFiles(fullPath));
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Check for hardcoded strings in a file
 */
function checkHardcodedStrings(filePath, content) {
  const issues = [];
  const lines = content.split('\n');
  
  // Patterns to detect hardcoded strings
  const patterns = [
    {
      name: 'Long strings in quotes',
      regex: /["'][A-Z][a-zA-Z\s]{15,}["']/g,
      severity: 'high'
    },
    {
      name: 'Hardcoded placeholders', 
      regex: /placeholder=["'][^{][^"']*["']/g,
      severity: 'high'
    },
    {
      name: 'Hardcoded titles',
      regex: /title=["'][^{][^"']*["']/g,
      severity: 'medium'
    },
    {
      name: 'Toast messages',
      regex: /toast\.(success|error|info)\s*\(\s*["']/g,
      severity: 'high'
    }
  ];
  
  patterns.forEach(pattern => {
    lines.forEach((line, index) => {
      const matches = line.match(pattern.regex);
      if (matches) {
        matches.forEach(match => {
          issues.push({
            file: filePath,
            line: index + 1,
            content: match.trim(),
            pattern: pattern.name,
            severity: pattern.severity
          });
        });
      }
    });
  });
  
  return issues;
}

/**
 * Check if file uses translation functions properly
 */
function checkTranslationUsage(filePath, content) {
  const issues = [];
  
  // Check if file uses t() but doesn't import useOptionalLanguage
  if (content.includes('t(') && !content.includes('useOptionalLanguage')) {
    issues.push({
      file: filePath,
      line: 1,
      content: 'Uses t() but missing useOptionalLanguage import',
      pattern: 'Missing import',
      severity: 'high'
    });
  }
  
  // Check for proper RTL handling if component uses layout
  if (content.includes('className') && content.includes('t(') && !content.includes('isRTL')) {
    issues.push({
      file: filePath,
      line: 1,
      content: 'May need RTL layout considerations',
      pattern: 'RTL support',
      severity: 'low'
    });
  }
  
  return issues;
}

/**
 * Validate a single component file
 */
function validateFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [
      ...checkHardcodedStrings(filePath, content),
      ...checkTranslationUsage(filePath, content)
    ];
    
    validationResults.totalFiles++;
    
    if (issues.length > 0) {
      validationResults.filesWithIssues++;
      validationResults.hardcodedStrings.push(...issues);
      
      // Mark as failed if high severity issues found
      const highSeverityIssues = issues.filter(issue => issue.severity === 'high');
      if (highSeverityIssues.length > 0) {
        validationResults.passed = false;
      }
    }
    
    return issues;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Generate validation report
 */
function generateReport() {
  console.log('\n=== Admin Dashboard i18n Validation Report ===\n');
  
  console.log(`📊 Summary:`);
  console.log(`   Total files checked: ${validationResults.totalFiles}`);
  console.log(`   Files with issues: ${validationResults.filesWithIssues}`);
  console.log(`   Total issues found: ${validationResults.hardcodedStrings.length}`);
  
  if (validationResults.hardcodedStrings.length === 0) {
    console.log('\n✅ No i18n issues found! All files are compliant.\n');
    return;
  }
  
  // Group issues by severity
  const issuesBySeverity = validationResults.hardcodedStrings.reduce((acc, issue) => {
    if (!acc[issue.severity]) {
      acc[issue.severity] = [];
    }
    acc[issue.severity].push(issue);
    return acc;
  }, {});
  
  // Report high severity issues
  if (issuesBySeverity.high) {
    console.log(`\n❌ High Priority Issues (${issuesBySeverity.high.length}):`);
    issuesBySeverity.high.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line} - ${issue.pattern}`);
      console.log(`      "${issue.content}"`);
    });
  }
  
  // Report medium severity issues
  if (issuesBySeverity.medium) {
    console.log(`\n⚠️  Medium Priority Issues (${issuesBySeverity.medium.length}):`);
    issuesBySeverity.medium.slice(0, 10).forEach(issue => {
      console.log(`   ${issue.file}:${issue.line} - ${issue.pattern}`);
    });
    
    if (issuesBySeverity.medium.length > 10) {
      console.log(`   ... and ${issuesBySeverity.medium.length - 10} more`);
    }
  }
  
  // Report low severity issues
  if (issuesBySeverity.low) {
    console.log(`\n💡 Low Priority Issues (${issuesBySeverity.low.length}):`);
    console.log(`   Consider addressing these for better RTL support`);
  }
  
  console.log('\n📋 Recommendations:');
  console.log('   1. Replace hardcoded strings with t() function calls');
  console.log('   2. Add translation keys to both en-US.ts and ar-SA.ts');
  console.log('   3. Import useOptionalLanguage hook in components using t()');
  console.log('   4. Consider RTL layout for components with complex layouts');
  
  if (validationResults.passed) {
    console.log('\n✅ Validation passed (no critical issues)\n');
  } else {
    console.log('\n❌ Validation failed (critical issues found)\n');
    process.exit(1);
  }
}

/**
 * Main validation function
 */
function main() {
  console.log('🔍 Starting Admin Dashboard i18n validation...');
  
  // Find and validate all admin component files
  const adminFiles = findTsFiles(ADMIN_COMPONENTS_DIR);
  
  console.log(`Found ${adminFiles.length} files to validate`);
  
  adminFiles.forEach(filePath => {
    validateFile(filePath);
  });
  
  // Generate and display report
  generateReport();
}

// Run validation
main();