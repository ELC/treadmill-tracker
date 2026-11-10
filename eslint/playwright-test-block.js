/** Playwright tests use `use` as a fixture callback — not React hooks. */
/** @type {import('eslint').Linter.Config} */
export const playwrightTestBlock = {
  files: ["**/tests/**/*.ts"],
  rules: {
    "react-hooks/rules-of-hooks": "off",
    "react-refresh/only-export-components": "off",
    "treadmill-tracker/bem-class-name": "off",
    "treadmill-tracker/playwright-test-id-locators": "error",
  },
};
