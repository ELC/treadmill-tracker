import type { ReactElement } from "react";

import type { WorkoutSessionSnapshot } from "../../models/index.js";
import { SetPanelMetricsVariant } from "./setPanelMetricsVariant.js";
import { SetPanelMetrics } from "./SetPanelMetrics.js";

type UpcomingSetPanelProps = {
  snapshot: WorkoutSessionSnapshot;
  emptyLabel: string;
};

export function UpcomingSetPanel({
  snapshot,
  emptyLabel,
}: UpcomingSetPanelProps): ReactElement {
  const upcoming = snapshot.upcoming;
  const hasUpcoming = upcoming !== null;
  const metricsSet = upcoming ?? snapshot.currentSet;
  const upcomingNameLabel = upcoming?.name ?? "";
  return (
    <section
      className="set-panel set-panel--upcoming"
      data-testid="set-panel-upcoming"
    >
      <div className="set-panel__upcoming-head">
        <p className="set-panel__upcoming-lead" aria-hidden={!hasUpcoming}>
          <span className="set-panel__heading">Next</span>
          <span
            className="set-panel__upcoming-name"
            data-testid="set-panel-upcoming-name"
          >
            {upcomingNameLabel}
          </span>
        </p>
      </div>
      <div
        className="set-panel__upcoming-metrics"
        aria-hidden={!hasUpcoming}
      >
        <SetPanelMetrics
          set={metricsSet}
          variant={SetPanelMetricsVariant.Upcoming}
        />
      </div>
      <p
        className="set-panel__empty set-panel__empty--upcoming-fill"
        aria-hidden={hasUpcoming}
        data-testid="set-panel-upcoming-empty"
      >
        {emptyLabel}
      </p>
    </section>
  );
}
