import type { ReactElement } from "react";

import "./WorkoutCompletePanel.scss";

import { SessionRunStatisticsDisplay } from "../models/index.js";
import { useWorkoutRunnerSession } from "./WorkoutRunnerSessionContext.js";

export function WorkoutCompletePanel(): ReactElement {
  const { sessionStatistics } = useWorkoutRunnerSession();
  const {
    sessionElapsedText,
    sessionDistanceKmText,
    averageSpeedKmhText,
    averageInclinePercentText,
  } = new SessionRunStatisticsDisplay(sessionStatistics);

  return (
    <section
      className="workout-complete"
      data-testid="workout-complete"
    >
      <div className="workout-complete__lead">
        <h2 className="workout-complete__heading">Congratulations</h2>
        <div className="workout-complete__distance">
          <span className="workout-complete__distance-name">Total distance</span>
          <span
            className="workout-complete__distance-value"
            data-testid="workout-complete-total-distance"
          >
            {sessionDistanceKmText}
          </span>
        </div>
      </div>
      <dl className="workout-complete__stats">
        <div className="workout-complete__stat">
          <dt className="workout-complete__stat-name">Total time</dt>
          <dd
            className="workout-complete__stat-value"
            data-testid="workout-complete-total-time"
          >
            {sessionElapsedText}
          </dd>
        </div>
        <div className="workout-complete__stat">
          <dt className="workout-complete__stat-name">Average speed (km/h)</dt>
          <dd
            className="workout-complete__stat-value"
            data-testid="workout-complete-average-speed"
          >
            {averageSpeedKmhText}
          </dd>
        </div>
        <div className="workout-complete__stat">
          <dt className="workout-complete__stat-name">Average incline</dt>
          <dd
            className="workout-complete__stat-value"
            data-testid="workout-complete-average-incline"
          >
            {averageInclinePercentText}
          </dd>
        </div>
      </dl>
    </section>
  );
}
