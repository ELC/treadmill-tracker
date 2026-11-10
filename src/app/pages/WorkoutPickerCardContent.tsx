import type { ReactElement } from "react";

import "./WorkoutPickerCard.scss";

import { WorkoutPickerSummaryDisplay } from "../../workout/lib/workoutPickerSummary.js";
import type { Workout } from "../../workout/index.js";

type WorkoutPickerCardContentProps = {
  workout: Workout;
};

export function WorkoutPickerCardContent({
  workout,
}: WorkoutPickerCardContentProps): ReactElement {
  const {
    totalDurationText,
    totalDistanceKmText,
    averageSpeedKmhText,
    averageInclinePercentText,
  } = new WorkoutPickerSummaryDisplay(workout);

  return (
    <>
      <h2 className="workout-picker-card__name">{workout.name}</h2>
      <dl className="workout-picker-card__stats">
        <div className="workout-picker-card__stat">
          <dt className="workout-picker-card__stat-term">Time</dt>
          <dd className="workout-picker-card__stat-value">{totalDurationText}</dd>
        </div>
        <div className="workout-picker-card__stat">
          <dt className="workout-picker-card__stat-term">Distance</dt>
          <dd className="workout-picker-card__stat-value">{totalDistanceKmText}</dd>
        </div>
        <div className="workout-picker-card__stat">
          <dt className="workout-picker-card__stat-term">Speed</dt>
          <dd className="workout-picker-card__stat-value">{averageSpeedKmhText}</dd>
        </div>
        <div className="workout-picker-card__stat">
          <dt className="workout-picker-card__stat-term">Incline</dt>
          <dd className="workout-picker-card__stat-value">
            {averageInclinePercentText}
          </dd>
        </div>
      </dl>
    </>
  );
}
