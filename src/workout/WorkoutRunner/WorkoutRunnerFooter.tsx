import type { ReactElement } from "react";

import type { WorkoutSessionActions } from "../hooks/index.js";
import {
  WorkoutSessionStatus,
  type Workout,
  type WorkoutSessionSnapshot,
} from "../models/index.js";
import { WorkoutRunnerSetIndicators } from "./WorkoutRunnerSetIndicators.js";
import { WorkoutCompleteControls } from "./WorkoutCompleteControls.js";
import { WorkoutRunnerNextButton } from "./WorkoutRunnerNextButton.js";
import { WorkoutRunnerPauseButton } from "./WorkoutRunnerPauseButton.js";
import { WorkoutRunnerPreviousButton } from "./WorkoutRunnerPreviousButton.js";

type WorkoutRunnerFooterProps = {
  workout: Workout;
  snapshot: WorkoutSessionSnapshot;
  actions: WorkoutSessionActions;
};

export function WorkoutRunnerFooter({
  workout,
  snapshot,
  actions,
}: WorkoutRunnerFooterProps): ReactElement | null {
  const isFinished = snapshot.status === WorkoutSessionStatus.Finished;
  if (isFinished) {
    return (
      <div className="workout-runner__footer">
        <WorkoutCompleteControls actions={actions} />
      </div>
    );
  }

  return (
    <div className="workout-runner__footer">
      <WorkoutRunnerSetIndicators workout={workout} snapshot={snapshot} />
      <div className="workout-runner__controls" data-testid="workout-controls">
        <WorkoutRunnerPreviousButton snapshot={snapshot} actions={actions} />
        <WorkoutRunnerPauseButton snapshot={snapshot} actions={actions} />
        <WorkoutRunnerNextButton snapshot={snapshot} actions={actions} />
      </div>
    </div>
  );
}
