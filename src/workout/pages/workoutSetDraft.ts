import { WorkoutSet } from "../models/index.js";

export type WorkoutSetDraft = {
  clientKey: string;
  name: string;
  durationSeconds: string;
  speedKmh: string;
  inclinePercent: string;
};

export function workoutSetDraftFromWorkoutSet(set: WorkoutSet): WorkoutSetDraft {
  return {
    clientKey: set.id,
    name: set.name,
    durationSeconds: String(set.durationSeconds),
    speedKmh: clipSpeedKmhDraftInput(String(set.speedKmh)),
    inclinePercent: clipInclinePercentDraftInput(String(set.inclinePercent)),
  };
}

function parseDraftNumber(raw: string): number | null {
  if (raw.trim() === "") {
    return null;
  }
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return parsed;
}

/** Quantize editor speed input to 0.5 km/h steps (non-negative). */
export function clipSpeedKmhDraftInput(raw: string): string {
  const parsed = parseDraftNumber(raw);
  if (parsed === null) {
    return raw;
  }
  const clipped = Math.max(0, Math.round(parsed * 2) / 2);
  return String(clipped);
}

/** Quantize editor incline input to whole percents (non-negative). */
export function clipInclinePercentDraftInput(raw: string): string {
  const parsed = parseDraftNumber(raw);
  if (parsed === null) {
    return raw;
  }
  const clipped = Math.max(0, Math.round(parsed));
  return String(clipped);
}

export function newWorkoutSetDraft(index: number): WorkoutSetDraft {
  return {
    clientKey: crypto.randomUUID(),
    name: `Set ${String(index + 1)}`,
    durationSeconds: "60",
    speedKmh: "5",
    inclinePercent: "0",
  };
}

export function workoutSetsFromDrafts(drafts: readonly WorkoutSetDraft[]): WorkoutSet[] {
  return drafts.map(
    (draft) =>
      new WorkoutSet(
        draft.name,
        Number(draft.durationSeconds),
        Number(clipSpeedKmhDraftInput(draft.speedKmh)),
        Number(clipInclinePercentDraftInput(draft.inclinePercent)),
      ),
  );
}
