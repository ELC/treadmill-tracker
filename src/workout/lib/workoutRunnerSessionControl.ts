import {
  WorkoutSessionStatus,
  type WorkoutSessionSnapshot,
} from "../models/index.js";
import type { WorkoutSessionActions } from "../hooks/index.js";

export function workoutRunnerSessionIsControllable(
  snapshot: WorkoutSessionSnapshot,
): boolean {
  return snapshot.status !== WorkoutSessionStatus.Finished;
}

export function workoutRunnerCanGoPrevious(
  snapshot: WorkoutSessionSnapshot,
): boolean {
  return snapshot.currentSetIndex > 0;
}

export function workoutRunnerCanGoNext(
  snapshot: WorkoutSessionSnapshot,
): boolean {
  return snapshot.upcoming !== null;
}

export function workoutRunnerInvokePrevious(
  snapshot: WorkoutSessionSnapshot,
  actions: WorkoutSessionActions,
): void {
  if (!workoutRunnerSessionIsControllable(snapshot)) {
    return;
  }
  if (!workoutRunnerCanGoPrevious(snapshot)) {
    return;
  }
  actions.goToPreviousSet();
}

export function workoutRunnerInvokeNext(
  snapshot: WorkoutSessionSnapshot,
  actions: WorkoutSessionActions,
): void {
  if (!workoutRunnerSessionIsControllable(snapshot)) {
    return;
  }
  if (!workoutRunnerCanGoNext(snapshot)) {
    return;
  }
  actions.goToNextSet();
}

export function workoutRunnerInvokePauseToggle(
  snapshot: WorkoutSessionSnapshot,
  actions: WorkoutSessionActions,
): void {
  if (!workoutRunnerSessionIsControllable(snapshot)) {
    return;
  }
  if (snapshot.status === WorkoutSessionStatus.Paused) {
    actions.resume();
  } else {
    actions.pause();
  }
}
