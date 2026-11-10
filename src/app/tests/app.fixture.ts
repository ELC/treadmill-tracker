import { test as base, expect } from "@playwright/test";

import { AppView } from "./AppView.js";

type AppFixtures = {
  app: AppView;
};

export const test = base.extend<AppFixtures>({
  app: async ({ page }, use) => {
    await use(new AppView(page));
  },
});

export { expect };
