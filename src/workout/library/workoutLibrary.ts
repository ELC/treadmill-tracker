import {
  WorkoutCatalogKeys,
  WORKOUT_CATALOG,
  workoutCatalogKeyFromString,
  workoutFromCatalogKey,
  type WorkoutCatalogKey,
} from "../data/index.js";
import { randomWorkoutName } from "../lib/randomWorkoutName.js";
import {
  newWorkoutId,
  Workout,
  WorkoutSet,
  type WorkoutId,
} from "../models/index.js";
import { workoutStorageController } from "../storage/index.js";

export const WorkoutListSources = {
  Catalog: "catalog",
  Saved: "saved",
} as const;

export type WorkoutListSource =
  (typeof WorkoutListSources)[keyof typeof WorkoutListSources];

export type WorkoutListEntry = {
  key: string;
  name: string;
  setCount: number;
  source: WorkoutListSource;
};

export type WorkoutLibrarySnapshot = {
  savedWorkouts: readonly Workout[];
  revision: number;
};

export class WorkoutLibraryController {
  loadSnapshot(): WorkoutLibrarySnapshot {
    const savedWorkouts = workoutStorageController.loadWorkouts();
    return { savedWorkouts, revision: 0 };
  }

  catalogListEntries(): WorkoutListEntry[] {
    return [...WORKOUT_CATALOG.entries()].map(([key, workout]) => ({
      key,
      name: workout.name,
      setCount: workout.sets.length,
      source: WorkoutListSources.Catalog,
    }));
  }

  savedListEntries(savedWorkouts: readonly Workout[]): WorkoutListEntry[] {
    return savedWorkouts.map((workout) => ({
      key: workout.id,
      name: workout.name,
      setCount: workout.sets.length,
      source: WorkoutListSources.Saved,
    }));
  }

  startListEntries(savedWorkouts: readonly Workout[]): WorkoutListEntry[] {
    return [
      ...this.catalogListEntries(),
      ...this.savedListEntries(savedWorkouts),
    ];
  }

  resolveWorkoutByKey(
    key: string | null,
    savedWorkouts: readonly Workout[],
  ): Workout | null {
    if (key === null || key === "") {
      return null;
    }
    const catalogKey = workoutCatalogKeyFromString(key);
    if (catalogKey !== null) {
      return workoutFromCatalogKey(catalogKey);
    }
    for (const workout of savedWorkouts) {
      if (workout.id === key) {
        return workout;
      }
    }
    return null;
  }

  isCatalogWorkoutKey(key: string): key is WorkoutCatalogKey {
    return workoutCatalogKeyFromString(key) !== null;
  }

  createEmptySavedWorkout(): Workout {
    const name = randomWorkoutName();
    return new Workout(
      name,
      [
        new WorkoutSet("Warm up", 60, 3.5, 1),
        new WorkoutSet("Cool down", 60, 3.5, 0),
      ],
      newWorkoutId(),
    );
  }

  /** Replaces the saved workout with the same **`id`** in place, or appends it. */
  upsertSavedWorkout(
    savedWorkouts: readonly Workout[],
    workout: Workout,
  ): Workout[] {
    const existingIndex = savedWorkouts.findIndex(
      (item) => item.id === workout.id,
    );
    const next = [...savedWorkouts];
    if (existingIndex === -1) {
      next.push(workout);
    } else {
      next[existingIndex] = workout;
    }
    workoutStorageController.saveWorkouts(next);
    return next;
  }

  deleteSavedWorkout(
    savedWorkouts: readonly Workout[],
    workoutId: WorkoutId,
  ): Workout[] {
    const remaining = savedWorkouts.filter((workout) => workout.id !== workoutId);
    workoutStorageController.saveWorkouts(remaining);
    return remaining;
  }

  defaultRunWorkoutKey(): WorkoutCatalogKey {
    return WorkoutCatalogKeys.Default;
  }
}

export const workoutLibraryController = new WorkoutLibraryController();
