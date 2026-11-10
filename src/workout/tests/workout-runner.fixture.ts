import { test as base, expect } from "@playwright/test";

import { WorkoutRunnerView } from "./WorkoutRunnerView.js";

type WorkoutRunnerFixtures = {
  workoutRunner: WorkoutRunnerView;
};

export const test = base.extend<WorkoutRunnerFixtures>({
  workoutRunner: async ({ page }, use) => {
    await use(new WorkoutRunnerView(page));
  },
});

export { expect };
