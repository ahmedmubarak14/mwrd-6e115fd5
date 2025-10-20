# i18n Validation and CI Guide

## Overview

This project includes comprehensive validation tools to ensure i18n compliance and prevent common mistakes like hardcoded strings and missing translations.

## Validation Tools

### 1. i18n Validator (`scripts/validate-i18n.ts`)

**Purpose**: Detects common i18n violations in the codebase.

**What it checks:**
- ✅ Hardcoded strings in JSX components
- ✅ Fallback anti-pattern: `t('key') === 'key' ? 'English' : t('key')`
- ✅ Missing translation keys
- ✅ Inconsistent translation usage

**Usage:**
```bash
npm run validate:i18n
```

**When it runs:**
- Automatically on every commit (pre-commit hook)
- Can be run manually during development
- Part of CI/CD pipeline

### 2. Translation Coverage Checker (`scripts/check-translation-coverage.ts`)

**Purpose**: Ensures all translation keys exist in all supported languages.

**What it checks:**
- ✅ Keys present in English but missing in Arabic
- ✅ Keys present in Arabic but missing in English
- ✅ Overall translation coverage percentage
- ✅ Orphaned keys (keys that exist in one language only)

**Usage:**
```bash
npm run check:translations
```

### 3. ESLint i18n Rules (`.eslintrc.i18n.js`)

**Purpose**: Real-time i18n validation during development.

**What it checks:**
- ✅ Hardcoded strings in JSX (shows warnings in IDE)
- ✅ Dynamic translation keys (anti-pattern)
- ✅ Console logging of user data

**Integration:**
- Automatically runs in IDE with ESLint extension
- Shows warnings/errors inline while coding
- Can be run with: `npm run lint`

## Pre-commit Hooks

### Setup

The project uses Husky to run validation checks before every commit:

```bash
# Install Husky (if not already installed)
npm install --save-dev husky

# Enable Git hooks
npx husky install

# Make the pre-commit hook executable
chmod +x .husky/pre-commit
```

### What happens on commit:

1. **i18n Validation** runs automatically
2. If violations are found, commit is **blocked**
3. Error messages show:
   - File and line number of the issue
   - Description of the problem
   - Suggested fix

### Bypassing validation (not recommended):

```bash
# Only use in emergencies
git commit --no-verify -m "message"
```

## Common Issues and Fixes

### Issue 1: Hardcoded String Detected

**Error:**
```
❌ Potential hardcoded string: "Create New Request"
   💡 Replace with t("appropriate.key")
```

**Fix:**
```tsx
// ❌ Before
<Button>Create New Request</Button>

// ✅ After
<Button>{t('requests.createNew')}</Button>
```

### Issue 2: Fallback Anti-Pattern

**Error:**
```
❌ Fallback anti-pattern detected: t('dashboard.title') === 'dashboard.title' ?
   💡 Remove the fallback check and ensure the key exists in translation files
```

**Fix:**
```tsx
// ❌ Before
const title = t('dashboard.title') === 'dashboard.title' 
  ? 'Dashboard' 
  : t('dashboard.title');

// ✅ After
const title = t('dashboard.title');
```

### Issue 3: Missing Translation Key

**Error:**
```
❌ Missing in Arabic: requests.actions.approve
```

**Fix:**
1. Open `src/constants/locales/ar-SA.ts`
2. Add the missing key:
```typescript
requests: {
  actions: {
    approve: "موافق" // Add Arabic translation
  }
}
```

### Issue 4: Dynamic Translation Keys

**Error:**
```
⚠️  Avoid dynamic translation keys
```

**Fix:**
```tsx
// ❌ Before (dynamic key)
const status = 'active';
<span>{t(`status.${status}`)}</span>

// ✅ After (static keys with logic)
<span>
  {status === 'active' && t('status.active')}
  {status === 'inactive' && t('status.inactive')}
</span>
```

## Adding New Translations

### Step 1: Add to English
```typescript
// src/constants/locales/en-US.ts
export const enUS = {
  // ... existing keys
  newFeature: {
    title: "New Feature",
    description: "This is a new feature"
  }
};
```

### Step 2: Add to Arabic
```typescript
// src/constants/locales/ar-SA.ts
export const arSA = {
  // ... existing keys
  newFeature: {
    title: "ميزة جديدة",
    description: "هذه ميزة جديدة"
  }
};
```

### Step 3: Validate
```bash
npm run check:translations
```

## NPM Scripts

Add these to `package.json`:

```json
{
  "scripts": {
    "validate:i18n": "tsx scripts/validate-i18n.ts",
    "check:translations": "tsx scripts/check-translation-coverage.ts",
    "lint:i18n": "eslint --config .eslintrc.i18n.js 'src/**/*.{ts,tsx}'",
    "prepare": "husky install"
  }
}
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: i18n Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run validate:i18n
      - run: npm run check:translations
```

## Best Practices

### DO ✅
- Always use `t()` function for user-facing text
- Use semantic, descriptive translation keys
- Keep translation keys organized by feature/component
- Run validation before committing
- Add new keys to both languages simultaneously

### DON'T ❌
- Use hardcoded strings in JSX
- Use fallback anti-pattern with ternary operators
- Create dynamic translation keys
- Skip validation checks
- Commit code with i18n violations

## Troubleshooting

### Validation script not running

**Solution:**
```bash
# Reinstall Husky
npm uninstall husky
npm install --save-dev husky
npx husky install
chmod +x .husky/pre-commit
```

### False positives in validation

**Solution:**
Add exceptions to the validation script for specific patterns or files.

### Coverage check failing

**Solution:**
1. Run `npm run check:translations` to see missing keys
2. Add the missing keys to the appropriate language file
3. Verify with `npm run check:translations` again

## Monitoring and Metrics

Track these metrics over time:
- Number of i18n violations per commit
- Translation coverage percentage
- Time to fix i18n issues
- Number of hardcoded strings discovered

## Resources

- [React i18n Best Practices](https://react.i18next.com/guides/best-practices)
- [Translation Key Naming Conventions](https://phraseapp.com/blog/posts/translation-keys-naming-conventions/)
- [RTL Web Development](https://rtlstyling.com/)

## Support

For questions or issues with i18n validation:
1. Check this guide first
2. Run `npm run validate:i18n -- --help` for tool-specific help
3. Consult the team's i18n champion
4. Create an issue in the project repository
