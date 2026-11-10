import {
  positiveIntOrZeroSchema,
  positiveIntSchema,
  type PositiveIntOrZero,
} from "../types.js";
import type { WorkoutSet } from "../workoutSet.js";
import { WorkoutSessionStatus } from "../workoutSession.js";

export abstract class WorkoutSessionStateBase {
  readonly currentSetIndex: PositiveIntOrZero;
  /**
   * Set countdown seconds. `0` means the current set timer has reached zero
   * (used when the session has finished).
   */
  readonly remainingSeconds: number;
  abstract readonly status: WorkoutSessionStatus;

  constructor(currentSetIndex: PositiveIntOrZero, remainingSeconds: number) {
    this.currentSetIndex = positiveIntOrZeroSchema.parse(currentSetIndex);
    this.remainingSeconds = positiveIntOrZeroSchema.parse(remainingSeconds);
  }

  protected static fromWorkoutSet(setIndex: number, set: WorkoutSet) {
    return {
      currentSetIndex: positiveIntOrZeroSchema.parse(setIndex),
      remainingSeconds: set.durationSeconds,
    };
  }
}

export abstract class RunningWorkoutSessionStateBase extends WorkoutSessionStateBase {
  readonly status = WorkoutSessionStatus.Running;
  readonly isTimerActive = true;

  constructor(currentSetIndex: PositiveIntOrZero, remainingSeconds: number) {
    super(currentSetIndex, positiveIntSchema.parse(remainingSeconds));
  }
}

export abstract class PausedWorkoutSessionStateBase extends WorkoutSessionStateBase {
  readonly status = WorkoutSessionStatus.Paused;
  readonly isTimerActive = false;

  constructor(currentSetIndex: PositiveIntOrZero, remainingSeconds: number) {
    super(currentSetIndex, positiveIntSchema.parse(remainingSeconds));
  }
}
