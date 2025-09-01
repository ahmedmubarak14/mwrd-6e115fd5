import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import i18next from "eslint-plugin-i18next";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "i18next": i18next,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // ========== I18N HARDCODED STRING PREVENTION RULES ==========
      "i18next/no-literal-string": [
        "warn",
        {
          markupOnly: true,
          ignoreAttribute: [
            "className", "variant", "size", "type", "role", "aria-label",
            "data-testid", "id", "name", "htmlFor", "href", "target",
            "rel", "method", "action", "placeholder", "alt", "title",
            "dir", "lang"
          ]
        }
      ],
      // ========== HARDCODED COLOR PREVENTION RULES ========== 
      "no-restricted-syntax": [
        "error",
        {
          selector: 'Literal[value=/text-(white|black|gray|slate|zinc|stone|red|green|blue|yellow|indigo|purple|pink|rose|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia)-\\d+/]',
          message: 'Hardcoded color classes are not allowed. Use semantic tokens from the design system instead (e.g., text-primary, text-success, text-warning, text-destructive, text-muted-foreground).',
        },
        {
          selector: 'Literal[value=/bg-(white|black|gray|slate|zinc|stone|red|green|blue|yellow|indigo|purple|pink|rose|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia)-\\d+/]',
          message: 'Hardcoded background color classes are not allowed. Use semantic tokens from the design system instead (e.g., bg-primary, bg-success, bg-warning, bg-destructive, bg-muted).',
        },
        {
          selector: 'Literal[value=/border-(white|black|gray|slate|zinc|stone|red|green|blue|yellow|indigo|purple|pink|rose|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia)-\\d+/]',
          message: 'Hardcoded border color classes are not allowed. Use semantic tokens from the design system instead (e.g., border-primary, border-success, border-warning, border-destructive, border-muted).',
        },
        {
          selector: 'Literal[value="text-white"]',
          message: 'Use text-primary-foreground or appropriate semantic token instead of text-white.',
        },
        {
          selector: 'Literal[value="text-black"]',
          message: 'Use text-foreground or appropriate semantic token instead of text-black.',
        },
        {
          selector: 'Literal[value="bg-white"]',
          message: 'Use bg-background or appropriate semantic token instead of bg-white.',
        },
        {
          selector: 'Literal[value="bg-black"]',
          message: 'Use bg-foreground or appropriate semantic token instead of bg-black.',
        }
      ],
    },
  }
);
