import type { ReactElement } from "react";

import { formatDuration } from "../../lib/formatDuration.js";
import type { WorkoutSessionSnapshot } from "../../models/index.js";
import { SetPanelMetricsVariant } from "./setPanelMetricsVariant.js";
import { SetPanelMetrics } from "./SetPanelMetrics.js";

type CurrentSetPanelProps = {
  snapshot: WorkoutSessionSnapshot;
};

export function CurrentSetPanel({
  snapshot,
}: CurrentSetPanelProps): ReactElement {
  const remainingTimeLabel = formatDuration(snapshot.remainingSeconds);

  return (
    <section className="set-panel set-panel--current" data-testid="set-panel-current">
      <h2 className="set-panel__name" data-testid="set-panel-current-name">
        {snapshot.currentSet.name}
      </h2>
      <p className="set-panel__time" data-testid="set-panel-current-time">
        {remainingTimeLabel}
      </p>
      <SetPanelMetrics
        set={snapshot.currentSet}
        variant={SetPanelMetricsVariant.Current}
      />
    </section>
  );
}
