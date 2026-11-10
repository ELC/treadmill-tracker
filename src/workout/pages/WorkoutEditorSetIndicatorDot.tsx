import type { CSSProperties, ReactElement } from "react";

type WorkoutEditorSetIndicatorDotProps = {
  setIndex: number;
  activeSetIndex: number;
  onSelectSet: (setIndex: number) => void;
};

export function WorkoutEditorSetIndicatorDot({
  setIndex,
  activeSetIndex,
  onSelectSet,
}: WorkoutEditorSetIndicatorDotProps): ReactElement {
  const testId = `workout-editor-set-indicator-${String(setIndex)}`;
  const ariaLabel = `Edit set ${String(setIndex + 1)}`;

  const handleClick = (): void => {
    onSelectSet(setIndex);
  };

  if (setIndex < activeSetIndex) {
    return (
      <button
        type="button"
        className="workout-set-indicators__dot workout-set-indicators__dot--completed workout-editor-set-indicators__dot"
        data-testid={testId}
        data-indicator-state="completed"
        aria-label={ariaLabel}
        onClick={handleClick}
      />
    );
  }

  if (setIndex === activeSetIndex) {
    const progressStyle = {
      "--workout-set-indicator-ratio": "1",
    } as CSSProperties;
    return (
      <button
        type="button"
        className="workout-set-indicators__dot workout-set-indicators__dot--current workout-editor-set-indicators__dot"
        data-testid={testId}
        data-indicator-state="current"
        style={progressStyle}
        aria-label={ariaLabel}
        aria-current="step"
        onClick={handleClick}
      />
    );
  }

  return (
    <button
      type="button"
      className="workout-set-indicators__dot workout-set-indicators__dot--upcoming workout-editor-set-indicators__dot"
      data-testid={testId}
      data-indicator-state="upcoming"
      aria-label={ariaLabel}
      onClick={handleClick}
    />
  );
}
