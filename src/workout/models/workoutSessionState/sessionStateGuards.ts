import {
  LastPausedWorkoutSessionState,
  LastWorkoutSessionState,
} from "./lastWorkoutSessionState.js";
import {
  RunningPausedWorkoutSessionState,
  RunningWorkoutSessionState,
} from "./runningWorkoutSessionState.js";
import {
  StartedPausedWorkoutSessionState,
  StartedWorkoutSessionState,
} from "./startedWorkoutSessionState.js";
import type {
  HasPreviousWorkoutSessionState,
  HasUpcomingWorkoutSessionState,
  WorkoutSessionState,
} from "./sessionStateTypes.js";

export function hasUpcoming(
  state: WorkoutSessionState,
): state is HasUpcomingWorkoutSessionState {
  return (
    state instanceof StartedWorkoutSessionState ||
    state instanceof RunningWorkoutSessionState ||
    state instanceof StartedPausedWorkoutSessionState ||
    state instanceof RunningPausedWorkoutSessionState
  );
}

export function hasPrevious(
  state: WorkoutSessionState,
): state is HasPreviousWorkoutSessionState {
  return (
    state instanceof RunningWorkoutSessionState ||
    state instanceof LastWorkoutSessionState ||
    state instanceof RunningPausedWorkoutSessionState ||
    state instanceof LastPausedWorkoutSessionState
  );
}
