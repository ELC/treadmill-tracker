import { useMemo, type ReactElement } from "react";
import { Link } from "react-router-dom";

import "./StartPage.scss";

import { WorkoutStartListItem } from "./WorkoutStartListItem.js";
import { startWorkoutOptions } from "../../workout/library/startWorkoutOptions.js";
import { useWorkoutLibrary } from "../../workout/library/WorkoutLibraryContext.js";

const START_BACK_ICON = "←";

export function StartPage(): ReactElement {
  const { savedWorkouts, revision } = useWorkoutLibrary();
  const workoutOptions = useMemo(
    () => startWorkoutOptions(savedWorkouts),
    [savedWorkouts],
  );

  const backControl = (
    <Link
      className="workout-start__back"
      data-testid="workout-start-back"
      to="/"
      aria-label="Back to home"
    >
      {START_BACK_ICON}
    </Link>
  );

  const pageHeader = (
    <header className="workout-start__header">{backControl}</header>
  );

  const workoutListItems = workoutOptions.map((option) => (
    <WorkoutStartListItem
      key={`${option.entry.source}-${option.entry.key}-${String(revision)}`}
      option={option}
    />
  ));

  const workoutList = (
    <ul className="workout-start__list">{workoutListItems}</ul>
  );

  return (
    <div className="workout-start" data-testid="workout-start">
      {pageHeader}
      {workoutList}
    </div>
  );
}
