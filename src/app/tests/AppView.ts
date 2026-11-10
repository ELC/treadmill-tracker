import type { Locator, Page } from "@playwright/test";

import type { ComponentHandle } from "../../tests/support/ComponentHandle.js";

/** View object for the root app shell. */
export class AppView implements ComponentHandle {
  readonly root: Locator;
  readonly documentRoot: Locator;
  readonly themeToggle: Locator;

  constructor(private readonly page: Page) {
    this.root = page.getByTestId("app");
    this.documentRoot = page.getByTestId("document-root");
    this.themeToggle = page.getByTestId("theme-toggle");
  }

  async open(): Promise<void> {
    await this.page.goto("/");
  }

  async expectReady(): Promise<void> {
    await this.root.waitFor({ state: "visible" });
  }
}
