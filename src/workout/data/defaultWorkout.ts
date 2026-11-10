import { Workout, WorkoutSet } from "../models/index.js";

/** Preloaded routine until workout CRUD is implemented. */
export const defaultWorkout = new Workout("Starter intervals", [
  new WorkoutSet("Warm up", 300, 5.5, 0),
  new WorkoutSet("Interval 1", 120, 10, 2),
  new WorkoutSet("Recovery", 90, 6, 0),
  new WorkoutSet("Interval 2", 120, 10.5, 2.5),
  new WorkoutSet("Cool down", 15, 5, 0),
]);
