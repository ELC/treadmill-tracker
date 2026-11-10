/**
 * Root test entry for cross-cutting Playwright fixtures.
 * Merge feature fixtures here only when a spec needs multiple views:
 *
 *   import { mergeTests } from "@playwright/test";
 *   import { test as base } from "@playwright/test";
 *   import { test as appTest } from "../app/tests/app.fixture.js";
 *   export const test = mergeTests(base, appTest);
 */
export { expect, test } from "@playwright/test";
