import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import "./HomePage.scss";

const HOME_START_ICON = "▶";
const HOME_PLAN_ICON = "✎";

export function HomePage(): ReactElement {
  return (
    <div className="home-menu" data-testid="home-menu">
      <h1 className="home-menu__title">Treadmill Tracker</h1>
      <nav className="home-menu__nav" aria-label="Main">
        <Link
          className="home-menu__tile home-menu__tile--start"
          data-testid="home-start"
          to="/start"
        >
          <span className="home-menu__tile-icon" aria-hidden="true">
            {HOME_START_ICON}
          </span>
          <span className="home-menu__tile-label">Start</span>
          <span className="home-menu__tile-hint">Pick a workout and run</span>
        </Link>
        <Link
          className="home-menu__tile home-menu__tile--plan"
          data-testid="home-plan"
          to="/plan"
        >
          <span className="home-menu__tile-icon" aria-hidden="true">
            {HOME_PLAN_ICON}
          </span>
          <span className="home-menu__tile-label">Workout planning</span>
          <span className="home-menu__tile-hint">Create and edit routines</span>
        </Link>
      </nav>
    </div>
  );
}
