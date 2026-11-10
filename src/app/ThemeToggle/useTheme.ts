import { useCallback, useState } from "react";

export const Theme = {
  Dark: "dark",
  Light: "light",
} as const;

export type Theme = (typeof Theme)[keyof typeof Theme];

const THEME_STORAGE_KEY = "treadmill-tracker-theme";

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === Theme.Dark || stored === Theme.Light) {
      return stored;
    }
  } catch {
    // localStorage unavailable (e.g. private mode)
  }
  return Theme.Dark;
}

export function useTheme(): {
  theme: Theme;
  toggleTheme: () => void;
} {
  const [theme, setTheme] = useState<Theme>(() => {
    const initial = readStoredTheme();
    document.documentElement.dataset.theme = initial;
    return initial;
  });

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === Theme.Dark ? Theme.Light : Theme.Dark;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // ignore
      }
      document.documentElement.dataset.theme = next;
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
