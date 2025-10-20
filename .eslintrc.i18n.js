/**
 * ESLint rules for i18n compliance
 * 
 * These rules help prevent common i18n mistakes at development time
 */

module.exports = {
  rules: {
    // Warn about hardcoded strings in JSX
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'JSXText[value=/^[A-Z][a-z]+\\s+[A-Z]/]',
        message: 'Hardcoded text in JSX detected. Use t() function for translatable content.'
      }
    ],
    
    // Prevent console.log of user data
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error', 'info']
      }
    ]
  },
  
  overrides: [
    {
      // Apply stricter rules to component files
      files: ['src/components/**/*.tsx', 'src/pages/**/*.tsx'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: 'JSXText[value=/^[A-Z][a-z]+\\s+[A-Z]/]',
            message: 'Hardcoded text in JSX. Use t("translation.key") instead.'
          },
          {
            selector: 'CallExpression[callee.name="t"] > MemberExpression',
            message: 'Avoid dynamic translation keys. Use static strings for t() calls.'
          }
        ]
      }
    },
    {
      // Relax rules for test files
      files: ['**/*.test.tsx', '**/*.test.ts', '**/*.spec.tsx', '**/*.spec.ts'],
      rules: {
        'no-restricted-syntax': 'off'
      }
    },
    {
      // Exclude translation files from these rules
      files: ['src/constants/locales/**/*.ts'],
      rules: {
        'no-restricted-syntax': 'off'
      }
    }
  ]
};
