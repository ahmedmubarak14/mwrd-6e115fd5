# i18n Testing Guide

## Overview

This guide covers the comprehensive testing strategy for internationalization (i18n) in the project, including unit tests, integration tests, and end-to-end tests.

## Test Structure

```
src/
├── contexts/__tests__/
│   └── LanguageContext.test.tsx    # Unit tests for language context
├── constants/__tests__/
│   └── translations.test.ts         # Translation utility tests
tests/
└── i18n/
    ├── language-switching.spec.ts   # E2E language switching tests
    └── translation-validation.spec.ts # E2E translation validation
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### E2E Tests Only
```bash
npm run test:e2e
```

### Specific Test File
```bash
npm test -- src/contexts/__tests__/LanguageContext.test.tsx
```

### Watch Mode
```bash
npm test -- --watch
```

## Unit Tests

### LanguageContext Tests

Tests the core functionality of the language context provider.

**Coverage:**
- ✅ Hook initialization and error handling
- ✅ Language loading from localStorage
- ✅ Language switching (EN ↔ AR)
- ✅ Document attribute updates (lang, dir, class)
- ✅ Font family changes
- ✅ RTL flag behavior
- ✅ Number formatting
- ✅ Date formatting
- ✅ Currency formatting

**Example:**
```typescript
it('should switch from English to Arabic', () => {
  const { result } = renderHook(() => useLanguage(), {
    wrapper: LanguageProvider
  });

  act(() => {
    result.current.setLanguage('ar');
  });

  expect(result.current.language).toBe('ar');
  expect(result.current.isRTL).toBe(true);
});
```

### Translation Utility Tests

Tests translation file integrity and coverage.

**Coverage:**
- ✅ Translation key retrieval
- ✅ Nested key handling
- ✅ Missing key fallback
- ✅ English-Arabic key parity
- ✅ No empty translations
- ✅ All values are strings
- ✅ No RTL markers in wrong places

**Example:**
```typescript
it('should have matching keys in English and Arabic', () => {
  const enKeys = getNestedKeys(enUS);
  const arKeys = getNestedKeys(arSA);

  const missingInArabic = enKeys.filter(key => !arKeys.has(key));
  const missingInEnglish = arKeys.filter(key => !enKeys.has(key));

  expect(missingInArabic).toEqual([]);
  expect(missingInEnglish).toEqual([]);
});
```

## E2E Tests

### Language Switching Tests

Tests real browser behavior when switching languages.

**Coverage:**
- ✅ Language switcher functionality
- ✅ Persistence across page reloads
- ✅ UI text updates
- ✅ Document attributes (lang, dir)
- ✅ Body classes
- ✅ Font family application
- ✅ RTL layout behavior
- ✅ Flex layout mirroring
- ✅ Text alignment in RTL

**Example:**
```typescript
test('should persist language preference on page reload', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('language', 'ar'));
  await page.reload();
  
  const htmlLang = await page.getAttribute('html', 'lang');
  expect(htmlLang).toBe('ar');
});
```

### Translation Validation Tests

Tests that translations are properly displayed in the UI.

**Coverage:**
- ✅ No untranslated keys visible
- ✅ Proper language display (EN/AR)
- ✅ No inappropriate language mixing
- ✅ Number formatting
- ✅ Date formatting
- ✅ Toast messages
- ✅ Form validation messages

**Example:**
```typescript
test('should not have untranslated keys visible in UI', async ({ page }) => {
  await page.goto('/');
  const bodyText = await page.locator('body').textContent();
  
  // Should not contain keys like "common.actions.save"
  expect(bodyText).not.toMatch(/\w+\.\w+\.\w+/g);
});
```

## Test Data Generators

### Creating Test Translation Files

For testing purposes, you can create mock translation files:

```typescript
// test-utils/mockTranslations.ts
export const mockEnUS = {
  test: {
    key: "Test Value",
    nested: {
      deep: "Deep Value"
    }
  }
};

export const mockArSA = {
  test: {
    key: "قيمة اختبارية",
    nested: {
      deep: "قيمة عميقة"
    }
  }
};
```

## Coverage Requirements

### Minimum Coverage Targets

- **Unit Tests**: 80% coverage
- **Integration Tests**: Key user flows covered
- **E2E Tests**: Critical paths tested

### Checking Coverage

```bash
npm run test:coverage
```

## Continuous Integration

### Pre-commit Checks

```bash
# Automatically runs on commit
npm run test:i18n
npm run validate:i18n
npm run check:translations
```

### CI Pipeline

```yaml
# .github/workflows/i18n-tests.yml
name: i18n Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run test:i18n
      - run: npm run validate:i18n
      - run: npm run check:translations
```

## Writing New Tests

### Unit Test Template

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';

describe('Feature Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### E2E Test Template

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something specific', async ({ page }) => {
    // Act
    await page.click('button');
    
    // Assert
    await expect(page.locator('.result')).toBeVisible();
  });
});
```

## Debugging Tests

### Running Tests in Debug Mode

```bash
# Vitest debug
npm test -- --inspect-brk

# Playwright debug
npm run test:e2e -- --debug
```

### Viewing Test UI

```bash
# Vitest UI
npm run test:ui

# Playwright UI
npm run test:e2e -- --ui
```

## Common Issues and Solutions

### Issue: Tests failing due to localStorage

**Solution:** Mock localStorage in test setup
```typescript
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;
```

### Issue: E2E tests timing out

**Solution:** Increase timeout and add explicit waits
```typescript
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  await page.waitForLoadState('networkidle');
});
```

### Issue: Inconsistent translation tests

**Solution:** Use snapshot testing
```typescript
expect(translations).toMatchSnapshot();
```

## Best Practices

### DO ✅

- Test both languages for each feature
- Test RTL-specific behavior
- Test persistence mechanisms
- Use descriptive test names
- Test error scenarios
- Mock external dependencies
- Use test data generators

### DON'T ❌

- Test implementation details
- Write flaky tests
- Skip accessibility testing
- Ignore edge cases
- Hard-code test data
- Test third-party libraries
- Write tests without assertions

## Performance Testing

### Translation Loading Performance

```typescript
test('should load translations quickly', async () => {
  const start = performance.now();
  const translation = getTranslation('common.actions.save', 'en');
  const end = performance.now();
  
  expect(end - start).toBeLessThan(10); // Less than 10ms
});
```

### Language Switching Performance

```typescript
test('should switch languages quickly', async ({ page }) => {
  const start = Date.now();
  
  await page.click('[data-testid="language-switcher"]');
  await page.waitForSelector('[lang="ar"]');
  
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(1000); // Less than 1 second
});
```

## Accessibility Testing

### Screen Reader Testing

```typescript
test('should have correct lang and dir attributes', async ({ page }) => {
  await page.goto('/');
  
  const lang = await page.getAttribute('html', 'lang');
  const dir = await page.getAttribute('html', 'dir');
  
  expect(lang).toBeTruthy();
  expect(['ltr', 'rtl']).toContain(dir);
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Testing](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [i18n Testing Best Practices](https://react.i18next.com/guides/testing)

## Support

For testing issues:
1. Check this guide
2. Run `npm test -- --help`
3. Review test logs
4. Consult the team
5. Create an issue with test reproduction steps
