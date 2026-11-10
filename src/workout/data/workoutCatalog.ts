import { defaultWorkout } from "./defaultWorkout.js";
import { e2eShortWorkout } from "./e2eShortWorkout.js";
import { inclineLadderIntervals60 } from "./inclineLadderIntervals60.js";
import { progressiveInclineIntervalWalk60 } from "./progressiveInclineIntervalWalk60.js";
import type { Workout } from "../models/index.js";

/**
 * Stable catalog keys for URL `?workout=` and map lookups.
 * Add new entries here and register them on **`WORKOUT_CATALOG`**.
 */
export const WorkoutCatalogKeys = {
  Default: "default",
  E2eShort: "e2e-short",
  InclineLadder60: "incline-ladder-60",
  ProgressiveInclineWalk60: "progressive-incline-walk-60",
} as const;

export type WorkoutCatalogKey =
  (typeof WorkoutCatalogKeys)[keyof typeof WorkoutCatalogKeys];

/** Built-in workouts keyed by **`WorkoutCatalogKey`**. */
export const WORKOUT_CATALOG = new Map<WorkoutCatalogKey, Workout>([
  [WorkoutCatalogKeys.Default, defaultWorkout],
  [WorkoutCatalogKeys.E2eShort, e2eShortWorkout],
  [WorkoutCatalogKeys.InclineLadder60, inclineLadderIntervals60],
  [WorkoutCatalogKeys.ProgressiveInclineWalk60, progressiveInclineIntervalWalk60],
]);

/** Narrow a raw query string to a catalog key, or `null` if missing / unknown. */
export function workoutCatalogKeyFromString(
  raw: string | null,
): WorkoutCatalogKey | null {
  if (raw === null || raw === "") {
    return null;
  }
  const key = raw as WorkoutCatalogKey;
  return WORKOUT_CATALOG.has(key) ? key : null;
}

/**
 * Resolve a workout from a catalog key (e.g. URL `?workout=`).
 * Unknown or empty keys fall back to **`WorkoutCatalogKeys.Default`**.
 */
export function workoutFromCatalogKey(
  key: WorkoutCatalogKey | null | undefined,
): Workout {
  const resolved =
    key !== null && key !== undefined ?
      WORKOUT_CATALOG.get(key)
    : undefined;
  if (resolved !== undefined) {
    return resolved;
  }
  const fallback = WORKOUT_CATALOG.get(WorkoutCatalogKeys.Default);
  if (fallback === undefined) {
    throw new Error("WORKOUT_CATALOG must include default workout");
  }
  return fallback;
}
