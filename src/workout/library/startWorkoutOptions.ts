import type { Workout } from "../models/index.js";
import {
  workoutLibraryController,
  type WorkoutListEntry,
} from "./workoutLibrary.js";

export type StartWorkoutOption = {
  entry: WorkoutListEntry;
  workout: Workout;
};

export function startWorkoutOptions(
  savedWorkouts: readonly Workout[],
): StartWorkoutOption[] {
  return workoutLibraryController
    .startListEntries(savedWorkouts)
    .map((entry) => {
      const workout = workoutLibraryController.resolveWorkoutByKey(
        entry.key,
        savedWorkouts,
      );
      if (!workout) {
        return null;
      }
      return { entry, workout };
    })
    .filter((option): option is StartWorkoutOption => option !== null);
}
