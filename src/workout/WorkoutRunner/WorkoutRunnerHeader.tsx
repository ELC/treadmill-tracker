import type { ReactElement } from "react";

import {
  SessionRunStatisticsDisplay,
  type Workout,
} from "../models/index.js";
import { useWorkoutRunnerSession } from "./WorkoutRunnerSessionContext.js";

type WorkoutRunnerHeaderProps = {
  workout: Workout;
};

export function WorkoutRunnerHeader({
  workout,
}: WorkoutRunnerHeaderProps): ReactElement {
  const { sessionStatistics } = useWorkoutRunnerSession();
  const { sessionElapsedText } = new SessionRunStatisticsDisplay(
    sessionStatistics,
  );

  return (
    <header className="workout-runner__header">
      <p
        className="workout-runner__session-active"
        data-testid="workout-runner-session-elapsed"
      >
        <span
          className="workout-runner__session-active-value"
          data-testid="workout-runner-session-elapsed-value"
        >
          {sessionElapsedText}
        </span>
      </p>
      <h1
        className="workout-runner__title"
        data-testid="workout-runner-title"
      >
        {workout.name}
      </h1>
    </header>
  );
}
