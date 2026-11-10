import type { CSSProperties, ReactElement } from "react";

import "./WorkoutEditorSetIndicators.scss";
import "../WorkoutRunner/WorkoutRunnerSetIndicators.scss";

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
  const indicatorsStyle = {
    "--workout-set-indicator-count": String(setCount),
  } as CSSProperties;

  const setIndicatorButtons = Array.from({ length: setCount }, (_, setIndex) => (
    <WorkoutEditorSetIndicatorDot
      key={`workout-editor-set-indicator-${String(setIndex)}`}
      setIndex={setIndex}
      activeSetIndex={activeSetIndex}
      onSelectSet={onSelectSet}
    />
  ));

  return (
    <div
      className="workout-set-indicators workout-editor-set-indicators"
      data-testid="workout-editor-set-indicators"
      aria-label="Sets in this workout"
      style={indicatorsStyle}
    >
      {setIndicatorButtons}
    </div>
  );
}
