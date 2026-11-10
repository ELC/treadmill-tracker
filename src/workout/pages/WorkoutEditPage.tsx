import { useMemo, useState, type ReactElement } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import "./WorkoutEditPage.scss";
import "../WorkoutRunner/SetPanel/SetPanel.scss";

import {
  useWorkoutLibrary,
  workoutLibraryController,
} from "../library/index.js";
import { newWorkoutId, Workout, type WorkoutId } from "../models/index.js";
import { WorkoutEditorSetIndicators } from "./WorkoutEditorSetIndicators.js";
import {
  clipInclinePercentDraftInput,
  clipSpeedKmhDraftInput,
  newWorkoutSetDraft,
  workoutSetDraftFromWorkoutSet,
  workoutSetsFromDrafts,
  type WorkoutSetDraft,
} from "./workoutSetDraft.js";

export const WorkoutEditPageModes = {
  Create: "create",
  Edit: "edit",
} as const;

export type WorkoutEditPageMode =
  (typeof WorkoutEditPageModes)[keyof typeof WorkoutEditPageModes];

const EDITOR_BACK_ICON = "←";
const NAV_PREVIOUS_ICON = "➤";
const NAV_NEXT_ICON = "➤";

type WorkoutEditPageProps = {
  mode: WorkoutEditPageMode;
};

type WorkoutEditDraft = {
  workoutId: WorkoutId;
  name: string;
  sets: WorkoutSetDraft[];
};

function initialDraftFromWorkout(workout: Workout): WorkoutEditDraft {
  return {
    workoutId: workout.id,
    name: workout.name,
    sets: workout.sets.map((set) => workoutSetDraftFromWorkoutSet(set)),
  };
}

function initialDraftForCreate(): WorkoutEditDraft {
  const workout = workoutLibraryController.createEmptySavedWorkout();
  return initialDraftFromWorkout(workout);
}

