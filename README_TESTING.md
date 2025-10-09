# Testing Framework Documentation

## Overview
This project uses a comprehensive testing strategy with unit tests (Vitest), integration tests, and E2E tests (Playwright).

## Quick Start

### Install Dependencies
```bash
npm install
```

### Run Tests
```bash
# Run all unit tests
npm run test:unit

# Run unit tests in watch mode
npm run test:unit:watch

# Run unit tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui

# Run specific E2E test file
npx playwright test tests/e2e/auth.spec.ts
```

## Test Structure

### Unit/Integration Tests (`src/tests/`)
- **Setup**: `src/tests/setup.ts` - Global test configuration
- **Utils**: `src/tests/utils/` - Test helpers and factories
- **Test files**: Co-located with source files (`.test.tsx` or `.spec.tsx`)

### E2E Tests (`tests/e2e/`)
- **auth.spec.ts**: Authentication flow tests
- **kyc.spec.ts**: KYC submission flow tests
- **rfq-flow.spec.ts**: RFQ creation and bidding tests

## Test Data

### Test Users
Create test users in Supabase Dashboard first, then use `scripts/seed-test-data.sql`:

```
testclient@example.com / TestPass123!
testvendor@example.com / TestPass123!
testadmin@example.com / TestPass123!
```

### Data Factories
Use `src/tests/utils/test-data-factory.ts` for generating mock data:

```typescript
import { createMockUser, createMockRequest } from '@/tests/utils/test-data-factory';

const user = createMockUser({ role: 'client' });
const request = createMockRequest(user.id);
```

## Writing Tests

### Unit Test Example
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill('test@example.com');
  await page.getByLabel(/password/i).fill('password123');
  await page.getByRole('button', { name: /sign in/i }).click();
  
  await expect(page).toHaveURL('/dashboard');
});
```

## CI/CD Integration

GitHub Actions automatically runs:
1. **Linting** - Code style checks
2. **Unit Tests** - All Vitest tests with coverage
3. **Type Checking** - TypeScript validation
4. **E2E Tests** - Playwright tests in headless mode
5. **Security Audit** - npm audit for vulnerabilities
6. **Build** - Production build verification

## Coverage Goals
- **Target**: 50% code coverage (Phase 2)
- **Critical paths**: 80%+ coverage
  - Authentication flows
  - KYC submission
  - RFQ/Bidding workflows
  - Payment processing

## Test Environment

### Environment Variables
Create `.env.test` for test-specific configuration:
```env
VITE_SUPABASE_URL=https://jpxqywtitjjphkiuokov.supabase.co
VITE_SUPABASE_ANON_KEY=your_test_anon_key
```

### Browser Testing
Playwright supports multiple browsers and locales:
- Chrome (EN, AR)
- Firefox (EN, AR)
- Safari (EN, AR)

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Always clean up test data
3. **Mocking**: Mock external services (Supabase, APIs)
4. **Selectors**: Use semantic selectors (roles, labels)
5. **Async**: Properly await async operations
6. **Descriptions**: Clear test names and descriptions

## Debugging

### Vitest UI
```bash
npm run test:unit:ui
```

### Playwright UI Mode
```bash
npm run test:e2e:ui
```

### Debug Specific Test
```bash
npx playwright test auth.spec.ts --debug
```

## Troubleshooting

### Tests Failing Locally
1. Clear browser cache: `npx playwright install --with-deps`
2. Check environment variables
3. Verify test database has seed data

### Tests Passing Locally but Failing in CI
1. Check for timing issues (add proper waits)
2. Verify environment differences
3. Check for hardcoded values (use dynamic selectors)

## Next Steps
- [ ] Add visual regression testing
- [ ] Implement load testing
- [ ] Add security penetration testing
- [ ] Expand E2E test coverage to 80%
