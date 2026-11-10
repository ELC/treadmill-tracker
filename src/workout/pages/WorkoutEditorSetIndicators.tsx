import type { CSSProperties, ReactElement } from "react";

import "./WorkoutEditorSetIndicators.scss";
import "../WorkoutRunner/WorkoutRunnerSetIndicators.scss";

import {
  SET_INDICATOR_MAX_VISIBLE,
  setIndicatorWindow,
} from "../lib/index.js";
import { WorkoutEditorSetIndicatorDot } from "./WorkoutEditorSetIndicatorDot.js";

type WorkoutEditorSetIndicatorsProps = {
  setCount: number;
  activeSetIndex: number;
  onSelectSet: (setIndex: number) => void;
};

export function WorkoutEditorSetIndicators({
  setCount,
  activeSetIndex,
  onSelectSet,
}: WorkoutEditorSetIndicatorsProps): ReactElement {
  const { startIndex, endIndex } = setIndicatorWindow(setCount, activeSetIndex);
  const usesFixedLayout = setCount > SET_INDICATOR_MAX_VISIBLE;
  const visibleSetIndexes = Array.from(
    { length: endIndex - startIndex + 1 },
    (_, offset) => startIndex + offset,
  );
  const setIndicatorButtons = visibleSetIndexes.map((setIndex) => (
    <WorkoutEditorSetIndicatorDot
      key={`workout-editor-set-indicator-${String(setIndex)}`}
      setIndex={setIndex}
      activeSetIndex={activeSetIndex}
      onSelectSet={onSelectSet}
    />
  ));
  const omittedBefore = startIndex;
  const omittedAfter = setCount - 1 - endIndex;
  const dotsStyle = usesFixedLayout
    ? undefined
    : ({
        "--workout-set-indicator-count": String(visibleSetIndexes.length),
      } as CSSProperties);
  const rangeLabel =
    setCount > visibleSetIndexes.length
      ? `, showing sets ${String(startIndex + 1)}–${String(endIndex + 1)} of ${String(setCount)}`
      : "";

  const legendBefore = (
    <span
      className="workout-set-indicators__legend workout-set-indicators__legend--before"
      data-testid="workout-editor-set-indicators-legend-before"
      aria-hidden={omittedBefore === 0}
    >
      {omittedBefore > 0 ? `+${String(omittedBefore)}` : ""}
    </span>
  );
  const legendAfter = (
    <span
      className="workout-set-indicators__legend workout-set-indicators__legend--after"
      data-testid="workout-editor-set-indicators-legend-after"
      aria-hidden={omittedAfter === 0}
    >
      {omittedAfter > 0 ? `+${String(omittedAfter)}` : ""}
    </span>
  );
  const dotsRow = (
    <div className="workout-set-indicators__dots" style={dotsStyle}>
      {setIndicatorButtons}
    </div>
  );

  return (
    <div
      className={
        usesFixedLayout
          ? "workout-set-indicators workout-set-indicators--fixed-layout workout-editor-set-indicators"
          : "workout-set-indicators workout-editor-set-indicators"
      }
      data-testid="workout-editor-set-indicators"
      aria-label={`Sets in this workout${rangeLabel}`}
    >
      {usesFixedLayout ? (
        <div className="workout-set-indicators__cluster">
          {legendBefore}
          {dotsRow}
          {legendAfter}
        </div>
      ) : (
        <>
          {legendBefore}
          {dotsRow}
          {legendAfter}
        </>
      )}
    </div>
  );
}
