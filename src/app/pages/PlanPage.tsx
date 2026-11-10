import { useMemo, type ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./PlanPage.scss";

import { WorkoutPlanListItem } from "./WorkoutPlanListItem.js";
import { startWorkoutOptions } from "../../workout/library/startWorkoutOptions.js";
import { useWorkoutLibrary } from "../../workout/library/WorkoutLibraryContext.js";
import {
  WorkoutListSources,
  type WorkoutListEntry,
} from "../../workout/library/workoutLibrary.js";
import { workoutIdSchema } from "../../workout/index.js";

export function PlanPage(): ReactElement {
  const navigate = useNavigate();
  const { savedWorkouts, deleteWorkout, revision } = useWorkoutLibrary();
  const workoutOptions = useMemo(
    () => startWorkoutOptions(savedWorkouts),
    [savedWorkouts, revision],
  );

  const handleDelete = (entry: WorkoutListEntry): void => {
    if (entry.source !== WorkoutListSources.Saved) {
      return;
    }
    deleteWorkout(workoutIdSchema.parse(entry.key));
  };

  const handleEdit = (entryKey: string): void => {
    void navigate(`/plan/${encodeURIComponent(entryKey)}`);
  };

  const planHeader = (
    <header className="workout-plan__header">
      <Link
        className="workout-plan__back"
        data-testid="workout-plan-back"
        to="/"
        aria-label="Back to home"
      >
        ←
      </Link>
      <h1 className="workout-plan__title">Workout planning</h1>
      <Link
        className="workout-plan__add"
        data-testid="workout-plan-add"
        to="/plan/new"
      >
        Add workout
      </Link>
    </header>
  );

  const planListItems = workoutOptions.map((option) => (
    <WorkoutPlanListItem
      key={`${option.entry.source}-${option.entry.key}-${String(revision)}`}
      option={option}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  ));

  const planWorkoutList = (
    <ul className="workout-plan__list">{planListItems}</ul>
  );

  return (
    <div className="workout-plan" data-testid="workout-plan">
      {planHeader}
      {planWorkoutList}
    </div>
  );
}
