import type { Locator, Page } from "@playwright/test";

import type { ComponentHandle } from "../../tests/support/ComponentHandle.js";

export class WorkoutRunnerView implements ComponentHandle {
  readonly root: Locator;
  readonly gestureSurface: Locator;
  readonly title: Locator;
  readonly setIndicators: Locator;
  readonly status: Locator;
  readonly currentSetName: Locator;
  readonly currentTime: Locator;
  readonly currentSpeed: Locator;
  readonly currentIncline: Locator;
  readonly upcomingSetName: Locator;
  readonly upcomingSpeed: Locator;
  readonly upcomingDuration: Locator;
  readonly sessionElapsed: Locator;
  readonly pauseButton: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly completePanel: Locator;
  readonly completeTotalTime: Locator;
  readonly completeTotalDistance: Locator;
  readonly completeAverageSpeed: Locator;
  readonly completeAverageIncline: Locator;
  readonly completeBackButton: Locator;
  readonly completeRestartButton: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId("workout-runner");
    this.gestureSurface = page.getByTestId("workout-runner-gesture-surface");
    this.title = page.getByTestId("workout-runner-title");
    this.setIndicators = page.getByTestId("workout-set-indicators");
    this.status = page.getByTestId("workout-runner-status");
    this.currentSetName = page.getByTestId("set-panel-current-name");
    this.currentTime = page.getByTestId("set-panel-current-time");
    this.currentSpeed = page.getByTestId("set-panel-current-speed");
    this.currentIncline = page.getByTestId("set-panel-current-incline");
    this.upcomingSetName = page.getByTestId("set-panel-upcoming-name");
    this.upcomingSpeed = page.getByTestId("set-panel-upcoming-speed");
    this.upcomingDuration = page.getByTestId("set-panel-upcoming-duration");
    this.sessionElapsed = page.getByTestId("workout-runner-session-elapsed-value");
    this.pauseButton = page.getByTestId("workout-controls-pause");
    this.nextButton = page.getByTestId("workout-controls-next");
    this.previousButton = page.getByTestId("workout-controls-previous");
    this.completePanel = page.getByTestId("workout-complete");
    this.completeTotalTime = page.getByTestId("workout-complete-total-time");
    this.completeTotalDistance = page.getByTestId("workout-complete-total-distance");
    this.completeAverageSpeed = page.getByTestId("workout-complete-average-speed");
    this.completeAverageIncline = page.getByTestId(
      "workout-complete-average-incline",
    );
    this.completeBackButton = page.getByTestId("workout-complete-back");
    this.completeRestartButton = page.getByTestId("workout-complete-restart");
  }

  async expectReady(): Promise<void> {
    await this.root.waitFor({ state: "visible" });
  }
}
