import { plainParser } from "./plain-parser.js";
import { customRulesPlugin } from "./custom-rules.js";

/** @type {import('eslint').Linter.Config} */
export const scssBemBlock = {
  files: ["**/*.scss"],
  ignores: ["src/styles/**", "src/index.scss"],
  languageOptions: {
    parser: plainParser,
  },
  plugins: {
    "treadmill-tracker": customRulesPlugin,
  },
  rules: {
    "treadmill-tracker/scss-bem": "error",
    "treadmill-tracker/scss-tokens": "error",
  },
};

/** @type {import('eslint').Linter.Config} */
export const scssLayoutBlock = {
  files: ["**/*.scss"],
  ignores: ["src/index.scss"],
  languageOptions: {
    parser: plainParser,
  },
  plugins: {
    "treadmill-tracker": customRulesPlugin,
  },
  rules: {
    "treadmill-tracker/scss-layout": "error",
  },
};
