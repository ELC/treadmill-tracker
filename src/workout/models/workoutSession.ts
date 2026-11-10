import { z } from "zod";

import {
  positiveIntOrZeroSchema,
  type PositiveIntOrZero,
} from "./types.js";
import { WorkoutSet, workoutSetSchema } from "./workoutSet.js";

export const WorkoutSessionStatus = {
  Running: "running",
  Paused: "paused",
  Finished: "finished",
} as const;

export const workoutSessionStatusSchema = z.enum([
  WorkoutSessionStatus.Running,
  WorkoutSessionStatus.Paused,
  WorkoutSessionStatus.Finished,
]);

export type WorkoutSessionStatus = z.infer<typeof workoutSessionStatusSchema>;

const workoutSetNullableSchema = z.custom<WorkoutSet | null>(
  (value) => value === null || value instanceof WorkoutSet,
  "Expected WorkoutSet or null",
);

/** Active view while the session runs (one index at a time). */
export class WorkoutSessionSnapshot {
  readonly status: WorkoutSessionStatus;
  readonly currentSetIndex: PositiveIntOrZero;
  /** Zero only when the session has finished. */
  readonly remainingSeconds: PositiveIntOrZero;
  readonly currentSet: WorkoutSet;
  readonly previous: WorkoutSet | null;
  readonly upcoming: WorkoutSet | null;

  constructor(init: {
    status: WorkoutSessionStatus;
    currentSetIndex: number;
    remainingSeconds: number;
    currentSet: WorkoutSet;
    previous: WorkoutSet | null;
    upcoming: WorkoutSet | null;
  }) {
    this.status = workoutSessionStatusSchema.parse(init.status);
    this.currentSetIndex = positiveIntOrZeroSchema.parse(init.currentSetIndex);
    this.remainingSeconds = positiveIntOrZeroSchema.parse(init.remainingSeconds);
    this.currentSet = workoutSetSchema.parse(init.currentSet);
    this.previous = workoutSetNullableSchema.parse(init.previous);
    this.upcoming = workoutSetNullableSchema.parse(init.upcoming);
  }
}

export const workoutSessionSnapshotSchema = z.custom<WorkoutSessionSnapshot>(
  (value) => value instanceof WorkoutSessionSnapshot,
  "Expected WorkoutSessionSnapshot",
);
