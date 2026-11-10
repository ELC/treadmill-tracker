import type { Page } from "@playwright/test";

import {
  WorkoutCatalogKeys,
  workoutIdFromName,
} from "../../workout/index.js";
import {
  UNREADABLE_WORKOUT_STORAGE_KEY,
  WORKOUT_STORAGE_KEY,
} from "../../workout/storage/index.js";
import { expect, test } from "./app.fixture.js";

const SAVED_WORKOUT_ID = "6f1c2a9e-3b7d-4c5e-9a1f-2d8b7e6c5a40";

const sampleSet = {
  name: "Walk",
  durationSeconds: 60,
  speedKmh: 5,
  inclinePercent: 1,
};

async function seedWorkoutStorage(page: Page, value: unknown): Promise<void> {
  await page.goto("/");
  await page.evaluate(
    ([key, raw]) => {
      window.localStorage.setItem(key, raw);
    },
    [WORKOUT_STORAGE_KEY, JSON.stringify(value)] as const,
  );
}

async function readStorage(page: Page, key: string): Promise<unknown> {
  const raw = await page.evaluate(
    (storageKey) => window.localStorage.getItem(storageKey),
    key,
  );
  return raw === null ? null : (JSON.parse(raw) as unknown);
}

test.describe("Workout planning", () => {
  test("creates and lists a saved workout", async ({ page, app }) => {
    await app.open();
    await app.expectReady();

    await page.getByTestId("home-plan").click();
    await expect(page.getByTestId("workout-plan")).toBeVisible();
    await expect(page.getByTestId(`workout-plan-edit-${WorkoutCatalogKeys.Default}`)).toBeVisible();
    await expect(page.getByText("Starter intervals")).toBeVisible();

    await page.getByTestId("workout-plan-add").click();
    await expect(page.getByTestId("workout-editor")).toBeVisible();
    await expect(page.getByTestId("workout-editor-set-indicators")).toBeVisible();

    await page.getByTestId("workout-editor-name").fill("Gym test");
    await page.getByTestId("workout-editor-set-duration-0").fill("90");
    await page.getByTestId("workout-editor-save").click();

    await expect(page.getByTestId("workout-plan")).toBeVisible();
    await expect(page.getByText("Gym test")).toBeVisible();
    await expect(page.getByText("2:30")).toBeVisible();
  });

  test("keeps two saved workouts that share a name", async ({ page }) => {
    await page.goto("/plan");

    for (let copy = 0; copy < 2; copy += 1) {
      await page.getByTestId("workout-plan-add").click();
      await page.getByTestId("workout-editor-name").fill("Same name");
      await page.getByTestId("workout-editor-save").click();
      await expect(page.getByTestId("workout-plan")).toBeVisible();
    }

    await expect(page.getByText("Same name")).toHaveCount(2);
  });

  test("renaming a saved workout keeps its run link", async ({ page }) => {
    await seedWorkoutStorage(page, {
      version: 1,
      workouts: [{ id: SAVED_WORKOUT_ID, name: "Hill walk", sets: [sampleSet] }],
    });

    await page.goto(`/plan/${SAVED_WORKOUT_ID}`);
    await page.getByTestId("workout-editor-name").fill("Steep hill walk");
    await page.getByTestId("workout-editor-save").click();
    await expect(
      page.getByTestId(`workout-plan-edit-${SAVED_WORKOUT_ID}`),
    ).toContainText("Steep hill walk");

    await page.goto(`/run?workout=${SAVED_WORKOUT_ID}`);
    await expect(page.getByTestId("workout-runner-title")).toHaveText(
      "Steep hill walk",
    );
  });

  test("loads legacy records and preserves unreadable ones", async ({ page }) => {
    const brokenRecord = { name: "Broken", sets: [] };
    await seedWorkoutStorage(page, [
      { name: "Legacy run", sets: [sampleSet] },
      brokenRecord,
    ]);
    const legacyId = workoutIdFromName("Legacy run");

    await page.goto(`/run?workout=${legacyId}`);
    await expect(page.getByTestId("workout-runner-title")).toHaveText(
      "Legacy run",
    );

    await page.goto("/plan");
    await page.getByTestId("workout-plan-add").click();
    await page.getByTestId("workout-editor-name").fill("Fresh plan");
    await page.getByTestId("workout-editor-save").click();
    await expect(page.getByText("Fresh plan")).toBeVisible();
    await expect(page.getByTestId(`workout-plan-edit-${legacyId}`)).toBeVisible();

    expect(await readStorage(page, UNREADABLE_WORKOUT_STORAGE_KEY)).toEqual([
      brokenRecord,
    ]);
    expect(await readStorage(page, WORKOUT_STORAGE_KEY)).toMatchObject({
      version: 1,
      workouts: [
        { id: legacyId, name: "Legacy run" },
        { name: "Fresh plan" },
      ],
    });
  });
});
