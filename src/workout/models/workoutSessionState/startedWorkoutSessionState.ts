import {
  positiveIntOrZeroSchema,
  positiveIntSchema,
} from "../types.js";
import type { Workout } from "../workout.js";
import { FinishedWorkoutSessionState } from "./finishedWorkoutSessionState.js";
import { LastWorkoutSessionState } from "./lastWorkoutSessionState.js";
import type { LastPausedWorkoutSessionState } from "./lastWorkoutSessionState.js";
import {
  RunningWorkoutSessionState,
  type RunningPausedWorkoutSessionState,
} from "./runningWorkoutSessionState.js";
import {
  PausedWorkoutSessionStateBase,
  RunningWorkoutSessionStateBase,
  WorkoutSessionStateBase,
} from "./workoutSessionStateBase.js";

export class StartedWorkoutSessionState extends RunningWorkoutSessionStateBase {
  static fromWorkout(workout: Workout): StartedWorkoutSessionState {
    const set = workout.setAt(0);
    return new StartedWorkoutSessionState(set.durationSeconds);
  }

  constructor(remainingSeconds: number) {
    super(positiveIntOrZeroSchema.parse(0), remainingSeconds);
  }

  pause(): StartedPausedWorkoutSessionState {
    return new StartedPausedWorkoutSessionState(this.remainingSeconds);
  }

  tick(
    workout: Workout,
  ):
    | StartedWorkoutSessionState
    | RunningWorkoutSessionState
    | LastWorkoutSessionState
    | FinishedWorkoutSessionState {
    if (this.remainingSeconds > 1) {
      return new StartedWorkoutSessionState(
        positiveIntSchema.parse(this.remainingSeconds - 1),
      );
    }

    if (workout.sets.length === 1) {
      return new FinishedWorkoutSessionState(this.currentSetIndex);
    }

    const fields = WorkoutSessionStateBase.fromWorkoutSet(
      1,
      workout.setAt(1),
    );
    const lastIndex = workout.sets.length - 1;
    if (fields.currentSetIndex < lastIndex) {
      return new RunningWorkoutSessionState(
        fields.currentSetIndex,
        fields.remainingSeconds,
      );
    }
    return new LastWorkoutSessionState(
      fields.currentSetIndex,
      fields.remainingSeconds,
    );
  }

  goToUpcoming(
    workout: Workout,
  ): RunningWorkoutSessionState | LastWorkoutSessionState {
    const nextIndex = this.currentSetIndex + 1;
    const fields = WorkoutSessionStateBase.fromWorkoutSet(
      nextIndex,
      workout.setAt(nextIndex),
    );
    const lastIndex = workout.sets.length - 1;
    if (fields.currentSetIndex < lastIndex) {
      return new RunningWorkoutSessionState(
        fields.currentSetIndex,
        fields.remainingSeconds,
      );
    }
    return new LastWorkoutSessionState(
      fields.currentSetIndex,
      fields.remainingSeconds,
    );
  }
}

export class StartedPausedWorkoutSessionState extends PausedWorkoutSessionStateBase {
  constructor(remainingSeconds: number) {
    super(positiveIntOrZeroSchema.parse(0), remainingSeconds);
  }

  resume(): StartedWorkoutSessionState {
    return new StartedWorkoutSessionState(this.remainingSeconds);
  }

  goToUpcoming(
    workout: Workout,
  ): RunningPausedWorkoutSessionState | LastPausedWorkoutSessionState {
    return this.resume().goToUpcoming(workout).pause();
  }
}
