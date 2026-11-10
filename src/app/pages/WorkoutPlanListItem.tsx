import type { ReactElement } from "react";

import "./WorkoutPlanListItem.scss";

import { WorkoutPickerCardContent } from "./WorkoutPickerCardContent.js";
import type { StartWorkoutOption } from "../../workout/library/startWorkoutOptions.js";
import {
  WorkoutListSources,
  type WorkoutListEntry,
} from "../../workout/library/workoutLibrary.js";

type WorkoutPlanListItemProps = {
  option: StartWorkoutOption;
  onEdit: (entryKey: string) => void;
  onDelete: (entry: WorkoutListEntry) => void;
};

export function WorkoutPlanListItem({
  option,
  onEdit,
  onDelete,
}: WorkoutPlanListItemProps): ReactElement {
  const { entry, workout } = option;

  const handleEdit = (): void => {
    onEdit(entry.key);
  };

  const handleDelete = (): void => {
    onDelete(entry);
  };

  const deleteControl =
    entry.source === WorkoutListSources.Saved ?
      <button
        type="button"
        className="workout-plan-item__delete"
        data-testid={`workout-plan-delete-${entry.key}`}
        aria-label={`Delete ${entry.name}`}
        onClick={handleDelete}
      >
        Delete
      </button>
    : null;

  return (
    <li className="workout-plan-item">
      <button
        type="button"
        className="workout-picker-card workout-plan-item__main"
        data-testid={`workout-plan-edit-${entry.key}`}
        onClick={handleEdit}
      >
        <WorkoutPickerCardContent workout={workout} />
      </button>
      {deleteControl}
    </li>
  );
}
