import {
  createContext,
  useContext,
  useState,
  type ReactElement,
} from "react";

import "./App.scss";

import { BrowserRouter } from "react-router-dom";

import { WorkoutLibraryProvider } from "../workout/library/WorkoutLibraryContext.js";
import { ThemeToggle } from "./ThemeToggle/ThemeToggle.js";
import { AppRoutes } from "./AppRoutes.js";

export type AppShellContextValue = {
  host: HTMLElement | null;
  setHost: (element: HTMLElement | null) => void;
};

export const AppShellContext = createContext<AppShellContextValue | null>(
  null,
);

export function useAppShellContext(): AppShellContextValue {
  const value = useContext(AppShellContext);
  if (!value) {
    throw new Error(
      "useAppShellContext must be used within AppShellContext.Provider",
    );
  }
  return value;
}

function App(): ReactElement {
  const [host, setHost] = useState<HTMLElement | null>(null);

  return (
    <BrowserRouter
      basename={import.meta.env.BASE_URL.replace(/\/$/, "") || undefined}
    >
      <WorkoutLibraryProvider>
        <AppShellContext.Provider value={{ host, setHost }}>
          <main ref={setHost} className="app" data-testid="app">
            <header className="app__header">
              <ThemeToggle />
            </header>
            <div className="app__content">
              <AppRoutes />
            </div>
          </main>
        </AppShellContext.Provider>
      </WorkoutLibraryProvider>
    </BrowserRouter>
  );
}

export default App;
