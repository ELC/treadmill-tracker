import { SessionRunStatistics, type Workout } from "../models/index.js";
import { CommitElapsedSessionTransition } from "./recordSessionTransitionInput.js";
import type { RecordSessionTransitionInput } from "./recordSessionTransitionInput.js";

/** Per-set credits and session elapsed totals without React. */
export class SessionStatisticsController {
  readonly workout: Workout;
  sessionStatistics: SessionRunStatistics;

  constructor(workout: Workout, sessionStatistics: SessionRunStatistics) {
    this.workout = workout;
    this.sessionStatistics = sessionStatistics;
  }

  static forWorkout(workout: Workout): SessionStatisticsController {
    return new SessionStatisticsController(
      workout,
      SessionRunStatistics.forWorkout(workout),
    );
  }

  recordTransition(input: RecordSessionTransitionInput): SessionRunStatistics {
    const { prior, next } = input;
    if (input.commit instanceof CommitElapsedSessionTransition) {
      this.sessionStatistics = this.sessionStatistics
        .withElapsedSecond(prior.currentSetIndex)
        .recordTransition(prior, next);
      return this.sessionStatistics;
    }
    this.sessionStatistics = this.sessionStatistics.recordTransition(
      prior,
      next,
    );
    return this.sessionStatistics;
  }

  reset(): SessionRunStatistics {
    this.sessionStatistics = SessionRunStatistics.forWorkout(this.workout);
    return this.sessionStatistics;
  }
}
