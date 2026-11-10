import { useRef, type ReactElement } from "react";

import {
  useWorkoutRunnerSessionControls,
  type WorkoutSessionActions,
} from "../hooks/index.js";
import type {
  SessionRunStatistics,
  Workout,
  WorkoutSessionSnapshot,
} from "../models/index.js";
import { WorkoutRunnerFocus } from "./WorkoutRunnerFocus.js";
import { WorkoutRunnerFooter } from "./WorkoutRunnerFooter.js";
import { WorkoutRunnerHeader } from "./WorkoutRunnerHeader.js";
import { WorkoutRunnerSessionProvider } from "./WorkoutRunnerSessionContext.js";

type WorkoutRunnerBodyProps = {
  snapshot: WorkoutSessionSnapshot;
  workout: Workout;
  sessionStatistics: SessionRunStatistics;
  actions: WorkoutSessionActions;
};

export function WorkoutRunnerBody({
  snapshot,
  workout,
  sessionStatistics,
  actions,
}: WorkoutRunnerBodyProps): ReactElement {
  const gestureSurfaceRef = useRef<HTMLDivElement>(null);
  useWorkoutRunnerSessionControls(gestureSurfaceRef, snapshot, actions);

  return (
    <WorkoutRunnerSessionProvider sessionStatistics={sessionStatistics}>
      <div className="workout-runner" data-testid="workout-runner">
        <div
          ref={gestureSurfaceRef}
          className="workout-runner__body"
          data-testid="workout-runner-gesture-surface"
        >
          <WorkoutRunnerHeader workout={workout} />
          <WorkoutRunnerFocus snapshot={snapshot} />
        </div>
        <WorkoutRunnerFooter
          workout={workout}
          snapshot={snapshot}
          actions={actions}
        />
      </div>
    </WorkoutRunnerSessionProvider>
  );
}
