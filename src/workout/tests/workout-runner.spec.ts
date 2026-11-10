import { WorkoutCatalogKeys } from "../data/index.js";
import { expect, test } from "./workout-runner.fixture.js";

test.describe("Workout runner", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/run?workout=${WorkoutCatalogKeys.Default}`);
    await expect(page).toHaveURL(
      new RegExp(`/run[?&]workout=${WorkoutCatalogKeys.Default}(?:&|$)`),
    );
  });

  test("shows current and upcoming set settings from the default workout", async ({
    workoutRunner,
  }) => {
    await workoutRunner.expectReady();

    await expect(workoutRunner.sessionElapsed).toHaveText("0:02", {
      timeout: 5_000,
    });

    await expect(workoutRunner.title).toHaveText("Starter intervals");
    await expect(workoutRunner.status).toBeHidden();
    await expect(workoutRunner.currentSetName).toHaveText("Warm up");
    await expect(workoutRunner.currentSpeed).toHaveText(" 5.5");
    await expect(workoutRunner.currentIncline).toHaveText(" 0%");
    await expect(workoutRunner.upcomingSetName).toHaveText("Interval 1");
    await expect(workoutRunner.upcomingSpeed).toHaveText("10.0");
    await expect(workoutRunner.upcomingDuration).toHaveText("2:00");
  });

  test("keeps counting while timers are suspended (locked screen)", async ({
    page,
    workoutRunner,
  }) => {
    await page.clock.install();
    await page.goto(`/run?workout=${WorkoutCatalogKeys.Default}`);
    await workoutRunner.expectReady();

    // Fires each due timer at most once, like a closed lid or locked phone.
    await page.clock.fastForward("10:00");

    await expect(workoutRunner.currentSetName).toHaveText("Interval 2");
    await expect(workoutRunner.sessionElapsed).toHaveText(/^10:0\d$/);
  });

  test("shows set indicators above session controls", async ({
    workoutRunner,
    page,
  }) => {
    await workoutRunner.expectReady();
    await workoutRunner.pauseButton.click();

    await expect(workoutRunner.setIndicators).toBeVisible();
    await expect(page.getByTestId("workout-set-indicator-0")).toHaveAttribute(
      "data-indicator-state",
      "current",
    );
    await expect(page.getByTestId("workout-set-indicator-4")).toHaveAttribute(
      "data-indicator-state",
      "upcoming",
    );

    await workoutRunner.nextButton.click();
    await expect(page.getByTestId("workout-set-indicator-0")).toHaveAttribute(
      "data-indicator-state",
      "completed",
    );
    await expect(page.getByTestId("workout-set-indicator-1")).toHaveAttribute(
      "data-indicator-state",
      "current",
    );
  });

  test("pauses and resumes the session", async ({ workoutRunner }) => {
    await workoutRunner.expectReady();

    await workoutRunner.pauseButton.click();
    await expect(workoutRunner.status).toHaveText("PAUSED");
    await expect(workoutRunner.pauseButton).toHaveText("▶");

    await workoutRunner.pauseButton.click();
    await expect(workoutRunner.status).toBeHidden();
    await expect(workoutRunner.pauseButton).toHaveText("⏸");
  });

  test("shows completion summary after the final set", async ({
    page,
    workoutRunner,
  }) => {
    await page.goto(
      `/run?workout=${encodeURIComponent(WorkoutCatalogKeys.E2eShort)}`,
    );
    await workoutRunner.expectReady();

    await expect(workoutRunner.title).toHaveText("E2E sprint");
    await expect(workoutRunner.completePanel).toBeVisible({ timeout: 10_000 });
    await expect(workoutRunner.setIndicators).toBeHidden();
    await expect(workoutRunner.completeTotalTime).toHaveText("0:02");
    await expect(workoutRunner.completeTotalDistance).toHaveText("0.0 km");
    await expect(workoutRunner.completeAverageSpeed).toHaveText("10.0");
    await expect(workoutRunner.completeAverageIncline).toHaveText("1.0%");

    await workoutRunner.completeRestartButton.click();
    await expect(workoutRunner.completePanel).toHaveCount(0);
    await expect(workoutRunner.setIndicators).toBeVisible();
    await expect(workoutRunner.currentSetName).toHaveText("Sprint");
  });

  test("returns to the last set from completion via back", async ({
    page,
    workoutRunner,
  }) => {
    await page.goto(
      `/run?workout=${encodeURIComponent(WorkoutCatalogKeys.E2eShort)}`,
    );
    await workoutRunner.expectReady();
    await expect(workoutRunner.completePanel).toBeVisible({ timeout: 10_000 });

    await workoutRunner.completeBackButton.click();
    await expect(workoutRunner.completePanel).toHaveCount(0);
    await expect(workoutRunner.status).toHaveText("PAUSED");
    await expect(workoutRunner.currentSetName).toHaveText("Sprint");
    await expect(page.getByTestId("workout-controls")).toBeVisible();
  });

  test("keyboard shortcuts mirror footer controls", async ({
    workoutRunner,
    page,
  }) => {
    await workoutRunner.expectReady();

    await page.keyboard.press(" ");
    await expect(workoutRunner.status).toHaveText("PAUSED");

    await page.keyboard.press(" ");
    await expect(workoutRunner.status).toBeHidden();

    await page.keyboard.press(" ");
    await expect(workoutRunner.status).toHaveText("PAUSED");

    await page.keyboard.press("ArrowRight");
    await expect(workoutRunner.currentSetName).toHaveText("Interval 1");

    await page.keyboard.press("ArrowLeft");
    await expect(workoutRunner.currentSetName).toHaveText("Warm up");
  });

  test("swipe and double-tap mirror footer controls", async ({
    workoutRunner,
  }) => {
    await workoutRunner.expectReady();
    await workoutRunner.pauseButton.click();

    await workoutRunner.gestureSurface.evaluate((el) => {
      const startX = 280;
      const endX = 80;
      const y = 320;
      const makeTouch = (clientX: number): Touch =>
        new Touch({
          identifier: 1,
          target: el,
          clientX,
          clientY: y,
        });
      el.dispatchEvent(
        new TouchEvent("touchstart", {
          bubbles: true,
          cancelable: true,
          touches: [makeTouch(startX)],
        }),
      );
      el.dispatchEvent(
        new TouchEvent("touchend", {
          bubbles: true,
          cancelable: true,
          changedTouches: [makeTouch(endX)],
        }),
      );
    });

    await expect(workoutRunner.currentSetName).toHaveText("Interval 1");

    await workoutRunner.gestureSurface.evaluate((el) => {
      const startX = 80;
      const endX = 280;
      const y = 320;
      const makeTouch = (clientX: number): Touch =>
        new Touch({
          identifier: 1,
          target: el,
          clientX,
          clientY: y,
        });
      el.dispatchEvent(
        new TouchEvent("touchstart", {
          bubbles: true,
          cancelable: true,
          touches: [makeTouch(startX)],
        }),
      );
      el.dispatchEvent(
        new TouchEvent("touchend", {
          bubbles: true,
          cancelable: true,
          changedTouches: [makeTouch(endX)],
        }),
      );
    });

    await expect(workoutRunner.currentSetName).toHaveText("Warm up");

    await workoutRunner.gestureSurface.evaluate((el) => {
      const x = 200;
      const y = 400;
      const tap = (): void => {
        const touch = new Touch({
          identifier: 1,
          target: el,
          clientX: x,
          clientY: y,
        });
        el.dispatchEvent(
          new TouchEvent("touchstart", {
            bubbles: true,
            cancelable: true,
            touches: [touch],
          }),
        );
        el.dispatchEvent(
          new TouchEvent("touchend", {
            bubbles: true,
            cancelable: true,
            changedTouches: [touch],
          }),
        );
      };
      tap();
      tap();
    });

    await expect(workoutRunner.pauseButton).toHaveText("⏸");
  });

  test("moves to the next and previous set", async ({ workoutRunner }) => {
    await workoutRunner.expectReady();

    await workoutRunner.pauseButton.click();

    await expect(workoutRunner.previousButton).toBeDisabled();
    await workoutRunner.nextButton.click();

    await expect(workoutRunner.currentSetName).toHaveText("Interval 1");
    await expect(workoutRunner.upcomingSetName).toHaveText("Recovery");
    await expect(workoutRunner.previousButton).toBeEnabled();

    const elapsedBeforePrevious =
      await workoutRunner.sessionElapsed.textContent();

    await workoutRunner.previousButton.click();
    await expect(workoutRunner.currentSetName).toHaveText("Warm up");
    await expect(workoutRunner.sessionElapsed).toHaveText(
      elapsedBeforePrevious ?? "",
    );
  });
});
