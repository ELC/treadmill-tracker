import type { ReactElement } from "react";

import type { WorkoutSessionActions } from "../hooks/index.js";
import type { WorkoutSessionSnapshot } from "../models/index.js";

type WorkoutRunnerPreviousButtonProps = {
  snapshot: WorkoutSessionSnapshot;
  actions: WorkoutSessionActions;
};

export function WorkoutRunnerPreviousButton({
  snapshot,
  actions,
}: WorkoutRunnerPreviousButtonProps): ReactElement {
  const disabled = snapshot.currentSetIndex === 0;

  return (
    <button
      type="button"
      className="workout-runner__control workout-runner__control--nav workout-runner__control--nav-previous"
      data-testid="workout-controls-previous"
      aria-label="Previous set"
      disabled={disabled}
      onClick={actions.goToPreviousSet}
    >
      ➤
    </button>
  );
}
