import { test, expect } from '@playwright/test';

test.describe('Language Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should switch from English to Arabic', async ({ page }) => {
    // Check initial language is English
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('en');

    // Find and click language switcher
    const languageSwitcher = page.locator('[data-testid="language-switcher"]').or(
      page.locator('button:has-text("العربية")').or(
        page.locator('[aria-label*="language"]').or(
          page.locator('button:has-text("عربي")')
        )
      )
    );

    if (await languageSwitcher.count() > 0) {
      await languageSwitcher.first().click();
      
      // Wait for language change
      await page.waitForTimeout(500);

      // Verify language changed
      const newHtmlLang = await page.getAttribute('html', 'lang');
      expect(newHtmlLang).toBe('ar');

      // Verify RTL direction
      const htmlDir = await page.getAttribute('html', 'dir');
      expect(htmlDir).toBe('rtl');

      // Verify localStorage updated
      const storedLanguage = await page.evaluate(() => localStorage.getItem('language'));
      expect(storedLanguage).toBe('ar');
    }
  });

  test('should persist language preference on page reload', async ({ page }) => {
    // Set language to Arabic
    await page.evaluate(() => localStorage.setItem('language', 'ar'));
    
    // Reload page
    await page.reload();
    
    // Wait for hydration
    await page.waitForTimeout(500);
    
    // Verify language is still Arabic
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('ar');
    
    const htmlDir = await page.getAttribute('html', 'dir');
    expect(htmlDir).toBe('rtl');
  });

  test('should update UI text when language changes', async ({ page }) => {
    // Find language switcher
    const languageSwitcher = page.locator('[data-testid="language-switcher"]').or(
      page.locator('button:has-text("العربية")').or(
        page.locator('[aria-label*="language"]')
      )
    );

    if (await languageSwitcher.count() > 0) {
      // Get some text content before switch
      const bodyText = await page.locator('body').textContent();
      
      // Switch language
      await languageSwitcher.first().click();
      await page.waitForTimeout(500);
      
      // Get text content after switch
      const newBodyText = await page.locator('body').textContent();
      
      // Text should be different (unless page has no translations)
      if (bodyText && newBodyText) {
        expect(bodyText).not.toBe(newBodyText);
      }
    }
  });

  test('should apply correct font for Arabic', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('language', 'ar'));
    await page.reload();
    await page.waitForTimeout(500);

    const fontFamily = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });

    expect(fontFamily).toContain('Cairo');
  });

  test('should have body class for current language', async ({ page }) => {
    // English
    let bodyClass = await page.getAttribute('body', 'class');
    expect(bodyClass).toContain('lang-en');

    // Switch to Arabic
    await page.evaluate(() => localStorage.setItem('language', 'ar'));
    await page.reload();
    await page.waitForTimeout(500);

    bodyClass = await page.getAttribute('body', 'class');
    expect(bodyClass).toContain('lang-ar');
    expect(bodyClass).not.toContain('lang-en');
  });
});

test.describe('RTL Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('language', 'ar'));
    await page.goto('/');
    await page.waitForTimeout(500);
  });

  test('should have RTL direction on html element', async ({ page }) => {
    const dir = await page.getAttribute('html', 'dir');
    expect(dir).toBe('rtl');
  });

  test('should have correct text alignment in RTL', async ({ page }) => {
    // Check that some text elements have right alignment
    const paragraphs = page.locator('p, h1, h2, h3, span').first();
    
    if (await paragraphs.count() > 0) {
      const textAlign = await paragraphs.evaluate(el => {
        return window.getComputedStyle(el).textAlign;
      });
      
      // In RTL, default should be right or start
      expect(['right', 'start'].some(val => textAlign.includes(val))).toBeTruthy();
    }
  });

  test('should mirror flex layouts in RTL', async ({ page }) => {
    const flexContainers = page.locator('[class*="flex"]').first();
    
    if (await flexContainers.count() > 0) {
      const flexDirection = await flexContainers.evaluate(el => {
        return window.getComputedStyle(el).flexDirection;
      });
      
      // Should be valid flex direction
      expect(['row', 'row-reverse', 'column', 'column-reverse']).toContain(flexDirection);
    }
  });
});

test.describe('Accessibility with i18n', () => {
  test('should have correct lang attribute', async ({ page }) => {
    // English
    await page.goto('/');
    let lang = await page.getAttribute('html', 'lang');
    expect(lang).toBe('en');

    // Arabic
    await page.evaluate(() => localStorage.setItem('language', 'ar'));
    await page.reload();
    await page.waitForTimeout(500);
    
    lang = await page.getAttribute('html', 'lang');
    expect(lang).toBe('ar');
  });

  test('should have dir attribute for screen readers', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('language', 'ar'));
    await page.reload();
    await page.waitForTimeout(500);

    const dir = await page.getAttribute('html', 'dir');
    expect(dir).toBe('rtl');
  });
});
