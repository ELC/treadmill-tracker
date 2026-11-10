import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import "./RunPage.scss";

import { WorkoutRunner } from "../WorkoutRunner/index.js";

const RUN_BACK_ICON = "←";

export function RunPage(): ReactElement {
  return (
    <div className="workout-run-shell" data-testid="workout-run-shell">
      <Link
        className="workout-run-shell__back"
        data-testid="workout-run-back"
        to="/start"
        aria-label="Back to workouts"
      >
        {RUN_BACK_ICON}
      </Link>
      <WorkoutRunner />
    </div>
  );
}
