import type { ReactElement } from "react";

import { CurrentSetPanel, UpcomingSetPanel } from "./SetPanel/index.js";
import { WorkoutCompletePanel } from "./WorkoutCompletePanel.js";
import {
  WorkoutSessionStatus,
  type WorkoutSessionSnapshot,
} from "../models/index.js";

type WorkoutRunnerFocusProps = {
  snapshot: WorkoutSessionSnapshot;
};

export function WorkoutRunnerFocus({
  snapshot,
}: WorkoutRunnerFocusProps): ReactElement {
  const isFinished = snapshot.status === WorkoutSessionStatus.Finished;

  if (isFinished) {
    return (
      <div className="workout-runner__focus workout-runner__focus--complete">
        <WorkoutCompletePanel />
      </div>
    );
  }

  return (
    <div className="workout-runner__focus">
      <div className="workout-runner__focus-current">
        <CurrentSetPanel snapshot={snapshot} />
      </div>
      <UpcomingSetPanel
        snapshot={snapshot}
        emptyLabel="Last set — finish strong"
      />
    </div>
  );
}
