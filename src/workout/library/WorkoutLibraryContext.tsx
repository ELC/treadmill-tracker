import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

import type { Workout, WorkoutId } from "../models/index.js";
import { workoutLibraryController } from "./workoutLibrary.js";

export type WorkoutLibraryContextValue = {
  savedWorkouts: readonly Workout[];
  revision: number;
  upsertWorkout: (workout: Workout) => void;
  deleteWorkout: (workoutId: WorkoutId) => void;
};

const WorkoutLibraryContext = createContext<WorkoutLibraryContextValue | null>(
  null,
);

export function WorkoutLibraryProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [snapshot, setSnapshot] = useState(() =>
    workoutLibraryController.loadSnapshot(),
  );

  const upsertWorkout = useCallback((workout: Workout) => {
    setSnapshot((current) => {
      const savedWorkouts = workoutLibraryController.upsertSavedWorkout(
        current.savedWorkouts,
        workout,
      );
      return {
        savedWorkouts,
        revision: current.revision + 1,
      };
    });
  }, []);

  const deleteWorkout = useCallback((workoutId: WorkoutId) => {
    setSnapshot((current) => {
      const savedWorkouts = workoutLibraryController.deleteSavedWorkout(
        current.savedWorkouts,
        workoutId,
      );
      return {
        savedWorkouts,
        revision: current.revision + 1,
      };
    });
  }, []);

  const value = useMemo(
    (): WorkoutLibraryContextValue => ({
      savedWorkouts: snapshot.savedWorkouts,
      revision: snapshot.revision,
      upsertWorkout,
      deleteWorkout,
    }),
    [snapshot.revision, snapshot.savedWorkouts, upsertWorkout, deleteWorkout],
  );

  return (
    <WorkoutLibraryContext.Provider value={value}>
      {children}
    </WorkoutLibraryContext.Provider>
  );
}

export function useWorkoutLibrary(): WorkoutLibraryContextValue {
  const value = useContext(WorkoutLibraryContext);
  if (!value) {
    throw new Error(
      "useWorkoutLibrary must be used within WorkoutLibraryProvider",
    );
  }
  return value;
}
