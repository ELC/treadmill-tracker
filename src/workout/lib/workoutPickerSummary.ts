import { formatDuration } from "./formatDuration.js";
import { formatInclinePercentCompletion } from "./formatIncline.js";
import { formatSpeedKmh } from "./formatSpeed.js";
import type { Workout } from "../models/index.js";

/** Formatted strings for start/plan workout picker cards from a {@link Workout} definition. */
export class WorkoutPickerSummaryDisplay {
  readonly setCount: number;
  readonly totalDurationText: string;
  readonly totalDistanceKmText: string;
  readonly averageSpeedKmhText: string;
  readonly averageInclinePercentText: string;

  private static totalPlannedDistanceKm(workout: Workout): number {
    let distanceKm = 0;
    for (const set of workout.sets) {
      distanceKm += set.speedKmh * (set.durationSeconds / 3600);
    }
    return Math.round(distanceKm * 10) / 10;
  }

  constructor(workout: Workout) {
    const stats = workout.completionStats();
    const totalDistanceKm =
      WorkoutPickerSummaryDisplay.totalPlannedDistanceKm(workout);

    this.setCount = workout.sets.length;
    this.totalDurationText = formatDuration(stats.totalDurationSeconds);
    this.totalDistanceKmText = `${totalDistanceKm.toFixed(1)} km`;
    this.averageSpeedKmhText = formatSpeedKmh(stats.averageSpeedKmh);
    this.averageInclinePercentText = formatInclinePercentCompletion(
      stats.averageInclinePercent,
    );
  }
}
