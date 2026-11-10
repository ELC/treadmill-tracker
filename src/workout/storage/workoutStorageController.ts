import type { Workout } from "../models/index.js";
import {
  parseStoredWorkouts,
  serializeStoredWorkouts,
} from "./storedWorkoutRecord.js";

export const WORKOUT_STORAGE_KEY = "treadmill-tracker-workouts";

/** Records that failed to load, kept so a later save never silently erases them. */
export const UNREADABLE_WORKOUT_STORAGE_KEY = "treadmill-tracker-workouts-unreadable";

export class WorkoutStorageController {
  loadWorkouts(): Workout[] {
    if (typeof window === "undefined") {
      return [];
    }
    const raw = window.localStorage.getItem(WORKOUT_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const { workouts, unreadable } = parseStoredWorkouts(raw);
    if (unreadable.length > 0) {
      this.preserveUnreadable(unreadable);
    }
    return workouts;
  }

  saveWorkouts(workouts: readonly Workout[]): void {
    window.localStorage.setItem(
      WORKOUT_STORAGE_KEY,
      serializeStoredWorkouts(workouts),
    );
  }

  /** Appends entries not already preserved, so repeated loads do not grow the backup. */
  private preserveUnreadable(entries: readonly unknown[]): void {
    const preserved = this.loadPreservedUnreadable();
    const preservedJson = new Set(preserved.map((entry) => JSON.stringify(entry)));
    for (const entry of entries) {
      const entryJson = JSON.stringify(entry);
      if (preservedJson.has(entryJson)) {
        continue;
      }
      preservedJson.add(entryJson);
      preserved.push(entry);
    }
    window.localStorage.setItem(
      UNREADABLE_WORKOUT_STORAGE_KEY,
      JSON.stringify(preserved),
    );
  }

  private loadPreservedUnreadable(): unknown[] {
    const raw = window.localStorage.getItem(UNREADABLE_WORKOUT_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const json: unknown = JSON.parse(raw);
      if (Array.isArray(json)) {
        return json;
      }
    } catch {
      // Fall through: keep the corrupt backup itself as one entry.
    }
    return [raw];
  }
}

export const workoutStorageController = new WorkoutStorageController();
