import type { ReactElement } from "react";

import "./ThemeToggle.scss";

import { Theme, useTheme } from "./useTheme.js";

export function ThemeToggle(): ReactElement {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === Theme.Dark;
  const ariaLabel = isDark ? "Switch to light theme" : "Switch to dark theme";
  const toggleIcon = isDark ? "☀" : "☾";
  const iconKind = isDark ? "sun" : "moon";

  return (
    <button
      type="button"
      className="theme-toggle"
      data-icon={iconKind}
      data-testid="theme-toggle"
      aria-label={ariaLabel}
      onClick={toggleTheme}
    >
      {toggleIcon}
    </button>
  );
}
