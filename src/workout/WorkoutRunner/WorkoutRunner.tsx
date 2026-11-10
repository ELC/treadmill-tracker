import "./WorkoutRunner.scss";

import { useEffect, type ReactElement } from "react";

import {
  useActiveWorkout,
  useSessionStatistics,
  useWorkoutSession,
} from "../hooks/index.js";
import { WorkoutRunnerBody } from "./WorkoutRunnerBody.js";
import { WorkoutRunnerPausedOverlay } from "./WorkoutRunnerPausedStatus.js";

export function WorkoutRunner(): ReactElement {
  const workout = useActiveWorkout();
  const { sessionStatistics, ...statisticsActions } =
    useSessionStatistics(workout);
  const { snapshot, ...actions } = useWorkoutSession(workout, statisticsActions);

  useEffect(() => {
    document.title = workout.name;
  }, [workout.name]);

  return (
    <>
      <WorkoutRunnerPausedOverlay snapshot={snapshot} />
      <WorkoutRunnerBody
        snapshot={snapshot}
        workout={workout}
        sessionStatistics={sessionStatistics}
        actions={actions}
      />
    </>
  );
}
