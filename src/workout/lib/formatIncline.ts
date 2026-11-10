/** Whole-number percent (set panels and other in-run UI). */
export function formatInclinePercentRounded(inclinePercent: number): string {
  return `${String(Math.round(inclinePercent))}%`;
}

/** One decimal place — completion summary average incline only. */
export function formatInclinePercentCompletion(inclinePercent: number): string {
  return `${inclinePercent.toFixed(1)}%`;
}
