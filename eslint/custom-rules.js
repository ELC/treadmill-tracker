import { bemClassNameRule } from "./rules/bem-class-name.js";
import { playwrightTestIdLocatorsRule } from "./rules/playwright-test-id-locators.js";
import { scssBemRule } from "./rules/scss-bem.js";
import { scssLayoutRule } from "./rules/scss-layout.js";
import { scssStyleImportRule } from "./rules/scss-style-import.js";
import { scssTokensRule } from "./rules/scss-tokens.js";

/** @type {import('eslint').Linter.Config[]} */
export const customRuleBlocks = [];

/** Local plugin for project-specific rules. */
export const customRulesPlugin = {
  rules: {
    "bem-class-name": bemClassNameRule,
    "scss-style-import": scssStyleImportRule,
    "scss-bem": scssBemRule,
    "scss-layout": scssLayoutRule,
    "scss-tokens": scssTokensRule,
    "playwright-test-id-locators": playwrightTestIdLocatorsRule,
  },
};
