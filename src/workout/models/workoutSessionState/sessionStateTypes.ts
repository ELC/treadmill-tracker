import type { LastPausedWorkoutSessionState } from "./lastWorkoutSessionState.js";
import type { LastWorkoutSessionState } from "./lastWorkoutSessionState.js";
import type { RunningPausedWorkoutSessionState } from "./runningWorkoutSessionState.js";
import type { RunningWorkoutSessionState } from "./runningWorkoutSessionState.js";
import type { StartedPausedWorkoutSessionState } from "./startedWorkoutSessionState.js";
import type { StartedWorkoutSessionState } from "./startedWorkoutSessionState.js";
import type { FinishedWorkoutSessionState } from "./finishedWorkoutSessionState.js";

export type ActiveWorkoutSessionState =
  | StartedWorkoutSessionState
  | RunningWorkoutSessionState
  | LastWorkoutSessionState;

export type PausedActiveWorkoutSessionState =
  | StartedPausedWorkoutSessionState
  | RunningPausedWorkoutSessionState
  | LastPausedWorkoutSessionState;

export type WorkoutSessionState =
  | ActiveWorkoutSessionState
  | PausedActiveWorkoutSessionState
  | FinishedWorkoutSessionState;

/** Active or paused states that expose `goToUpcoming` (not last set). */
export type HasUpcomingWorkoutSessionState =
  | StartedWorkoutSessionState
  | RunningWorkoutSessionState
  | StartedPausedWorkoutSessionState
  | RunningPausedWorkoutSessionState;

/** Active or paused states that expose `goToPrevious` (not first set). */
export type HasPreviousWorkoutSessionState =
  | RunningWorkoutSessionState
  | LastWorkoutSessionState
  | RunningPausedWorkoutSessionState
  | LastPausedWorkoutSessionState;
