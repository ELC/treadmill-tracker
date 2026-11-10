import type { ReactElement } from "react";

import type { WorkoutSessionActions } from "../hooks/index.js";

type WorkoutCompleteControlsProps = {
  actions: WorkoutSessionActions;
};

export function WorkoutCompleteControls({
  actions,
}: WorkoutCompleteControlsProps): ReactElement {
  return (
    <div className="workout-runner__controls">
      <button
        type="button"
        className="workout-runner__control workout-runner__control--nav workout-runner__control--nav-previous"
        data-testid="workout-complete-back"
        aria-label="Back"
        onClick={actions.backFromCompletion}
      >
        ➤
      </button>
      <span
        className="workout-runner__control-spacer"
        aria-hidden="true"
      />
      <button
        type="button"
        className="workout-runner__control workout-runner__control--primary workout-runner__control--restart"
        data-testid="workout-complete-restart"
        aria-label="Restart"
        onClick={actions.restartSession}
      >
        ↻
      </button>
    </div>
  );
}
