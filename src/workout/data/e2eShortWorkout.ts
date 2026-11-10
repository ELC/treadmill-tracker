import { Workout, WorkoutSet } from "../models/index.js";

/** Minimal routine for Playwright completion flow (not used in production). */
export const e2eShortWorkout = new Workout("E2E sprint", [
  new WorkoutSet("Sprint", 2, 10, 1),
]);
