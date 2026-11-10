import type { WorkoutSessionState } from "../models/index.js";

export class CommitSessionTransition {
  constructor(readonly next: WorkoutSessionState) {}
}

export class CommitElapsedSessionTransition extends CommitSessionTransition {}

export class CommitNoSessionTransition {}

export type CommitSessionTransitionResult =
  | CommitSessionTransition
  | CommitElapsedSessionTransition;

export type CommitSessionTransitionInput =
  | CommitSessionTransitionResult
  | CommitNoSessionTransition;

/** Prior/next pair for statistics, with the same commit variant as {@link CommitSessionTransitionResult}. */
export class RecordSessionTransitionInput {
  constructor(
    readonly prior: WorkoutSessionState,
    readonly commit: CommitSessionTransitionResult,
  ) {}

  get next(): WorkoutSessionState {
    return this.commit.next;
  }
}
