import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

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
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      // Prevent hardcoded colors in admin dashboard components
      "no-restricted-syntax": [
        "error",
        {
          "selector": "Literal[value=/text-(red|green|blue|yellow|purple|orange|gray|slate|zinc|neutral|stone|amber|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|pink|rose)-(\\d{3}|\\d{2}|\\d{1})/]",
          "message": "Use semantic color tokens (text-success, text-destructive, text-info, text-warning, text-muted-foreground, text-accent, text-primary) instead of hardcoded colors."
        },
        {
          "selector": "Literal[value=/bg-(red|green|blue|yellow|purple|orange|gray|slate|zinc|neutral|stone|amber|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|pink|rose)-(\\d{3}|\\d{2}|\\d{1})/]",
          "message": "Use semantic background tokens (bg-primary, bg-secondary, bg-accent, bg-success, bg-warning, bg-destructive, bg-info) instead of hardcoded colors."
        },
        {
          "selector": "Literal[value=/border-(red|green|blue|yellow|purple|orange|gray|slate|zinc|neutral|stone|amber|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|pink|rose)-(\\d{3}|\\d{2}|\\d{1})/]",
          "message": "Use semantic border tokens (border-primary, border-secondary, border-accent, border-success, border-warning, border-destructive) instead of hardcoded colors."
        },
        {
          "selector": "JSXAttribute[name.name='className'] Literal[value=/text-(white|black)/]",
          "message": "Use semantic color tokens (text-foreground, text-background, text-primary-foreground) instead of text-white or text-black."
        },
        {
          "selector": "JSXAttribute[name.name='className'] Literal[value=/bg-(white|black)/]",
          "message": "Use semantic background tokens (bg-background, bg-foreground, bg-card) instead of bg-white or bg-black."
        }
      ]
    },
  }
);
