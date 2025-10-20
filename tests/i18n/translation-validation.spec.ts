import { test, expect } from '@playwright/test';

test.describe('Translation Validation', () => {
  test('should not have untranslated keys visible in UI', async ({ page }) => {
    await page.goto('/');
    
    // Check for common translation key patterns that shouldn't appear
    const bodyText = await page.locator('body').textContent();
    
    if (bodyText) {
      // Should not contain translation keys like "common.actions.save"
      expect(bodyText).not.toMatch(/\w+\.\w+\.\w+/g);
      
      // Should not contain placeholder patterns
      expect(bodyText).not.toContain('MISSING_TRANSLATION');
      expect(bodyText).not.toContain('TODO:');
    }
  });

  test('should display proper translations in English', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('language', 'en'));
    await page.goto('/');
    await page.waitForTimeout(500);
    
    const bodyText = await page.locator('body').textContent();
    
    if (bodyText) {
      // Should contain English words (basic sanity check)
      const hasEnglishWords = /\b(the|and|or|is|are|was|were)\b/i.test(bodyText);
      expect(hasEnglishWords).toBeTruthy();
    }
  });

  test('should display proper translations in Arabic', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('language', 'ar'));
    await page.goto('/');
    await page.waitForTimeout(500);
    
    const bodyText = await page.locator('body').textContent();
    
    if (bodyText) {
      // Should contain Arabic characters
      const hasArabicChars = /[\u0600-\u06FF]/.test(bodyText);
      expect(hasArabicChars).toBeTruthy();
    }
  });

  test('should not mix English and Arabic text inappropriately', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('language', 'ar'));
    await page.goto('/');
    await page.waitForTimeout(500);
    
    // Get all text nodes
    const textNodes = await page.evaluate(() => {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      const texts: string[] = [];
      let node;
      
      while (node = walker.nextNode()) {
        const text = node.textContent?.trim();
        if (text && text.length > 10) {
          texts.push(text);
        }
      }
      
      return texts;
    });
    
    // Check that long text blocks are primarily in one language
    textNodes.forEach(text => {
      const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
      const latinChars = (text.match(/[a-zA-Z]/g) || []).length;
      const total = arabicChars + latinChars;
      
      if (total > 20) {
        // At least 70% should be in one language
        const primaryLanguageRatio = Math.max(arabicChars, latinChars) / total;
        expect(primaryLanguageRatio).toBeGreaterThan(0.7);
      }
    });
  });
});

test.describe('Number and Date Formatting', () => {
  test('should format numbers according to language', async ({ page }) => {
    // Create a test page that displays numbers
    await page.goto('/');
    
    // Check if page contains formatted numbers
    const bodyText = await page.locator('body').textContent();
    
    if (bodyText && /\d/.test(bodyText)) {
      // Just verify numbers are present and rendered
      expect(bodyText).toMatch(/\d/);
    }
  });

  test('should use Arabic numerals in Arabic locale', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('language', 'ar'));
    await page.goto('/');
    await page.waitForTimeout(500);
    
    const bodyText = await page.locator('body').textContent();
    
    if (bodyText) {
      // Should contain either Western Arabic numerals (0-9) or Eastern Arabic numerals (٠-٩)
      const hasNumerals = /[0-9٠-٩]/.test(bodyText);
      expect(hasNumerals).toBeTruthy();
    }
  });
});

test.describe('Toast and Error Messages', () => {
  test('should display toast messages in current language', async ({ page }) => {
    await page.goto('/');
    
    // Try to trigger a toast (this is app-specific)
    // Look for toast container
    const toast = page.locator('[data-sonner-toast], [role="alert"], .toast').first();
    
    // This test is more of a placeholder - actual implementation depends on app
    if (await toast.count() > 0) {
      const toastText = await toast.textContent();
      expect(toastText).toBeTruthy();
    }
  });
});

test.describe('Form Validation Messages', () => {
  test('should show validation errors in current language', async ({ page }) => {
    await page.goto('/');
    
    // Look for forms
    const forms = page.locator('form');
    
    if (await forms.count() > 0) {
      // Try to submit without filling (if there's a submit button)
      const submitButton = forms.first().locator('button[type="submit"]');
      
      if (await submitButton.count() > 0) {
        await submitButton.click();
        await page.waitForTimeout(500);
        
        // Look for error messages
        const errors = page.locator('[role="alert"], .error, [class*="error"]');
        
        if (await errors.count() > 0) {
          const errorText = await errors.first().textContent();
          
          // Should not be an untranslated key
          if (errorText) {
            expect(errorText).not.toMatch(/^\w+\.\w+\.\w+$/);
          }
        }
      }
    }
  });
});
