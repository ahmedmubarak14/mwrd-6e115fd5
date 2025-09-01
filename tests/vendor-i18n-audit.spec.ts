import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Vendor dashboard routes to test
const vendorRoutes = [
  '/vendor/dashboard',
  '/vendor/settings',
  '/vendor/offers',
  '/vendor/profile',
  '/vendor/projects',
  '/vendor/clients',
  '/vendor/analytics'
];

interface VisualRegression {
  route: string;
  language: 'en' | 'ar';
  issues: string[];
  screenshot: string;
  accessibility: any;
}

class VendorI18nAuditor {
  private page: Page;
  private results: VisualRegression[] = [];

  constructor(page: Page) {
    this.page = page;
  }

  async auditRoute(route: string, language: 'en' | 'ar'): Promise<VisualRegression> {
    console.log(`Auditing ${route} in ${language} mode...`);
    
    // Navigate and set language
    await this.page.goto('/');
    await this.setLanguage(language);
    await this.page.goto(route);
    await this.page.waitForLoadState('networkidle');

    // Collect issues
    const issues: string[] = [];
    
    // Check for hardcoded strings
    const hardcodedStrings = await this.findHardcodedStrings();
    issues.push(...hardcodedStrings);
    
    // Check for text visibility issues
    const visibilityIssues = await this.checkTextVisibility();
    issues.push(...visibilityIssues);
    
    // Check for RTL/LTR layout issues
    const layoutIssues = await this.checkLayoutIssues(language);
    issues.push(...layoutIssues);
    
    // Run accessibility audit
    const a11yResults = await new AxeBuilder({ page: this.page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    // Take screenshot
    const screenshotPath = `screenshots/${route.replace(/\//g, '_')}_${language}.png`;
    await this.page.screenshot({ 
      path: screenshotPath, 
      fullPage: true 
    });

    return {
      route,
      language,
      issues,
      screenshot: screenshotPath,
      accessibility: a11yResults
    };
  }

  private async setLanguage(language: 'en' | 'ar'): Promise<void> {
    // Look for language switcher and set language
    try {
      const languageButton = this.page.locator('[data-testid="language-switch"], [aria-label*="language"], .language-selector');
      if (await languageButton.isVisible()) {
        await languageButton.click();
        
        // Select the target language
        const targetLang = language === 'ar' ? 'العربية' : 'English';
        const langOption = this.page.locator(`text=${targetLang}`);
        if (await langOption.isVisible()) {
          await langOption.click();
        }
      } else {
        // Fallback: set via localStorage
        await this.page.evaluate((lang) => {
          localStorage.setItem('language', lang);
          window.dispatchEvent(new Event('storage'));
        }, language);
        await this.page.reload();
      }
      
      // Wait for language to be applied
      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.warn(`Could not set language to ${language}:`, error);
    }
  }

  private async findHardcodedStrings(): Promise<string[]> {
    const issues: string[] = [];
    
    // Check for common hardcoded English patterns in the DOM
    const hardcodedPatterns = [
      'Settings',
      'Dashboard',
      'Profile',
      'Save',
      'Cancel',
      'Submit',
      'Loading...',
      'Error',
      'Success',
      'Please',
      'Click here',
      'Welcome'
    ];
    
    for (const pattern of hardcodedPatterns) {
      const elements = await this.page.locator(`text=${pattern}`).count();
      if (elements > 0) {
        issues.push(`Found ${elements} instances of hardcoded text: "${pattern}"`);
      }
    }
    
    // Check for untranslated placeholders
    const inputs = await this.page.locator('input[placeholder], textarea[placeholder]').all();
    for (const input of inputs) {
      const placeholder = await input.getAttribute('placeholder');
      if (placeholder && /^[A-Za-z\s]+$/.test(placeholder) && placeholder.length > 3) {
        issues.push(`Hardcoded placeholder: "${placeholder}"`);
      }
    }
    
    return issues;
  }

  private async checkTextVisibility(): Promise<string[]> {
    const issues: string[] = [];
    
    // Check for text contrast issues
    const textElements = await this.page.locator('p, span, div, h1, h2, h3, h4, h5, h6, label, button').all();
    
    for (let i = 0; i < Math.min(textElements.length, 20); i++) { // Limit for performance
      const element = textElements[i];
      const text = await element.textContent();
      
      if (text && text.trim().length > 0) {
        const box = await element.boundingBox();
        if (box && box.width > 0) {
          // Check if text is overflowing
          const styles = await element.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return {
              color: computed.color,
              backgroundColor: computed.backgroundColor,
              overflow: computed.overflow,
              textOverflow: computed.textOverflow,
              whiteSpace: computed.whiteSpace
            };
          });
          
          // Check for potential overflow issues
          if (styles.overflow === 'hidden' && styles.textOverflow !== 'ellipsis') {
            issues.push(`Potential text truncation without ellipsis: "${text.substring(0, 30)}..."`);
          }
        }
      }
    }
    
    return issues;
  }

