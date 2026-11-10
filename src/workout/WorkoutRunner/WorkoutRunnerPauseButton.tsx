import type { ReactElement } from "react";

import type { WorkoutSessionActions } from "../hooks/index.js";
import {
  WorkoutSessionStatus,
  type WorkoutSessionSnapshot,
} from "../models/index.js";

type WorkoutRunnerPauseButtonProps = {
  snapshot: WorkoutSessionSnapshot;
  actions: WorkoutSessionActions;
};

export function WorkoutRunnerPauseButton({
  snapshot,
  actions,
}: WorkoutRunnerPauseButtonProps): ReactElement {
  const isPaused = snapshot.status === WorkoutSessionStatus.Paused;
  const ariaLabel = isPaused ? "Resume" : "Pause";
  const handleClick = isPaused ? actions.resume : actions.pause;
  const label = isPaused ? "▶" : "⏸";

  return (
    <button
      type="button"
      className="workout-runner__control workout-runner__control--primary workout-runner__control--pause"
      data-testid="workout-controls-pause"
      aria-label={ariaLabel}
      aria-pressed={isPaused}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}
