import { useCallback, useMemo, useState } from "react";

import { SessionRunStatistics, type Workout } from "../models/index.js";
import {
  SessionStatisticsController,
  type RecordSessionTransitionInput,
} from "../session/index.js";

export type { RecordSessionTransitionInput } from "../session/index.js";

export type SessionStatisticsActions = {
  recordTransition: (input: RecordSessionTransitionInput) => void;
  resetStatistics: () => void;
};

export type UseSessionStatisticsState = {
  readonly sessionStatistics: SessionRunStatistics;
};

export type UseSessionStatisticsReturn = SessionStatisticsActions &
  UseSessionStatisticsState;

/**
 * React adapter for {@link SessionStatisticsController}. Pass actions into
 * **`useWorkoutSession`**.
 */
export function useSessionStatistics(
  workout: Workout,
): UseSessionStatisticsReturn {
  const controller = useMemo(
    () => SessionStatisticsController.forWorkout(workout),
    [workout],
  );

  const [sessionStatistics, setSessionStatistics] = useState(() =>
    SessionRunStatistics.forWorkout(workout),
  );
  const [statisticsWorkout, setStatisticsWorkout] = useState(workout);

  if (statisticsWorkout !== workout) {
    setStatisticsWorkout(workout);
    setSessionStatistics(controller.sessionStatistics);
  }

  const recordTransition = useCallback(
    (input: RecordSessionTransitionInput) => {
      const nextStatistics = controller.recordTransition(input);
      setSessionStatistics(nextStatistics);
    },
    [controller],
  );

  const resetStatistics = useCallback(() => {
    const nextStatistics = controller.reset();
    setSessionStatistics(nextStatistics);
  }, [controller]);

  return {
    sessionStatistics,
    recordTransition,
    resetStatistics,
  };
}
