import type { Locator } from "@playwright/test";

/** Shared shape for View / Component objects (small surface, no page-wide helpers). */
export type ComponentHandle = {
  readonly root: Locator;
  expectReady(): Promise<void>;
};
