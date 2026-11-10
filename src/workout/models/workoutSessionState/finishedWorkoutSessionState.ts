import { WorkoutSessionStatus } from "../workoutSession.js";
import { positiveIntOrZeroSchema } from "../types.js";
import { WorkoutSessionStateBase } from "./workoutSessionStateBase.js";
import type { PositiveIntOrZero } from "../types.js";

export class FinishedWorkoutSessionState extends WorkoutSessionStateBase {
  readonly status = WorkoutSessionStatus.Finished;
  readonly isTimerActive = false;

  constructor(currentSetIndex: PositiveIntOrZero) {
    super(currentSetIndex, positiveIntOrZeroSchema.parse(0));
  }
}
