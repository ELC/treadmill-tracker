export type WorkoutSessionActions = {
  pause: () => void;
  resume: () => void;
  goToNextSet: () => void;
  goToPreviousSet: () => void;
  restartSession: () => void;
  backFromCompletion: () => void;
};
