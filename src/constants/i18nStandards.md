# Admin Dashboard i18n Standards & Best Practices

## Overview
This document outlines the internationalization (i18n) standards for the Admin Dashboard to ensure consistent, maintainable, and accessible multilingual support.

## Core Principles

### 1. No Hardcoded Strings
- **NEVER** use hardcoded strings in components
- All user-facing text must use the `t()` translation function
- Use semantic translation keys that describe content purpose

### 2. Translation Key Structure
```
namespace.category.specific_key

Examples:
- admin.dashboard.title
- admin.users.createButton  
- common.errors.networkConnection
- admin.breadcrumbs.userManagement
```

### 3. Component Implementation Pattern

#### Required Imports
```tsx
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';

export const AdminComponent = () => {
  const { t, isRTL } = useOptionalLanguage();
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <h1>{t('admin.component.title')}</h1>
      {/* Rest of component */}
    </div>
  );
};
```

#### Form Elements
```tsx
// ✅ CORRECT
<Input 
  placeholder={t('common.placeholders.searchUsers')}
  aria-label={t('common.labels.searchInput')}
/>

// ❌ WRONG  
<Input placeholder="Search users..." />
```

#### Toast Messages
```tsx
// ✅ CORRECT
toast.error(t('common.errors.networkConnection'));

// ❌ WRONG
toast.error('Network connection failed');
```

## Translation File Organization

### File Structure
```
src/constants/locales/
├── en-US.ts     # English translations
├── ar-SA.ts     # Arabic translations
└── index.ts     # Export configuration
```

### Key Organization
```typescript
export const enUS = {
  common: {
    // Shared across all components
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    
    errors: {
      networkConnection: 'Network connection issue...',
      dataLoading: 'Data loading failed...'
    },
    
    placeholders: {
      search: 'Search...',
      email: 'Enter email address'
    }
  },
  
  admin: {
    // Admin-specific translations
    dashboard: 'Admin Dashboard',
    
    breadcrumbs: {
      admin: 'Admin',
      users: 'Users'
    },
    
    commandPalette: {
      searchPlaceholder: 'Search users, requests...'
    }
  }
};
```

## RTL (Right-to-Left) Support

### Layout Considerations
```tsx
// Use conditional classes for RTL layout
<div className={cn("flex items-center", isRTL && "flex-row-reverse")}>

// Use logical CSS properties when possible
<div className="ps-4 pe-2"> {/* padding-inline-start/end */}
```

### Arabic Translation Guidelines
1. **Cultural Sensitivity**: Ensure translations are culturally appropriate for Saudi Arabian context
2. **Technical Terms**: Use consistent Arabic technical terms throughout
3. **Formal Language**: Use formal Arabic (Modern Standard Arabic)
4. **Number Formatting**: Consider Arabic-Indic numerals when appropriate

## Validation & Quality Assurance

### Development Validation
```typescript
// Use validation utility during development
import { logValidationWarnings } from '@/utils/i18nValidation';

// In main.tsx or App.tsx
if (process.env.NODE_ENV === 'development') {
  logValidationWarnings();
}
```

### Pre-commit Checks
1. Run translation key validation
2. Check for hardcoded strings
3. Verify RTL layout doesn't break
4. Test language switching functionality

### Testing Checklist
- [ ] All text displays correctly in both languages
- [ ] Layout doesn't break with longer Arabic text
- [ ] Form validation messages are translated
- [ ] Error messages use translation keys
- [ ] Success messages use translation keys
- [ ] Loading states use translation keys

## Common Patterns & Examples

### Modal/Dialog Headers
```tsx
// ✅ CORRECT
<DialogTitle>{t('admin.users.addUserModal.title')}</DialogTitle>
<DialogDescription>{t('admin.users.addUserModal.description')}</DialogDescription>
```

### Table Headers & Actions
```tsx
// ✅ CORRECT
<TableHead>{t('admin.users.table.name')}</TableHead>
<Button>{t('admin.users.actions.edit')}</Button>
```

### Status Badges
```tsx
// ✅ CORRECT  
<Badge variant="success">{t('admin.users.status.active')}</Badge>
```

### Form Validation
```tsx
// ✅ CORRECT
const schema = z.object({
  email: z.string().email(t('common.validation.emailInvalid'))
});
```

## Maintenance Guidelines

### Adding New Features
1. Add translation keys to both `en-US.ts` and `ar-SA.ts`
2. Use semantic key naming following established patterns
3. Test in both languages during development
4. Verify RTL layout compatibility

### Updating Existing Features
1. Check if new text requires translation keys
2. Update existing keys if meaning changes
3. Maintain backward compatibility when possible
4. Test language switching after changes

### Code Review Checklist
- [ ] No hardcoded strings in new code
- [ ] Translation keys follow naming conventions
- [ ] Both English and Arabic translations provided
- [ ] RTL layout considered and tested
- [ ] Proper use of `useOptionalLanguage` hook

## Tools & Resources

### Development Tools
- `src/utils/i18nValidation.ts` - Validation utilities
- Browser dev tools for RTL testing
- React DevTools for context inspection

### External Resources
- [Arabic Typography Guidelines](https://fonts.google.com/knowledge/using_type/an_introduction_to_arabic_typography)
- [RTL Styling Best Practices](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
- [React i18n Best Practices](https://react.i18next.com/latest/using-with-hooks)

## Troubleshooting

### Common Issues
1. **Missing translations**: Check console warnings in development mode
2. **RTL layout breaks**: Use logical CSS properties and conditional classes
3. **Context not available**: Ensure component is wrapped in LanguageProvider
4. **Performance issues**: Consider lazy loading for large translation files

### Debug Commands
```typescript
// Check current language context
console.log('Current language:', useOptionalLanguage().language);

// Validate translation coverage
import { validateAdminTranslationKeys } from '@/utils/i18nValidation';
console.log('Missing keys:', validateAdminTranslationKeys());
```