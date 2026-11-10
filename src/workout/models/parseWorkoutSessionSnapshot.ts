import { Workout } from "./workout.js";
import { WorkoutSessionSnapshot } from "./workoutSession.js";
import type { WorkoutSessionState } from "./workoutSessionState/index.js";

/** Active view at `state.currentSetIndex`. */
export function parseWorkoutSessionSnapshot(
  workout: Workout,
  state: WorkoutSessionState,
): WorkoutSessionSnapshot {
  const index = state.currentSetIndex;
  const lastIndex = workout.sets.length - 1;

  return new WorkoutSessionSnapshot({
    status: state.status,
    currentSetIndex: index,
    remainingSeconds: state.remainingSeconds,
    currentSet: workout.setAt(index),
    previous: index > 0 ? workout.setAt(index - 1) : null,
    upcoming: index < lastIndex ? workout.setAt(index + 1) : null,
  });
}
