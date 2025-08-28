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
        "warn",
        {
          "selector": "Literal[value=/text-(red|green|blue|yellow|purple|orange|gray)-(\\d{3}|\\d{2})/]",
          "message": "Use semantic color tokens (text-success, text-destructive, text-info, text-warning, text-muted-foreground) instead of hardcoded colors."
        },
        {
          "selector": "Literal[value=/bg-(red|green|blue|yellow|purple|orange|gray)-(\\d{3}|\\d{2})/]",
          "message": "Use semantic background tokens instead of hardcoded colors."
        },
        {
          "selector": "Literal[value=/border-(red|green|blue|yellow|purple|orange|gray)-(\\d{3}|\\d{2})/]",
          "message": "Use semantic border tokens instead of hardcoded colors."
        }
      ]
    },
  }
);
