import {
  FinishedWorkoutSessionState,
  LastPausedWorkoutSessionState,
  PausedWorkoutSessionStateBase,
  RunningWorkoutSessionStateBase,
  StartedWorkoutSessionState,
  hasPrevious,
  hasUpcoming,
  type Workout,
  type WorkoutSessionState,
} from "../models/index.js";
import {
  CommitElapsedSessionTransition,
  CommitNoSessionTransition,
  CommitSessionTransition,
  RecordSessionTransitionInput,
  type CommitSessionTransitionInput,
} from "./recordSessionTransitionInput.js";

/** Session timeline (pause, tick, set navigation) without React or statistics. */
export class WorkoutSessionController {
  readonly workout: Workout;
  sessionState: WorkoutSessionState;

  constructor(workout: Workout, sessionState: WorkoutSessionState) {
    this.workout = workout;
    this.sessionState = sessionState;
  }

  static forWorkout(workout: Workout): WorkoutSessionController {
    return new WorkoutSessionController(
      workout,
      StartedWorkoutSessionState.fromWorkout(workout),
    );
  }

  advance(
    transition: CommitSessionTransitionInput,
  ): RecordSessionTransitionInput | CommitNoSessionTransition {
    if (transition instanceof CommitNoSessionTransition) {
      return transition;
    }
    const prior = this.sessionState;
    this.sessionState = transition.next;
    return new RecordSessionTransitionInput(prior, transition);
  }

  restartSessionState(): WorkoutSessionState {
    const restartedSessionState =
      StartedWorkoutSessionState.fromWorkout(this.workout);
    this.sessionState = restartedSessionState;
    return restartedSessionState;
  }

  elapsedTickCommit(): CommitSessionTransitionInput {
    const sessionState = this.sessionState;
    if (!(sessionState instanceof RunningWorkoutSessionStateBase)) {
      return new CommitNoSessionTransition();
    }
    const nextSessionState = sessionState.tick(this.workout);
    return new CommitElapsedSessionTransition(nextSessionState);
  }

  pauseCommit(): CommitSessionTransitionInput {
    const sessionState = this.sessionState;
    if (!(sessionState instanceof RunningWorkoutSessionStateBase)) {
      return new CommitNoSessionTransition();
    }
    const nextSessionState = sessionState.pause();
    return new CommitSessionTransition(nextSessionState);
  }

  resumeCommit(): CommitSessionTransitionInput {
    const sessionState = this.sessionState;
    if (!(sessionState instanceof PausedWorkoutSessionStateBase)) {
      return new CommitNoSessionTransition();
    }
    const nextSessionState = sessionState.resume();
    return new CommitSessionTransition(nextSessionState);
  }

  goToNextSetCommit(): CommitSessionTransitionInput {
    const sessionState = this.sessionState;
    if (sessionState.currentSetIndex >= this.workout.sets.length - 1) {
      return new CommitNoSessionTransition();
    }
    if (!hasUpcoming(sessionState)) {
      return new CommitNoSessionTransition();
    }
    const nextSessionState = sessionState.goToUpcoming(this.workout);
    return new CommitSessionTransition(nextSessionState);
  }

  goToPreviousSetCommit(): CommitSessionTransitionInput {
    const sessionState = this.sessionState;
    if (sessionState.currentSetIndex <= 0) {
      return new CommitNoSessionTransition();
    }
    if (!hasPrevious(sessionState)) {
      return new CommitNoSessionTransition();
    }
    const nextSessionState = sessionState.goToPrevious(this.workout);
    return new CommitSessionTransition(nextSessionState);
  }

  backFromCompletionCommit(): CommitSessionTransitionInput {
    const sessionState = this.sessionState;
    if (!(sessionState instanceof FinishedWorkoutSessionState)) {
      return new CommitNoSessionTransition();
    }
    const nextSessionState = LastPausedWorkoutSessionState.fromWorkout(
      this.workout,
    );
    return new CommitSessionTransition(nextSessionState);
  }
}
