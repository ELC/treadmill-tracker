import { formatDuration } from "../lib/formatDuration.js";
import { formatInclinePercentCompletion } from "../lib/formatIncline.js";
import { formatSpeedKmh } from "../lib/formatSpeed.js";
import {
  positiveIntOrZeroSchema,
  sessionRunAverageInclinePercentSchema,
  sessionRunAverageSpeedKmhSchema,
  type PositiveIntOrZero,
  type SessionRunAverageInclinePercent,
  type SessionRunAverageSpeedKmh,
} from "./types.js";
import type { Workout } from "./workout.js";
import type { WorkoutSessionState } from "./workoutSessionState/index.js";

/** Seconds actually spent per set index, including the set in progress. */
export type SecondsCompletedBySet = ReadonlyMap<number, PositiveIntOrZero>;

/** Per-run credits, wall-clock elapsed, and elapsed-time-weighted completion averages. */
export class SessionRunStatistics {
  readonly workout: Workout;
  readonly secondsCompletedBySet: SecondsCompletedBySet;
  /** Monotonic wall-clock elapsed while the timer ticks (not reduced by “Previous”). */
  readonly sessionElapsedSeconds: PositiveIntOrZero;
  readonly totalDurationSeconds: PositiveIntOrZero;
  readonly averageSpeedKmh: SessionRunAverageSpeedKmh;
  readonly averageInclinePercent: SessionRunAverageInclinePercent;
  readonly elapsedWeightedSpeedKmhSeconds: number;
  readonly elapsedWeightedInclineSecondPercent: number;

  private constructor(
    workout: Workout,
    credits: Map<number, PositiveIntOrZero>,
    sessionElapsedSeconds: PositiveIntOrZero,
    elapsedWeightedSpeedKmhSeconds: number,
    elapsedWeightedInclineSecondPercent: number,
  ) {
    this.workout = workout;
    this.secondsCompletedBySet = new Map(credits);
    this.sessionElapsedSeconds = sessionElapsedSeconds;
    this.elapsedWeightedSpeedKmhSeconds = elapsedWeightedSpeedKmhSeconds;
    this.elapsedWeightedInclineSecondPercent = elapsedWeightedInclineSecondPercent;

    let creditedSeconds = 0;
    for (const seconds of this.secondsCompletedBySet.values()) {
      creditedSeconds += seconds;
    }
    this.totalDurationSeconds = positiveIntOrZeroSchema.parse(creditedSeconds);

    this.averageSpeedKmh = SessionRunStatistics.averageSpeedKmhForElapsed(
      sessionElapsedSeconds,
      elapsedWeightedSpeedKmhSeconds,
    );
    this.averageInclinePercent =
      SessionRunStatistics.averageInclinePercentForElapsed(
        sessionElapsedSeconds,
        elapsedWeightedInclineSecondPercent,
      );
  }

  private static averageSpeedKmhForElapsed(
    sessionElapsedSeconds: PositiveIntOrZero,
    elapsedWeightedSpeedKmhSeconds: number,
  ): SessionRunAverageSpeedKmh {
    if (sessionElapsedSeconds === 0) {
      return sessionRunAverageSpeedKmhSchema.parse(0);
    }
    return sessionRunAverageSpeedKmhSchema.parse(
      elapsedWeightedSpeedKmhSeconds / sessionElapsedSeconds,
    );
  }

  private static averageInclinePercentForElapsed(
    sessionElapsedSeconds: PositiveIntOrZero,
    elapsedWeightedInclineSecondPercent: number,
  ): SessionRunAverageInclinePercent {
    if (sessionElapsedSeconds === 0) {
      return sessionRunAverageInclinePercentSchema.parse(0);
    }
    return sessionRunAverageInclinePercentSchema.parse(
      elapsedWeightedInclineSecondPercent / sessionElapsedSeconds,
    );
  }

  /** Empty credits for a workout (same as after **`resetStatistics`**). */
  static forWorkout(workout: Workout): SessionRunStatistics {
    return new SessionRunStatistics(
      workout,
      new Map(),
      positiveIntOrZeroSchema.parse(0),
      0,
      0,
    );
  }

  /** One wall-clock second on the active set (call only from the running timer tick). */
  withElapsedSecond(activeSetIndex: PositiveIntOrZero): SessionRunStatistics {
    const set = this.workout.setAt(activeSetIndex);
    return new SessionRunStatistics(
      this.workout,
      new Map(this.secondsCompletedBySet),
      positiveIntOrZeroSchema.parse(this.sessionElapsedSeconds + 1),
      this.elapsedWeightedSpeedKmhSeconds + set.speedKmh,
      this.elapsedWeightedInclineSecondPercent + set.inclinePercent,
    );
  }

  /**
   * Credit a session transition: sets skipped forward count at full planned
   * duration, sets after the destination are dropped (abandoned branch), and the
   * destination gets `planned − remaining`.
   */
  recordTransition(
    prior: WorkoutSessionState,
    next: WorkoutSessionState,
  ): SessionRunStatistics {
    const destination = next.currentSetIndex;
    const credits = new Map(this.secondsCompletedBySet);

    for (let i: number = prior.currentSetIndex; i < destination; i += 1) {
      const planned = this.workout.setAt(i).durationSeconds;
      credits.set(i, positiveIntOrZeroSchema.parse(planned));
    }

    for (const key of credits.keys()) {
      if (key > destination) {
        credits.delete(key);
      }
    }

    const plannedAtDestination =
      this.workout.setAt(destination).durationSeconds;
    const creditedAtDestination = Math.max(
      0,
      plannedAtDestination - next.remainingSeconds,
    );
    credits.set(
      destination,
      positiveIntOrZeroSchema.parse(creditedAtDestination),
    );

    return new SessionRunStatistics(
      this.workout,
      credits,
      this.sessionElapsedSeconds,
      this.elapsedWeightedSpeedKmhSeconds,
      this.elapsedWeightedInclineSecondPercent,
    );
  }
}

/** Formatted strings for header and completion from this run's {@link SessionRunStatistics}. */
export class SessionRunStatisticsDisplay {
  readonly workoutName: Workout["name"];
  /** Wall-clock elapsed while the timer runs (header and completion total time). */
  readonly sessionElapsedText: string;
  readonly totalDurationText: string;
  /** Session wall-clock hours × elapsed-weighted average speed. */
  readonly sessionDistanceKmText: string;
  readonly averageSpeedKmhText: string;
  readonly averageInclinePercentText: string;

  private static sessionDistanceKm(
    sessionElapsedSeconds: PositiveIntOrZero,
    averageSpeedKmh: SessionRunAverageSpeedKmh,
  ): number {
    const hours = sessionElapsedSeconds / 3600;
    const distanceKm = hours * averageSpeedKmh;
    return Math.round(distanceKm * 10) / 10;
  }

  constructor(stats: SessionRunStatistics) {
    this.workoutName = stats.workout.name;
    this.sessionElapsedText = formatDuration(stats.sessionElapsedSeconds);
    this.totalDurationText = formatDuration(stats.totalDurationSeconds);
    const sessionDistanceKm = SessionRunStatisticsDisplay.sessionDistanceKm(
      stats.sessionElapsedSeconds,
      stats.averageSpeedKmh,
    );
    this.sessionDistanceKmText = `${sessionDistanceKm.toFixed(1)} km`;
    this.averageSpeedKmhText = formatSpeedKmh(stats.averageSpeedKmh);
    this.averageInclinePercentText = formatInclinePercentCompletion(
      stats.averageInclinePercent,
    );
  }
}
