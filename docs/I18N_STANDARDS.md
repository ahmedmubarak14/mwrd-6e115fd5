# i18n Standards and Guidelines

## Purpose

This document defines the internationalization (i18n) standards for the MWRD procurement platform. Following these standards ensures consistency, maintainability, and a high-quality multilingual user experience.

## Core Principles

### 1. **Everything Must Be Translatable**
- **Rule**: All user-facing text MUST use the `t()` function
- **No exceptions** for "simple" words or phrases
- **Includes**: Buttons, labels, placeholders, error messages, tooltips, alt text

### 2. **No Hardcoded Strings**
- **Never** use hardcoded English (or any language) text in JSX
- **Always** use translation keys with semantic naming
- **Exception**: Technical identifiers, API endpoints, CSS classes

### 3. **Semantic Translation Keys**
- Use descriptive, hierarchical keys
- Format: `feature.component.element.state`
- Example: `dashboard.metrics.totalRevenue.loading`

### 4. **Consistent Structure**
- Group related translations together
- Mirror component/feature structure
- Use consistent naming conventions

## Translation Key Naming Conventions

### Structure Pattern
```
{module}.{component}.{element}.{variant}
```

### Examples

#### ✅ Good Examples
```typescript
auth.login.button.submit              // "Sign In"
auth.login.button.submitting          // "Signing In..."
dashboard.metrics.revenue.title       // "Total Revenue"
dashboard.metrics.revenue.description // "Revenue from last month"
forms.validation.email.invalid        // "Invalid email address"
forms.validation.email.required       // "Email is required"
```

#### ❌ Bad Examples
```typescript
btn1                    // Too generic
loginButtonText         // Not hierarchical
dashboardRevenue        // Missing context
emailError             // Ambiguous
```

### Naming Guidelines

1. **Be Specific**
   - ✅ `requests.actions.approve`
   - ❌ `approve`

2. **Use Hierarchy**
   - ✅ `admin.users.table.columns.email`
   - ❌ `userEmailColumn`

3. **Group Related Keys**
   ```typescript
   requests: {
     status: {
       pending: "Pending",
       approved: "Approved",
       rejected: "Rejected"
     }
   }
   ```

4. **Action vs State**
   - Actions: Use verbs (`create`, `edit`, `delete`)
   - States: Use adjectives or nouns (`loading`, `empty`, `error`)

## File Organization

### Directory Structure
```
src/constants/locales/
├── en-US.ts          # English translations
├── ar-SA.ts          # Arabic translations
└── index.ts          # Export configuration
```

### Translation File Structure

```typescript
export const enUS = {
  // Common/Shared translations
  common: {
    actions: { /* ... */ },
    states: { /* ... */ },
    errors: { /* ... */ }
  },
  
  // Feature-specific translations
  dashboard: { /* ... */ },
  requests: { /* ... */ },
  offers: { /* ... */ },
  
  // Component-specific translations
  navigation: { /* ... */ },
  forms: { /* ... */ },
  modals: { /* ... */ }
};
```

## Usage Guidelines

### Basic Usage

```typescript
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.description')}</p>
    </div>
  );
}
```

### With Variables

```typescript
// Translation
const translations = {
  greeting: "Hello, {name}!"
};

// Usage
const message = t('greeting').replace('{name}', userName);
```

### Pluralization

```typescript
const translations = {
  items: {
    one: "{count} item",
    other: "{count} items"
  }
};

// Usage
const text = count === 1 
  ? t('items.one').replace('{count}', count)
  : t('items.other').replace('{count}', count);
```

### Dynamic Content

```typescript
// ❌ Wrong - Dynamic keys
<span>{t(`status.${dynamicStatus}`)}</span>

// ✅ Correct - Static keys with logic
<span>
  {status === 'active' && t('status.active')}
  {status === 'pending' && t('status.pending')}
  {status === 'rejected' && t('status.rejected')}
</span>
```

## Anti-Patterns to Avoid

### 1. Fallback Anti-Pattern

