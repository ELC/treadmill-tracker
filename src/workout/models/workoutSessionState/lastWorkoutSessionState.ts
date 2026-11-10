import {
  positiveIntOrZeroSchema,
  positiveIntSchema,
  type PositiveInt,
  type PositiveIntOrZero,
} from "../types.js";
import type { Workout } from "../workout.js";
import type { ActiveWorkoutSessionState } from "./sessionStateTypes.js";
import type { PausedActiveWorkoutSessionState } from "./sessionStateTypes.js";
import { FinishedWorkoutSessionState } from "./finishedWorkoutSessionState.js";
import { RunningWorkoutSessionState } from "./runningWorkoutSessionState.js";
import {
  PausedWorkoutSessionStateBase,
  RunningWorkoutSessionStateBase,
  WorkoutSessionStateBase,
} from "./workoutSessionStateBase.js";
import { StartedWorkoutSessionState } from "./startedWorkoutSessionState.js";

export class LastWorkoutSessionState extends RunningWorkoutSessionStateBase {
  constructor(
    currentSetIndex: PositiveIntOrZero,
    remainingSeconds: PositiveInt,
  ) {
    super(currentSetIndex, remainingSeconds);
  }

  pause(): LastPausedWorkoutSessionState {
    return new LastPausedWorkoutSessionState(
      this.currentSetIndex,
      positiveIntSchema.parse(this.remainingSeconds),
    );
  }

  tick(workout: Workout): LastWorkoutSessionState | FinishedWorkoutSessionState {
    const fields = WorkoutSessionStateBase.fromWorkoutSet(
      this.currentSetIndex,
      workout.setAt(this.currentSetIndex),
    );

    if (this.remainingSeconds > 1) {
      return new LastWorkoutSessionState(
        fields.currentSetIndex,
        positiveIntSchema.parse(this.remainingSeconds - 1),
      );
    }

    return new FinishedWorkoutSessionState(fields.currentSetIndex);
  }

  goToPrevious(workout: Workout): ActiveWorkoutSessionState {
    const previousIndex = this.currentSetIndex - 1;
    const fields = WorkoutSessionStateBase.fromWorkoutSet(
      previousIndex,
      workout.setAt(previousIndex),
    );
    if (fields.currentSetIndex === 0) {
      return new StartedWorkoutSessionState(fields.remainingSeconds);
    }
    const lastIndex = workout.sets.length - 1;
    if (fields.currentSetIndex >= lastIndex) {
      return new LastWorkoutSessionState(
        fields.currentSetIndex,
        fields.remainingSeconds,
      );
    }
    return new RunningWorkoutSessionState(
      fields.currentSetIndex,
      fields.remainingSeconds,
    );
  }
}

export class LastPausedWorkoutSessionState extends PausedWorkoutSessionStateBase {
  static fromWorkout(workout: Workout): LastPausedWorkoutSessionState {
    const lastIndex = workout.sets.length - 1;
    const set = workout.setAt(lastIndex);
    return new LastPausedWorkoutSessionState(
      positiveIntOrZeroSchema.parse(lastIndex),
      set.durationSeconds,
    );
  }

  constructor(
    currentSetIndex: PositiveIntOrZero,
    remainingSeconds: PositiveInt,
  ) {
    super(currentSetIndex, remainingSeconds);
  }

  resume(): LastWorkoutSessionState {
    return new LastWorkoutSessionState(
      this.currentSetIndex,
      positiveIntSchema.parse(this.remainingSeconds),
    );
  }

  goToPrevious(workout: Workout): PausedActiveWorkoutSessionState {
    return this.resume().goToPrevious(workout).pause();
  }
}
