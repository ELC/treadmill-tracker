import type { CSSProperties, ReactElement } from "react";
import { match } from "ts-pattern";

import {
  SET_INDICATOR_MAX_VISIBLE,
  setIndicatorWindow,
  setProgressForRemaining,
} from "../lib/index.js";
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

  const { startIndex, endIndex } = setIndicatorWindow(
    workout.sets.length,
    snapshot.currentSetIndex,
  );
  const visibleSets = workout.sets.slice(startIndex, endIndex + 1);
  const usesFixedLayout = workout.sets.length > SET_INDICATOR_MAX_VISIBLE;
  const setIndicatorDots = visibleSets.map((set, offset) => {
    const setIndex = startIndex + offset;
    return (
      <SetIndicatorDot
        key={set.id}
        setIndex={positiveIntOrZeroSchema.parse(setIndex)}
        snapshot={snapshot}
      />
    );
  });
  const omittedBefore = startIndex;
  const omittedAfter = workout.sets.length - 1 - endIndex;
  const dotsStyle = usesFixedLayout
    ? undefined
    : ({
        "--workout-set-indicator-count": String(visibleSets.length),
      } as CSSProperties);
  const rangeLabel =
    workout.sets.length > visibleSets.length
      ? `, showing sets ${String(startIndex + 1)}–${String(endIndex + 1)} of ${String(workout.sets.length)}`
      : "";

  const legendBefore = (
    <span
      className="workout-set-indicators__legend workout-set-indicators__legend--before"
      data-testid="workout-set-indicators-legend-before"
      aria-hidden={omittedBefore === 0}
    >
      {omittedBefore > 0 ? `+${String(omittedBefore)}` : ""}
    </span>
  );
  const legendAfter = (
    <span
      className="workout-set-indicators__legend workout-set-indicators__legend--after"
      data-testid="workout-set-indicators-legend-after"
      aria-hidden={omittedAfter === 0}
    >
      {omittedAfter > 0 ? `+${String(omittedAfter)}` : ""}
    </span>
  );
  const dotsRow = (
    <div className="workout-set-indicators__dots" style={dotsStyle}>
      {setIndicatorDots}
    </div>
  );

  return (
    <div
      className={
        usesFixedLayout
          ? "workout-set-indicators workout-set-indicators--fixed-layout"
          : "workout-set-indicators"
      }
      data-testid="workout-set-indicators"
      aria-label={`Sets in this workout${rangeLabel}`}
    >
      {usesFixedLayout ? (
        <div className="workout-set-indicators__cluster">
          {legendBefore}
          {dotsRow}
          {legendAfter}
        </div>
      ) : (
        <>
          {legendBefore}
          {dotsRow}
          {legendAfter}
        </>
      )}
    </div>
  );
}
