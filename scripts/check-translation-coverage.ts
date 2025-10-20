#!/usr/bin/env node

/**
 * Translation Coverage Checker
 * 
 * Ensures all translation keys exist in all supported languages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TranslationReport {
  totalKeys: number;
  missingInArabic: string[];
  missingInEnglish: string[];
  extraInArabic: string[];
  extraInEnglish: string[];
  coverage: {
    english: number;
    arabic: number;
  };
}

/**
 * Recursively extract all keys from a nested object
 */
function extractKeys(obj: any, prefix = ''): Set<string> {
  const keys = new Set<string>();
  
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      const nestedKeys = extractKeys(obj[key], fullKey);
      nestedKeys.forEach(k => keys.add(k));
    } else {
      keys.add(fullKey);
    }
  }
  
  return keys;
}

/**
 * Load and parse a translation file
 */
async function loadTranslations(filePath: string): Promise<any> {
  try {
    // Dynamic import for ES modules
    const module = await import(filePath);
    return module.enUS || module.arSA || module.default;
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return {};
  }
}

/**
 * Check translation coverage
 */
async function checkCoverage(): Promise<void> {
  console.log('🌍 Checking translation coverage...\n');
  
  const projectRoot = path.resolve(__dirname, '..');
  const localesDir = path.join(projectRoot, 'src', 'constants', 'locales');
  
  // Load translation files
  const enUSPath = path.join(localesDir, 'en-US.ts');
  const arSAPath = path.join(localesDir, 'ar-SA.ts');
  
  if (!fs.existsSync(enUSPath) || !fs.existsSync(arSAPath)) {
    console.error('❌ Translation files not found!');
    process.exit(1);
  }
  
  console.log('📚 Loading translation files...');
  const enTranslations = await loadTranslations(enUSPath);
  const arTranslations = await loadTranslations(arSAPath);
  
  // Extract all keys
  const enKeys = extractKeys(enTranslations);
  const arKeys = extractKeys(arTranslations);
  
  // Find missing keys
  const missingInArabic = [...enKeys].filter(key => !arKeys.has(key));
  const missingInEnglish = [...arKeys].filter(key => !enKeys.has(key));
  const extraInArabic = [...arKeys].filter(key => !enKeys.has(key));
  const extraInEnglish = [...enKeys].filter(key => !arKeys.has(key));
  
  // Calculate coverage
  const totalKeys = Math.max(enKeys.size, arKeys.size);
  const enCoverage = (enKeys.size / totalKeys) * 100;
  const arCoverage = (arKeys.size / totalKeys) * 100;
  
  const report: TranslationReport = {
    totalKeys,
    missingInArabic,
    missingInEnglish,
    extraInArabic,
    extraInEnglish,
    coverage: {
      english: enCoverage,
      arabic: arCoverage
    }
  };
  
  // Display results
  console.log('\n📊 Translation Coverage Report\n');
  console.log('═'.repeat(80));
  
  console.log(`\n📝 Total Translation Keys: ${totalKeys}`);
  console.log(`  🇬🇧 English: ${enKeys.size} keys (${enCoverage.toFixed(1)}% coverage)`);
  console.log(`  🇸🇦 Arabic: ${arKeys.size} keys (${arCoverage.toFixed(1)}% coverage)`);
  
  if (missingInArabic.length > 0) {
    console.log(`\n❌ Missing in Arabic (${missingInArabic.length} keys):`);
    missingInArabic.slice(0, 10).forEach(key => {
      console.log(`   - ${key}`);
    });
    if (missingInArabic.length > 10) {
      console.log(`   ... and ${missingInArabic.length - 10} more`);
    }
  }
  
  if (missingInEnglish.length > 0) {
    console.log(`\n❌ Missing in English (${missingInEnglish.length} keys):`);
    missingInEnglish.slice(0, 10).forEach(key => {
      console.log(`   - ${key}`);
    });
    if (missingInEnglish.length > 10) {
      console.log(`   ... and ${missingInEnglish.length - 10} more`);
    }
  }
  
  console.log('\n═'.repeat(80));
  
  if (missingInArabic.length === 0 && missingInEnglish.length === 0) {
    console.log('\n✅ Perfect! All translation keys are present in both languages.\n');
  } else {
    console.log(`\n⚠️  Action required: ${missingInArabic.length + missingInEnglish.length} missing translations\n`);
    process.exit(1);
  }
}

// Run check
checkCoverage().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
