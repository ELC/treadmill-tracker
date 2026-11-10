import type { ReactElement } from "react";

import type { WorkoutSessionActions } from "../hooks/index.js";
import type { WorkoutSessionSnapshot } from "../models/index.js";

type WorkoutRunnerNextButtonProps = {
  snapshot: WorkoutSessionSnapshot;
  actions: WorkoutSessionActions;
};

export function WorkoutRunnerNextButton({
  snapshot,
  actions,
}: WorkoutRunnerNextButtonProps): ReactElement {
  const disabled = snapshot.upcoming === null;

  return (
    <button
      type="button"
      className="workout-runner__control workout-runner__control--nav"
      data-testid="workout-controls-next"
      aria-label="Next set"
      disabled={disabled}
      onClick={actions.goToNextSet}
    >
      ➤
    </button>
  );
}
