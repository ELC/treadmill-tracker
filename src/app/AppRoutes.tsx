import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { HomePage, PlanPage, StartPage } from "./pages/index.js";
import {
  RunPage,
  WorkoutEditPage,
  WorkoutEditPageModes,
} from "../workout/pages/index.js";

export function AppRoutes(): ReactElement {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="start" element={<StartPage />} />
      <Route path="plan" element={<PlanPage />} />
      <Route
        path="plan/new"
        element={<WorkoutEditPage mode={WorkoutEditPageModes.Create} />}
      />
      <Route
        path="plan/:workoutKey"
        element={<WorkoutEditPage mode={WorkoutEditPageModes.Edit} />}
      />
      <Route path="run" element={<RunPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
