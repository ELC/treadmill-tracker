import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import "./WorkoutStartListItem.scss";

import { WorkoutPickerCardContent } from "./WorkoutPickerCardContent.js";
import type { StartWorkoutOption } from "../../workout/library/startWorkoutOptions.js";

type WorkoutStartListItemProps = {
  option: StartWorkoutOption;
};

export function WorkoutStartListItem({
  option,
}: WorkoutStartListItemProps): ReactElement {
  const { entry, workout } = option;
  const runPath = `/run?workout=${encodeURIComponent(entry.key)}`;

  return (
    <li className="workout-start-item">
      <Link
        className="workout-picker-card"
        data-testid={`workout-start-item-${entry.key}`}
        to={runPath}
      >
        <WorkoutPickerCardContent workout={workout} />
      </Link>
    </li>
  );
}
