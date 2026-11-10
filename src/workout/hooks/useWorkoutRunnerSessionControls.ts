import { useEffect, useRef, type RefObject } from "react";

import {
  workoutRunnerInvokeNext,
  workoutRunnerInvokePauseToggle,
  workoutRunnerInvokePrevious,
} from "../lib/workoutRunnerSessionControl.js";
import type { WorkoutSessionSnapshot } from "../models/index.js";
import type { WorkoutSessionActions } from "./workoutSessionActions.js";

const SWIPE_MIN_HORIZONTAL_PX = 48;
const SWIPE_MAX_VERTICAL_PX = 72;
const DOUBLE_TAP_MAX_INTERVAL_MS = 300;
const DOUBLE_TAP_MAX_DISTANCE_PX = 24;

type TouchPoint = {
  x: number;
  y: number;
};

function distanceBetween(a: TouchPoint, b: TouchPoint): number {
  const deltaX = a.x - b.x;
  const deltaY = a.y - b.y;
  return Math.hypot(deltaX, deltaY);
}

function touchPointFromTouch(touch: Touch): TouchPoint {
  return { x: touch.clientX, y: touch.clientY };
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
    return true;
  }
  return target.isContentEditable;
}

/** Keyboard and touch gestures on the runner body (arrows, space, swipe, double-tap). */
export function useWorkoutRunnerSessionControls(
  surfaceRef: RefObject<HTMLElement | null>,
  snapshot: WorkoutSessionSnapshot,
  actions: WorkoutSessionActions,
): void {
  const snapshotRef = useRef(snapshot);
  const actionsRef = useRef(actions);

  useEffect(() => {
    snapshotRef.current = snapshot;
    actionsRef.current = actions;
  }, [actions, snapshot]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (isEditableTarget(event.target)) {
        return;
      }
      const currentSnapshot = snapshotRef.current;
      const currentActions = actionsRef.current;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        workoutRunnerInvokePrevious(currentSnapshot, currentActions);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        workoutRunnerInvokeNext(currentSnapshot, currentActions);
        return;
      }
      if (event.key === " " || event.code === "Space") {
        event.preventDefault();
        workoutRunnerInvokePauseToggle(currentSnapshot, currentActions);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) {
      return;
    }

    let touchStart: TouchPoint | null = null;
    let lastTap: (TouchPoint & { time: number }) | null = null;

    const onTouchStart = (event: TouchEvent): void => {
      if (event.touches.length !== 1) {
        touchStart = null;
        return;
      }
      touchStart = touchPointFromTouch(event.touches[0]);
    };

    const onTouchEnd = (event: TouchEvent): void => {
      if (event.changedTouches.length !== 1) {
        touchStart = null;
        return;
      }
      const endPoint = touchPointFromTouch(event.changedTouches[0]);
      const currentSnapshot = snapshotRef.current;
      const currentActions = actionsRef.current;

      if (touchStart !== null) {
        const deltaX = endPoint.x - touchStart.x;
        const deltaY = endPoint.y - touchStart.y;
        const started = touchStart;
        touchStart = null;

        if (
          Math.abs(deltaX) >= SWIPE_MIN_HORIZONTAL_PX &&
          Math.abs(deltaY) <= SWIPE_MAX_VERTICAL_PX &&
          Math.abs(deltaX) > Math.abs(deltaY)
        ) {
          if (deltaX < 0) {
            workoutRunnerInvokeNext(currentSnapshot, currentActions);
          } else {
            workoutRunnerInvokePrevious(currentSnapshot, currentActions);
          }
          lastTap = null;
          return;
        }

        const travel = distanceBetween(started, endPoint);
        if (travel > DOUBLE_TAP_MAX_DISTANCE_PX) {
          lastTap = null;
          return;
        }
      }

      const now = event.timeStamp;
      if (
        lastTap !== null &&
        now - lastTap.time <= DOUBLE_TAP_MAX_INTERVAL_MS &&
        distanceBetween(lastTap, endPoint) <= DOUBLE_TAP_MAX_DISTANCE_PX
      ) {
        workoutRunnerInvokePauseToggle(currentSnapshot, currentActions);
        lastTap = null;
        return;
      }

      lastTap = { ...endPoint, time: now };
    };

    const onTouchCancel = (): void => {
      touchStart = null;
    };

    surface.addEventListener("touchstart", onTouchStart, { passive: true });
    surface.addEventListener("touchend", onTouchEnd, { passive: true });
    surface.addEventListener("touchcancel", onTouchCancel, { passive: true });

    return () => {
      surface.removeEventListener("touchstart", onTouchStart);
      surface.removeEventListener("touchend", onTouchEnd);
      surface.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [surfaceRef]);
}
