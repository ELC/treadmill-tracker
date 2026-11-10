import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  parseWorkoutSessionSnapshot,
  StartedWorkoutSessionState,
  type Workout,
  type WorkoutSessionSnapshot,
  type WorkoutSessionState,
} from "../models/index.js";
import type { WorkoutSessionActions } from "./workoutSessionActions.js";
import {
  CommitNoSessionTransition,
  WorkoutSessionController,
  type CommitSessionTransitionInput,
} from "../session/index.js";
import type { SessionStatisticsActions } from "./useSessionStatistics.js";

export type { WorkoutSessionActions } from "./workoutSessionActions.js";

const MS_PER_SECOND = 1000;
const TIMER_POLL_MS = 250;

export type UseWorkoutSessionReturn = WorkoutSessionActions & {
  snapshot: WorkoutSessionSnapshot;
};

/**
 * React adapter for {@link WorkoutSessionController}. Every transition is
 * reported to **`recordTransition`** in the same synchronous turn as
 * **`setState`** so credits line up with UI commits (React 18 batching).
 */
export function useWorkoutSession(
  workout: Workout,
  statisticsActions: SessionStatisticsActions,
): UseWorkoutSessionReturn {
  const { recordTransition, resetStatistics } = statisticsActions;

  const controller = useMemo(
    () => WorkoutSessionController.forWorkout(workout),
    [workout],
  );

  const [state, setState] = useState<WorkoutSessionState>(() =>
    StartedWorkoutSessionState.fromWorkout(workout),
  );
  const [stateWorkout, setStateWorkout] = useState(workout);

  if (stateWorkout !== workout) {
    setStateWorkout(workout);
    setState(controller.sessionState);
  }

  const commit = useCallback(
    (transition: CommitSessionTransitionInput) => {
      const recordInput = controller.advance(transition);
      if (recordInput instanceof CommitNoSessionTransition) {
        return;
      }
      recordTransition(recordInput);
      setState(recordInput.next);
    },
    [controller, recordTransition],
  );

  useEffect(() => {
    if (!state.isTimerActive) {
      return;
    }

    // Wall clock, not interval count: browsers throttle or suspend intervals in
    // background tabs and on a locked screen. `Date.now()` (unlike
    // `performance.now()`) keeps advancing across device sleep on iOS.
    let lastCountedAt = Date.now();

    const commitElapsedSeconds = (): void => {
      const now = Date.now();
      if (now < lastCountedAt) {
        lastCountedAt = now;
        return;
      }
      const dueSeconds = Math.floor((now - lastCountedAt) / MS_PER_SECOND);
      lastCountedAt += dueSeconds * MS_PER_SECOND;
      for (let tick = 0; tick < dueSeconds; tick += 1) {
        commit(controller.elapsedTickCommit());
      }
    };

    const timerId = window.setInterval(commitElapsedSeconds, TIMER_POLL_MS);
    document.addEventListener("visibilitychange", commitElapsedSeconds);

    return () => {
      window.clearInterval(timerId);
      document.removeEventListener("visibilitychange", commitElapsedSeconds);
    };
  }, [commit, controller, state.isTimerActive]);

  const snapshot = useMemo(
    () => parseWorkoutSessionSnapshot(workout, state),
    [state, workout],
  );

  const pause = useCallback(() => {
    const transition = controller.pauseCommit();
    commit(transition);
  }, [commit, controller]);

  const resume = useCallback(() => {
    const transition = controller.resumeCommit();
    commit(transition);
  }, [commit, controller]);

  const goToNextSet = useCallback(() => {
    const transition = controller.goToNextSetCommit();
    commit(transition);
  }, [commit, controller]);

  const goToPreviousSet = useCallback(() => {
    const transition = controller.goToPreviousSetCommit();
    commit(transition);
  }, [commit, controller]);

  const restartSession = useCallback(() => {
    resetStatistics();
    setState(controller.restartSessionState());
  }, [controller, resetStatistics]);

  const backFromCompletion = useCallback(() => {
    const transition = controller.backFromCompletionCommit();
    commit(transition);
  }, [commit, controller]);

  return {
    snapshot,
    pause,
    resume,
    goToNextSet,
    goToPreviousSet,
    restartSession,
    backFromCompletion,
  };
}