```typescript
// ❌ NEVER DO THIS
const title = t('dashboard.title') === 'dashboard.title' 
  ? 'Dashboard' 
  : t('dashboard.title');

// ✅ DO THIS INSTEAD
const title = t('dashboard.title');
// Make sure 'dashboard.title' exists in translation files
```

### 2. String Concatenation

```typescript
// ❌ Wrong
const message = t('hello') + ' ' + userName + '!';

// ✅ Correct
const message = t('greeting').replace('{name}', userName);
```

### 3. Conditional English

```typescript
// ❌ Wrong
const label = isLoading ? 'Loading...' : 'Submit';

// ✅ Correct
const label = isLoading ? t('common.loading') : t('common.submit');
```

### 4. Inline Translations

```typescript
// ❌ Wrong
<Button>
  {language === 'ar' ? 'إنشاء' : 'Create'}
</Button>

// ✅ Correct
<Button>{t('common.actions.create')}</Button>
```

## RTL (Right-to-Left) Support

### CSS Considerations

```css
/* Use logical properties */
.element {
  margin-inline-start: 1rem;  /* Instead of margin-left */
  padding-inline-end: 1rem;   /* Instead of padding-right */
}

/* Or use direction-aware utilities */
.element {
  margin-left: 1rem;  /* For LTR */
  [dir="rtl"] & {
    margin-left: 0;
    margin-right: 1rem;  /* For RTL */
  }
}
```

### Layout Mirroring

```typescript
const { isRTL } = useLanguage();

<div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
  {/* Content */}
</div>
```

## Translation Workflow

### Adding New Features

1. **Plan translations early** in the development process
2. **Create keys** in both `en-US.ts` and `ar-SA.ts` simultaneously
3. **Use placeholders** if translations aren't ready yet
4. **Validate** with `npm run check:translations`

### Updating Existing Features

1. **Identify** all affected translation keys
2. **Update** both language files
3. **Test** in both languages
4. **Run validation** before committing

### Quality Checklist

Before submitting code:
- [ ] All user-facing text uses `t()`
- [ ] No hardcoded strings in JSX
- [ ] Translation keys are semantic and descriptive
- [ ] Keys exist in both English and Arabic
- [ ] Validation passes (`npm run validate:i18n`)
- [ ] Coverage is 100% (`npm run check:translations`)
- [ ] Tested in both languages
- [ ] RTL layout works correctly

## Common Translation Categories

### Actions
```typescript
actions: {
  create: "Create",
  edit: "Edit",
  delete: "Delete",
  save: "Save",
  cancel: "Cancel",
  submit: "Submit",
  confirm: "Confirm"
}
```

### States
```typescript
states: {
  loading: "Loading...",
  empty: "No data available",
  error: "An error occurred",
  success: "Operation successful"
}
```

### Validation
```typescript
validation: {
  required: "{field} is required",
  invalid: "Invalid {field}",
  tooShort: "{field} is too short",
  tooLong: "{field} is too long"
}
```

### Time/Date
```typescript
time: {
  today: "Today",
  yesterday: "Yesterday",
  tomorrow: "Tomorrow",
  thisWeek: "This Week",
  lastWeek: "Last Week"
}
```

## Testing i18n

### Manual Testing

1. **Switch languages** and verify all text updates
2. **Check RTL layout** in Arabic
3. **Test forms** for placeholder translations
4. **Verify tooltips** and alt text
5. **Check error messages**

### Automated Testing

```typescript
describe('i18n compliance', () => {
  it('should not have hardcoded strings', () => {
    // Test implementation
  });
  
  it('should have all keys in both languages', () => {
    // Test implementation
  });
});
```

## Resources

- [React i18next Documentation](https://react.i18next.com/)
- [ICU Message Format](https://unicode-org.github.io/icu/userguide/format_parse/messages/)
- [RTL Styling Guide](https://rtlstyling.com/)
- [W3C Internationalization](https://www.w3.org/International/)

## Questions?

For i18n-related questions:
1. Check this guide first
2. Review existing implementations
3. Consult the validation tools
4. Ask the development team

---

**Last Updated**: 2025-01-20  
**Version**: 1.0  
**Maintainer**: Development Team
