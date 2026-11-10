import { positiveIntSchema, type PositiveIntOrZero } from "../types.js";
import type { Workout } from "../workout.js";
import { FinishedWorkoutSessionState } from "./finishedWorkoutSessionState.js";
import { LastWorkoutSessionState } from "./lastWorkoutSessionState.js";
import type { LastPausedWorkoutSessionState } from "./lastWorkoutSessionState.js";
import {
  PausedWorkoutSessionStateBase,
  RunningWorkoutSessionStateBase,
  WorkoutSessionStateBase,
} from "./workoutSessionStateBase.js";
import {
  StartedWorkoutSessionState,
  type StartedPausedWorkoutSessionState,
} from "./startedWorkoutSessionState.js";

export class RunningWorkoutSessionState extends RunningWorkoutSessionStateBase {
  constructor(
    currentSetIndex: PositiveIntOrZero,
    remainingSeconds: number,
  ) {
    super(currentSetIndex, remainingSeconds);
  }

  pause(): RunningPausedWorkoutSessionState {
    return new RunningPausedWorkoutSessionState(
      this.currentSetIndex,
      this.remainingSeconds,
    );
  }

  tick(
    workout: Workout,
  ):
    | RunningWorkoutSessionState
    | LastWorkoutSessionState
    | FinishedWorkoutSessionState {
    if (this.remainingSeconds > 1) {
      return new RunningWorkoutSessionState(
        this.currentSetIndex,
        positiveIntSchema.parse(this.remainingSeconds - 1),
      );
    }

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

  goToPrevious(
    workout: Workout,
  ): StartedWorkoutSessionState | RunningWorkoutSessionState {
    const previousIndex = this.currentSetIndex - 1;
    const fields = WorkoutSessionStateBase.fromWorkoutSet(
      previousIndex,
      workout.setAt(previousIndex),
    );
    if (fields.currentSetIndex === 0) {
      return new StartedWorkoutSessionState(fields.remainingSeconds);
    }
    return new RunningWorkoutSessionState(
      fields.currentSetIndex,
      fields.remainingSeconds,
    );
  }
}

export class RunningPausedWorkoutSessionState extends PausedWorkoutSessionStateBase {
  constructor(
    currentSetIndex: PositiveIntOrZero,
    remainingSeconds: number,
  ) {
    super(currentSetIndex, remainingSeconds);
  }

  resume(): RunningWorkoutSessionState {
    return new RunningWorkoutSessionState(
      this.currentSetIndex,
      this.remainingSeconds,
    );
  }

  goToUpcoming(
    workout: Workout,
  ): RunningPausedWorkoutSessionState | LastPausedWorkoutSessionState {
    return this.resume().goToUpcoming(workout).pause();
  }

  goToPrevious(
    workout: Workout,
  ): StartedPausedWorkoutSessionState | RunningPausedWorkoutSessionState {
    return this.resume().goToPrevious(workout).pause();
  }
}
