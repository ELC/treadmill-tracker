import { positiveIntOrZeroSchema, type PositiveIntOrZero } from "../models/index.js";

export type SetIndicatorWindow = {
  startIndex: PositiveIntOrZero;
  endIndex: PositiveIntOrZero;
};

export const SET_INDICATOR_MAX_VISIBLE = 6;
const SET_INDICATOR_MAX_BEFORE = 3;
const SET_INDICATOR_MAX_AFTER = 3;

/** Indices of set dots to render in the runner footer (sliding window around current). */
export function setIndicatorWindow(
  totalSets: number,
  currentIndex: number,
): SetIndicatorWindow {
  if (totalSets <= 0) {
    return {
      startIndex: positiveIntOrZeroSchema.parse(0),
      endIndex: positiveIntOrZeroSchema.parse(0),
    };
  }

  const lastIndex = totalSets - 1;
  if (totalSets <= SET_INDICATOR_MAX_VISIBLE) {
    return {
      startIndex: positiveIntOrZeroSchema.parse(0),
      endIndex: positiveIntOrZeroSchema.parse(lastIndex),
    };
  }

  let before = Math.min(SET_INDICATOR_MAX_BEFORE, currentIndex);
  let after = Math.min(SET_INDICATOR_MAX_AFTER, lastIndex - currentIndex);

  let visible = before + 1 + after;
  if (visible < SET_INDICATOR_MAX_VISIBLE) {
    const spare = SET_INDICATOR_MAX_VISIBLE - visible;
    const growBefore = Math.min(spare, currentIndex - before);
    before += growBefore;
    const growAfter = Math.min(
      spare - growBefore,
      lastIndex - currentIndex - after,
    );
    after += growAfter;
  }

  while (before + 1 + after > SET_INDICATOR_MAX_VISIBLE) {
    if (before > after) {
      before -= 1;
    } else if (after > before) {
      after -= 1;
    } else {
      before -= 1;
      after -= 1;
    }
  }

  return {
    startIndex: positiveIntOrZeroSchema.parse(currentIndex - before),
    endIndex: positiveIntOrZeroSchema.parse(currentIndex + after),
  };
}
