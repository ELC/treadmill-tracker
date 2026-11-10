import js from "@eslint/js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

import { customRulesPlugin } from "./custom-rules.js";

const tsconfigRootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

/** @type {import('eslint').Linter.Config} */
export const appTypescriptBlock = {
  files: ["**/*.{ts,tsx}"],
  extends: [
    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir,
    },
  },
  plugins: {
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh,
    "treadmill-tracker": customRulesPlugin,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "treadmill-tracker/bem-class-name": "error",
    "treadmill-tracker/scss-style-import": "error",
  },
};
