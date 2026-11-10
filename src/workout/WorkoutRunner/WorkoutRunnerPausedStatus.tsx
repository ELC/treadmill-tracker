import type { ReactElement } from "react";
import { createPortal } from "react-dom";

import { useAppShellContext } from "../../app/index.js";
import {
  WorkoutSessionStatus,
  type WorkoutSessionSnapshot,
} from "../models/index.js";

const PAUSED_LABEL_LETTERS = ["P", "A", "U", "S", "E", "D"] as const;

type WorkoutRunnerPausedOverlayProps = {
  snapshot: WorkoutSessionSnapshot;
};

function pausedLabelLetterElements(): ReactElement[] {
  const letterElements: ReactElement[] = [];
  for (let letterIndex = 0; letterIndex < PAUSED_LABEL_LETTERS.length; letterIndex += 1) {
    const letter = PAUSED_LABEL_LETTERS[letterIndex];
    letterElements.push(
      <span
        key={letter}
        className="workout-runner__paused-letter"
      >
        {letter}
      </span>,
    );
  }
  return letterElements;
}

export function WorkoutRunnerPausedOverlay({
  snapshot,
}: WorkoutRunnerPausedOverlayProps): ReactElement | null {
  const { host } = useAppShellContext();
  const isPaused = snapshot.status === WorkoutSessionStatus.Paused;
  const pausedLabelLetters = pausedLabelLetterElements();

  if (!host) {
    return null;
  }

  return createPortal(
    <div
      className="workout-runner__paused-overlay"
      aria-hidden={!isPaused}
    >
      <p
        className="workout-runner__paused-label"
        data-testid="workout-runner-status"
        aria-label="Paused"
      >
        {pausedLabelLetters}
      </p>
    </div>,
    host,
  );
}
