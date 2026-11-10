import {
  createContext,
  useContext,
  type ReactElement,
  type ReactNode,
} from "react";

import type { SessionRunStatistics } from "../models/index.js";

type WorkoutRunnerSessionContextValue = {
  sessionStatistics: SessionRunStatistics;
};

const WorkoutRunnerSessionContext =
  createContext<WorkoutRunnerSessionContextValue | null>(null);

export function WorkoutRunnerSessionProvider({
  sessionStatistics,
  children,
}: {
  sessionStatistics: SessionRunStatistics;
  children: ReactNode;
}): ReactElement {
  return (
    <WorkoutRunnerSessionContext.Provider value={{ sessionStatistics }}>
      {children}
    </WorkoutRunnerSessionContext.Provider>
  );
}

export function useWorkoutRunnerSession(): WorkoutRunnerSessionContextValue {
  const value = useContext(WorkoutRunnerSessionContext);
  if (!value) {
    throw new Error(
      "useWorkoutRunnerSession must be used within WorkoutRunnerSessionProvider",
    );
  }
  return value;
}
