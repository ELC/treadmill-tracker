export const SetPanelMetricsVariant = {
  Current: "current",
  Upcoming: "upcoming",
} as const;

export type SetPanelMetricsVariant =
  (typeof SetPanelMetricsVariant)[keyof typeof SetPanelMetricsVariant];
