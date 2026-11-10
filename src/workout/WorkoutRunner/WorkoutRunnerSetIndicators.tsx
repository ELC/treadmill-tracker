import type { CSSProperties, ReactElement } from "react";
import { match } from "ts-pattern";

import { setProgressForRemaining } from "../lib/index.js";
import {
  positiveIntOrZeroSchema,
  WorkoutSessionStatus,
  type PositiveIntOrZero,
  type Workout,
  type WorkoutSessionSnapshot,
} from "../models/index.js";

import "./WorkoutRunnerSetIndicators.scss";

type SetIndicatorDotProps = {
  setIndex: PositiveIntOrZero;
  snapshot: WorkoutSessionSnapshot;
};

type WorkoutRunnerSetIndicatorsProps = {
  workout: Workout;
  snapshot: WorkoutSessionSnapshot;
};

function SetIndicatorDot({
  setIndex,
  snapshot,
}: SetIndicatorDotProps): ReactElement {
  const testId = `workout-set-indicator-${setIndex}`;

  return match({ setIndex, currentSetIndex: snapshot.currentSetIndex })
    .when(
      ({ setIndex: index, currentSetIndex: current }) => index < current,
      () => (
        <span
          className="workout-set-indicators__dot workout-set-indicators__dot--completed"
          data-testid={testId}
          data-indicator-state="completed"
        />
      ),
    )
    .when(
      ({ setIndex: index, currentSetIndex: current }) => index === current,
      () => {
        const setProgress = setProgressForRemaining(snapshot);
        const progressStyle = {
          "--workout-set-indicator-ratio": String(setProgress.fraction),
        } as CSSProperties;
        return (
          <span
            className="workout-set-indicators__dot workout-set-indicators__dot--current"
            data-testid={testId}
            data-indicator-state="current"
            style={progressStyle}
          />
        );
      },
    )
    .otherwise(() => (
      <span
        className="workout-set-indicators__dot workout-set-indicators__dot--upcoming"
        data-testid={testId}
        data-indicator-state="upcoming"
      />
    ));
}

export function WorkoutRunnerSetIndicators({
  workout,
  snapshot,
}: WorkoutRunnerSetIndicatorsProps): ReactElement {
  const isFinished = snapshot.status === WorkoutSessionStatus.Finished;

  if (isFinished) {
    return (
      <div
        className="workout-set-indicators workout-set-indicators--hidden"
        data-testid="workout-set-indicators"
        aria-hidden="true"
      />
    );
  }

  const setIndicatorDots = workout.sets.map((set, setIndex) => (
    <SetIndicatorDot
      key={set.id}
      setIndex={positiveIntOrZeroSchema.parse(setIndex)}
      snapshot={snapshot}
    />
  ));
  const indicatorsStyle = {
    "--workout-set-indicator-count": String(workout.sets.length),
  } as CSSProperties;

  return (
    <div
      className="workout-set-indicators"
      data-testid="workout-set-indicators"
      aria-label="Sets in this workout"
      style={indicatorsStyle}
    >
      {setIndicatorDots}
    </div>
  );
}
