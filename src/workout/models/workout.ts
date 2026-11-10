import { v4 as uuidv4, v5 as uuidv5 } from "uuid";

import {
  nonEmptyStrSchema,
  workoutIdSchema,
  type NonEmptyStr,
  type WorkoutId,
} from "./types.js";
import {
  workoutCompletionStatsSchema,
  type WorkoutCompletionStats,
} from "./workoutCompletionStats.js";
import { WorkoutSet } from "./workoutSet.js";

/** Do not change after persistence — fixed UUID v4 namespace for workout ids. */
export const WORKOUT_ID_NAMESPACE = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

/**
 * Name-derived id for catalog workouts and saved records persisted before ids
 * were stored. Do not use for new saved workouts — renaming would change it.
 */
export function workoutIdFromName(name: string): WorkoutId {
  return workoutIdSchema.parse(
    uuidv5(nonEmptyStrSchema.parse(name), WORKOUT_ID_NAMESPACE),
  );
}

/** Fresh id for a newly created saved workout; survives renames. */
export function newWorkoutId(): WorkoutId {
  return workoutIdSchema.parse(uuidv4());
}

/** Ordered list of sets; catalog workouts in code, saved workouts in localStorage. */
export class Workout {
  readonly id: WorkoutId;
  readonly name: NonEmptyStr;
  readonly sets: readonly WorkoutSet[];

  constructor(
    name: string,
    sets: readonly WorkoutSet[],
    id: WorkoutId = workoutIdFromName(name),
  ) {
    this.name = nonEmptyStrSchema.parse(name);
    this.id = id;
    this.sets = sets;
  }

  setAt(index: number): WorkoutSet {
    if (!Number.isInteger(index) || index < 0 || index >= this.sets.length) {
      throw new Error(
        `Workout set index out of bounds: ${String(index)} (length ${String(this.sets.length)})`,
      );
    }

    return this.sets[index];
  }

  /** Duration-weighted averages over all sets in the workout definition. */
  completionStats(): WorkoutCompletionStats {
    let totalDurationSeconds = 0;
    let weightedSpeedSum = 0;
    let weightedInclineSum = 0;

    for (const set of this.sets) {
      const duration = set.durationSeconds;
      totalDurationSeconds += duration;
      weightedSpeedSum += set.speedKmh * duration;
      weightedInclineSum += set.inclinePercent * duration;
    }

    return workoutCompletionStatsSchema.parse({
      totalDurationSeconds,
      averageSpeedKmh:
        Math.round((weightedSpeedSum / totalDurationSeconds) * 10) / 10,
      averageInclinePercent:
        Math.round((weightedInclineSum / totalDurationSeconds) * 2) / 2,
    });
  }
}