export function WorkoutEditPage({ mode }: WorkoutEditPageProps): ReactElement {
  const { workoutKey } = useParams();
  const navigate = useNavigate();
  const { savedWorkouts, upsertWorkout, deleteWorkout } = useWorkoutLibrary();

  const loadedWorkout = useMemo(() => {
    if (mode === WorkoutEditPageModes.Create) {
      return null;
    }
    if (!workoutKey) {
      return null;
    }
    return workoutLibraryController.resolveWorkoutByKey(
      workoutKey,
      savedWorkouts,
    );
  }, [mode, savedWorkouts, workoutKey]);

  const isCatalogEdit =
    mode === WorkoutEditPageModes.Edit &&
    workoutKey !== undefined &&
    workoutLibraryController.isCatalogWorkoutKey(workoutKey);

  const [draft, setDraft] = useState<WorkoutEditDraft>(() => {
    if (mode === WorkoutEditPageModes.Create) {
      return initialDraftForCreate();
    }
    if (loadedWorkout && isCatalogEdit) {
      const catalogCopy = new Workout(
        loadedWorkout.name,
        loadedWorkout.sets,
        newWorkoutId(),
      );
      return initialDraftFromWorkout(catalogCopy);
    }
    if (loadedWorkout) {
      return initialDraftFromWorkout(loadedWorkout);
    }
    return initialDraftForCreate();
  });

  const [activeSetIndex, setActiveSetIndex] = useState(0);

  if (mode === WorkoutEditPageModes.Edit && loadedWorkout === null) {
    return (
      <div className="workout-editor" data-testid="workout-editor-missing">
        <p className="workout-editor__message">Workout not found.</p>
        <Link
          className="workout-editor__back"
          to="/plan"
          aria-label="Back to planning"
        >
          {EDITOR_BACK_ICON}
        </Link>
      </div>
    );
  }

  const activeSet = draft.sets[activeSetIndex];
  const canGoPrevious = activeSetIndex > 0;
  const canGoNext = activeSetIndex < draft.sets.length - 1;

  const updateSet = (clientKey: string, patch: Partial<WorkoutSetDraft>): void => {
    setDraft((current) => {
      const sets = current.sets.map((set) => {
        if (set.clientKey !== clientKey) {
          return set;
        }
        return { ...set, ...patch };
      });
      return { ...current, sets };
    });
  };

  const handleAddSet = (): void => {
    const insertIndex = activeSetIndex;
    setDraft((current) => {
      const newSet = newWorkoutSetDraft(insertIndex);
      const sets = [
        ...current.sets.slice(0, insertIndex),
        newSet,
        ...current.sets.slice(insertIndex),
      ];
      setActiveSetIndex(insertIndex);
      return { ...current, sets };
    });
  };

  const handleRemoveActiveSet = (): void => {
    if (!activeSet || draft.sets.length <= 1) {
      return;
    }
    const removedIndex = activeSetIndex;
    setDraft((current) => {
      const sets = current.sets.filter((set) => set.clientKey !== activeSet.clientKey);
      const nextIndex = Math.min(removedIndex, sets.length - 1);
      setActiveSetIndex(nextIndex);
      return { ...current, sets };
    });
  };

  const handleSave = (): void => {
    const sets = workoutSetsFromDrafts(draft.sets);
    const workout = new Workout(draft.name, sets, draft.workoutId);
    upsertWorkout(workout);
    void navigate("/plan");
  };

  const handleDelete = (): void => {
    if (loadedWorkout === null) {
      return;
    }
    deleteWorkout(loadedWorkout.id);
    void navigate("/plan");
  };

  const setPanel =
    activeSet ?
      <div
        className="workout-editor__set-panel-wrap"
        data-testid={`workout-editor-set-${String(activeSetIndex)}`}
      >
        <section className="set-panel set-panel--current workout-editor__set-panel">
        <label className="workout-editor__set-duration-label">
          <span className="workout-editor__field-hint workout-editor__field-hint--set">
            Duration (sec)
          </span>
          <input
            className="set-panel__time workout-editor__set-field workout-editor__set-field--duration"
            data-testid={`workout-editor-set-duration-${String(activeSetIndex)}`}
            inputMode="numeric"
            value={activeSet.durationSeconds}
            onChange={(event) => {
              updateSet(activeSet.clientKey, {
                durationSeconds: event.target.value,
              });
            }}
          />
        </label>
        <dl className="set-panel__metrics">
          <div className="set-panel__metric" aria-hidden="true">
            <dt className="set-panel__metric-name">Duration</dt>
            <dd className="set-panel__metric-value"> </dd>
          </div>
          <div className="set-panel__metric">
            <dt className="set-panel__metric-name">Speed (km/h)</dt>
            <dd className="set-panel__metric-value">
              <input
                className="workout-editor__set-field workout-editor__set-field--metric"
                data-testid={`workout-editor-set-speed-${String(activeSetIndex)}`}
                type="text"
                inputMode="decimal"
                step="0.5"
                value={activeSet.speedKmh}
                onChange={(event) => {
                  updateSet(activeSet.clientKey, {
                    speedKmh: event.target.value,
                  });
                }}
                onBlur={(event) => {
                  updateSet(activeSet.clientKey, {
                    speedKmh: clipSpeedKmhDraftInput(event.target.value),
                  });
                }}
              />
            </dd>
          </div>
          <div className="set-panel__metric">
            <dt className="set-panel__metric-name">Incline</dt>
            <dd className="set-panel__metric-value">
              <input
                className="workout-editor__set-field workout-editor__set-field--metric"
                data-testid={`workout-editor-set-incline-${String(activeSetIndex)}`}
                type="text"
                inputMode="numeric"
                step="1"
                value={activeSet.inclinePercent}
                onChange={(event) => {
                  updateSet(activeSet.clientKey, {
                    inclinePercent: event.target.value,
                  });
                }}
                onBlur={(event) => {
                  updateSet(activeSet.clientKey, {
                    inclinePercent: clipInclinePercentDraftInput(event.target.value),
                  });
                }}
              />
            </dd>
          </div>
        </dl>
        <label className="workout-editor__set-name-label">
          <span className="workout-editor__field-hint workout-editor__field-hint--set">
            Set name
          </span>
          <input
            className="workout-editor__set-field workout-editor__set-field--name"
            data-testid={`workout-editor-set-name-${String(activeSetIndex)}`}
            value={activeSet.name}
            onChange={(event) => {
              updateSet(activeSet.clientKey, { name: event.target.value });
            }}
          />
        </label>
        </section>
      </div>
    : null;

  return (
    <div className="workout-editor" data-testid="workout-editor">
      <div className="workout-editor__body">
        <header className="workout-editor__header">
          <Link
            className="workout-editor__back"
            data-testid="workout-editor-back"
            to="/plan"
            aria-label="Back to planning"
          >
            {EDITOR_BACK_ICON}
          </Link>
          <label className="workout-editor__title-field">
            <span className="workout-editor__field-hint workout-editor__field-hint--workout">
              Workout name
            </span>
            <input
              className="workout-editor__title-input"
              data-testid="workout-editor-name"
              value={draft.name}
              onChange={(event) => {
                setDraft((current) => ({ ...current, name: event.target.value }));
              }}
            />
          </label>
        </header>
        <div className="workout-editor__focus">{setPanel}</div>
      </div>
      <footer className="workout-editor__footer">
        <WorkoutEditorSetIndicators
          setCount={draft.sets.length}
          activeSetIndex={activeSetIndex}
          onSelectSet={setActiveSetIndex}
        />
        <div className="workout-editor__controls" data-testid="workout-editor-controls">
          <button
            type="button"
            className="workout-editor__control workout-editor__control--nav workout-editor__control--nav-previous"
            data-testid="workout-editor-previous-set"
            aria-label="Previous set"
            disabled={!canGoPrevious}
            onClick={() => {
              setActiveSetIndex((index) => Math.max(0, index - 1));
            }}
          >
            {NAV_PREVIOUS_ICON}
          </button>
          <button
            type="button"
            className="workout-editor__control workout-editor__control--primary"
            data-testid="workout-editor-add-set"
            aria-label="Add set"
            onClick={handleAddSet}
          >
            Add set
          </button>
          <button
            type="button"
            className="workout-editor__control workout-editor__control--nav"
            data-testid="workout-editor-next-set"
            aria-label="Next set"
            disabled={!canGoNext}
            onClick={() => {
              setActiveSetIndex((index) =>
                Math.min(draft.sets.length - 1, index + 1),
              );
            }}
          >
            {NAV_NEXT_ICON}
          </button>
        </div>
        <div className="workout-editor__actions">
          <button
            type="button"
            className="workout-editor__delete-set"
            data-testid={`workout-editor-remove-set-${String(activeSetIndex)}`}
            disabled={draft.sets.length <= 1}
            onClick={handleRemoveActiveSet}
          >
            Delete set
          </button>
          <button
            type="button"
            className="workout-editor__save"
            data-testid="workout-editor-save"
            onClick={handleSave}
          >
            Save workout
          </button>
          {mode === WorkoutEditPageModes.Edit && !isCatalogEdit ? (
            <button
              type="button"
              className="workout-editor__delete"
              data-testid="workout-editor-delete"
              onClick={handleDelete}
            >
              Delete workout
            </button>
          ) : null}
        </div>
      </footer>
    </div>
  );
}