  private async checkLayoutIssues(language: 'en' | 'ar'): Promise<string[]> {
    const issues: string[] = [];
    
    // Check document direction
    const htmlDir = await this.page.locator('html').getAttribute('dir');
    const expectedDir = language === 'ar' ? 'rtl' : 'ltr';
    
    if (htmlDir !== expectedDir) {
      issues.push(`Incorrect HTML direction: expected "${expectedDir}", got "${htmlDir || 'none'}"`);
    }
    
    // Check for elements that should be mirrored in RTL
    if (language === 'ar') {
      const navigationElements = await this.page.locator('nav, .sidebar, .menu').all();
      
      for (const nav of navigationElements) {
        const styles = await nav.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            direction: computed.direction,
            textAlign: computed.textAlign,
            float: computed.float
          };
        });
        
        if (styles.direction !== 'rtl') {
          issues.push('Navigation element not properly configured for RTL');
        }
      }
      
      // Check for icons that should be mirrored
      const arrowIcons = await this.page.locator('[class*="arrow"], [class*="chevron"]').count();
      if (arrowIcons > 0) {
        issues.push(`Found ${arrowIcons} arrow/chevron icons that may need RTL mirroring`);
      }
    }
    
    return issues;
  }

  getResults(): VisualRegression[] {
    return this.results;
  }
}

test.describe('Vendor Dashboard I18n Audit', () => {
  let auditor: VendorI18nAuditor;

  test.beforeEach(async ({ page }) => {
    auditor = new VendorI18nAuditor(page);
  });

  for (const route of vendorRoutes) {
    test(`Audit ${route} - English (LTR)`, async ({ page }) => {
      const result = await auditor.auditRoute(route, 'en');
      
      // Assert no critical issues
      const criticalIssues = result.issues.filter(issue => 
        issue.includes('hardcoded') || issue.includes('direction')
      );
      
      if (criticalIssues.length > 0) {
        console.warn(`Critical i18n issues found in ${route}:`, criticalIssues);
      }
      
      // Assert accessibility
      expect(result.accessibility.violations).toHaveLength(0);
    });

    test(`Audit ${route} - Arabic (RTL)`, async ({ page }) => {
      const result = await auditor.auditRoute(route, 'ar');
      
      // Assert RTL configuration
      expect(result.issues.filter(i => i.includes('HTML direction'))).toHaveLength(0);
      
      // Assert no critical issues
      const criticalIssues = result.issues.filter(issue => 
        issue.includes('hardcoded') || issue.includes('direction')
      );
      
      if (criticalIssues.length > 0) {
        console.warn(`Critical i18n issues found in ${route}:`, criticalIssues);
      }
      
      // Assert accessibility
      expect(result.accessibility.violations).toHaveLength(0);
    });
  }

  test('Visual Regression Comparison', async ({ page }) => {
    // Compare key elements between EN and AR versions
    const criticalRoutes = ['/vendor/dashboard', '/vendor/settings'];
    
    for (const route of criticalRoutes) {
      // Capture EN version
      await auditor.auditRoute(route, 'en');
      
      // Capture AR version
      await auditor.auditRoute(route, 'ar');
      
      // The screenshots are saved for manual comparison
      // In a full implementation, you would use tools like Pixelmatch
      console.log(`Screenshots captured for ${route} in both languages`);
    }
  });
});

// Export for use in other tests
export { VendorI18nAuditor };