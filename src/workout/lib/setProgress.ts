import {
  positiveFloatSchema,
  positiveIntOrZeroSchema,
  type PositiveFloat,
  type PositiveInt,
  type PositiveIntOrZero,
  type WorkoutSessionSnapshot,
} from "../models/index.js";

export type SetProgress = {
  elapsedSeconds: PositiveIntOrZero;
  durationSeconds: PositiveInt;
  /** Elapsed share of the set, from 0 through 1. */
  fraction: PositiveFloat;
};

export function setProgressForRemaining(
  snapshot: WorkoutSessionSnapshot,
): SetProgress {
  const durationSeconds = snapshot.currentSet.durationSeconds;
  const remainingSeconds = snapshot.remainingSeconds;
  const rawElapsed = durationSeconds - remainingSeconds;
  const elapsedSeconds = positiveIntOrZeroSchema.parse(rawElapsed);
  const fraction = positiveFloatSchema.parse(
    Math.min(1, elapsedSeconds / durationSeconds),
  );
  return {
    elapsedSeconds,
    durationSeconds,
    fraction,
  };
}
