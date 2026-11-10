import { useLayoutEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import {
  useWorkoutLibrary,
  workoutLibraryController,
} from "../library/index.js";
import type { Workout } from "../models/index.js";

/** Resolves **`Workout`** from `?workout=` using the catalog and saved library. */
export function useActiveWorkout(): Workout {
  const [searchParams, setSearchParams] = useSearchParams();
  const { savedWorkouts, revision } = useWorkoutLibrary();
  const workoutQuery = searchParams.get("workout");

  const workout = useMemo(() => {
    const resolved = workoutLibraryController.resolveWorkoutByKey(
      workoutQuery,
      savedWorkouts,
    );
    if (resolved) {
      return resolved;
    }
    const fallback = workoutLibraryController.resolveWorkoutByKey(
      workoutLibraryController.defaultRunWorkoutKey(),
      savedWorkouts,
    );
    if (!fallback) {
      throw new Error("Default workout must exist in catalog");
    }
    return fallback;
  }, [workoutQuery, savedWorkouts]);

  useLayoutEffect(() => {
    const resolved = workoutLibraryController.resolveWorkoutByKey(
      workoutQuery,
      savedWorkouts,
    );
    if (resolved !== null) {
      return;
    }
    const next = new URLSearchParams(searchParams);
    next.set("workout", workoutLibraryController.defaultRunWorkoutKey());
    setSearchParams(next, { replace: true });
  }, [workoutQuery, revision, savedWorkouts, searchParams, setSearchParams]);

  return workout;
}
