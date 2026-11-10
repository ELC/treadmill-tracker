export { appTypescriptBlock } from "./app-typescript-block.js";
export { customRuleBlocks, customRulesPlugin } from "./custom-rules.js";
export { eslintIgnores } from "./ignores.js";
export { playwrightTestBlock } from "./playwright-test-block.js";
export { scssBemBlock, scssLayoutBlock } from "./scss-block.js";

import { appTypescriptBlock } from "./app-typescript-block.js";
import { customRuleBlocks } from "./custom-rules.js";
import { eslintIgnores } from "./ignores.js";
import { playwrightTestBlock } from "./playwright-test-block.js";
import { scssBemBlock, scssLayoutBlock } from "./scss-block.js";

/** Flat-config blocks for `eslint.config.js`, in apply order. */
export const eslintConfigBlocks = [
  eslintIgnores,
  appTypescriptBlock,
  playwrightTestBlock,
  scssBemBlock,
  scssLayoutBlock,
  ...customRuleBlocks,
];
