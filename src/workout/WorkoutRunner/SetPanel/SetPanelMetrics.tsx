import type { ReactElement } from "react";

import { formatDuration } from "../../lib/formatDuration.js";
import {
  formatInclinePercentMetricDisplay,
  formatSpeedKmhMetricDisplay,
} from "../../lib/formatMetricDisplay.js";
import type { WorkoutSet } from "../../models/index.js";
import { SetPanelMetricsVariant } from "./setPanelMetricsVariant.js";

type SetPanelMetricsProps = {
  set: WorkoutSet;
  variant: (typeof SetPanelMetricsVariant)[keyof typeof SetPanelMetricsVariant];
};

export function SetPanelMetrics({
  set,
  variant,
}: SetPanelMetricsProps): ReactElement {
  const isCurrent = variant === SetPanelMetricsVariant.Current;
  const showDuration = variant === SetPanelMetricsVariant.Upcoming;
  const durationTestId =
    showDuration ? "set-panel-upcoming-duration" : undefined;
  const speedTestId =
    isCurrent ? "set-panel-current-speed" : "set-panel-upcoming-speed";
  const inclineTestId =
    isCurrent ? "set-panel-current-incline" : "set-panel-upcoming-incline";
  const durationLabel = formatDuration(set.durationSeconds);
  const speedLabel = formatSpeedKmhMetricDisplay(set.speedKmh);
  const inclineLabel = formatInclinePercentMetricDisplay(set.inclinePercent);

  return (
    <dl className="set-panel__metrics">
      <div className="set-panel__metric" aria-hidden={!showDuration}>
        <dt className="set-panel__metric-name">Duration</dt>
        <dd
          className="set-panel__metric-value"
          data-testid={durationTestId}
        >
          {durationLabel}
        </dd>
      </div>
      <div className="set-panel__metric">
        <dt className="set-panel__metric-name">Speed (km/h)</dt>
        <dd className="set-panel__metric-value" data-testid={speedTestId}>
          {speedLabel}
        </dd>
      </div>
      <div className="set-panel__metric">
        <dt className="set-panel__metric-name">Incline</dt>
        <dd className="set-panel__metric-value" data-testid={inclineTestId}>
          {inclineLabel}
        </dd>
      </div>
    </dl>
  );
}
