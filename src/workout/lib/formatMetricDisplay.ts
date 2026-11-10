/** Integer field width for aligned speed / incline in metric cells. */
const METRIC_INT_PAD = 2;

/** Total character width for speed (always four: `␠5.0`, `10.0`). */
const METRIC_SPEED_FIELD_WIDTH = 4;

export function formatSpeedKmhMetricDisplay(speedKmh: number): string {
  const fixed = speedKmh.toFixed(1);
  const dotIndex = fixed.indexOf(".");
  const intPart = fixed.slice(0, dotIndex);
  const fracPart = fixed.slice(dotIndex + 1);
  const core = `${intPart.padStart(METRIC_INT_PAD, " ")}.${fracPart}`;
  return core.padEnd(METRIC_SPEED_FIELD_WIDTH, " ");
}

export function formatInclinePercentMetricDisplay(
  inclinePercent: number,
): string {
  const intPart = String(Math.round(inclinePercent));
  return `${intPart.padStart(METRIC_INT_PAD, " ")}%`;
}
