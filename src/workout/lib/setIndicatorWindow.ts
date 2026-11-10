import { positiveIntOrZeroSchema, type PositiveIntOrZero } from "../models/index.js";

export type SetIndicatorWindow = {
  startIndex: PositiveIntOrZero;
  endIndex: PositiveIntOrZero;
};

export const SET_INDICATOR_MAX_VISIBLE = 5;
const SET_INDICATOR_MAX_BEFORE = 2;
const SET_INDICATOR_MAX_AFTER = 2;

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

  let startIndex = currentIndex - before;
  let endIndex = currentIndex + after;

  if (startIndex === 0) {
    endIndex = Math.min(lastIndex, SET_INDICATOR_MAX_VISIBLE - 1);
  } else if (endIndex === lastIndex) {
    startIndex = Math.max(0, lastIndex - (SET_INDICATOR_MAX_VISIBLE - 1));
  }

  return {
    startIndex: positiveIntOrZeroSchema.parse(startIndex),
    endIndex: positiveIntOrZeroSchema.parse(endIndex),
  };
}
