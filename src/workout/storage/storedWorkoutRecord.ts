import { z } from "zod";

import {
  workoutIdFromName,
  workoutIdSchema,
  Workout,
  WorkoutSet,
} from "../models/index.js";

export const STORED_WORKOUTS_VERSION = 1;

const storedWorkoutSetSchema = z.object({
  name: z.string().min(1),
  durationSeconds: z.number().int().positive(),
  speedKmh: z.number(),
  inclinePercent: z.number(),
});

export type StoredWorkoutSet = z.infer<typeof storedWorkoutSetSchema>;

/** `id` is absent on records written before ids were persisted (pre-v1). */
const storedWorkoutSchema = z.object({
  id: workoutIdSchema.optional(),
  name: z.string().min(1),
  sets: z.array(storedWorkoutSetSchema).min(1),
});

export type StoredWorkout = z.infer<typeof storedWorkoutSchema>;

/** Pre-v1 layout: a bare array of records. */
const legacyStoredWorkoutsSchema = z.array(z.unknown());

const storedWorkoutsEnvelopeSchema = z.object({
  version: z.literal(STORED_WORKOUTS_VERSION),
  workouts: z.array(z.unknown()),
});

export type StoredWorkoutsEnvelope = {
  version: typeof STORED_WORKOUTS_VERSION;
  workouts: StoredWorkout[];
};

/** Loaded workouts plus anything that could not be turned into a `Workout`. */
export type StoredWorkoutsLoadResult = {
  workouts: Workout[];
  unreadable: unknown[];
};

export function workoutFromStored(stored: StoredWorkout): Workout {
  const sets = stored.sets.map(
    (set) =>
      new WorkoutSet(
        set.name,
        set.durationSeconds,
        set.speedKmh,
        set.inclinePercent,
      ),
  );
  return new Workout(
    stored.name,
    sets,
    stored.id ?? workoutIdFromName(stored.name),
  );
}

export function storedWorkoutFromWorkout(workout: Workout): StoredWorkout {
  const sets: StoredWorkoutSet[] = [];
  for (const set of workout.sets) {
    sets.push({
      name: set.name,
      durationSeconds: set.durationSeconds,
      speedKmh: set.speedKmh,
      inclinePercent: set.inclinePercent,
    });
  }
  return storedWorkoutSchema.parse({
    id: workout.id,
    name: workout.name,
    sets,
  });
}

function workoutFromUnknownRecord(record: unknown): Workout | null {
  const parsed = storedWorkoutSchema.safeParse(record);
  if (!parsed.success) {
    return null;
  }
  try {
    return workoutFromStored(parsed.data);
  } catch {
    return null;
  }
}

function storedRecordsFromJson(json: unknown): unknown[] | null {
  const envelope = storedWorkoutsEnvelopeSchema.safeParse(json);
  if (envelope.success) {
    return envelope.data.workouts;
  }
  const legacy = legacyStoredWorkoutsSchema.safeParse(json);
  if (legacy.success) {
    return legacy.data;
  }
  return null;
}

/**
 * Parses each record on its own so one bad record never hides the others.
 * Unparseable JSON or an unknown layout (e.g. a newer `version`) lands whole in
 * `unreadable` as the raw string.
 */
export function parseStoredWorkouts(raw: string): StoredWorkoutsLoadResult {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { workouts: [], unreadable: [raw] };
  }

  const records = storedRecordsFromJson(json);
  if (records === null) {
    return { workouts: [], unreadable: [raw] };
  }

  const workouts: Workout[] = [];
  const unreadable: unknown[] = [];
  const seenIds = new Set<string>();
  for (const record of records) {
    const workout = workoutFromUnknownRecord(record);
    if (workout === null) {
      unreadable.push(record);
      continue;
    }
    if (seenIds.has(workout.id)) {
      continue;
    }
    seenIds.add(workout.id);
    workouts.push(workout);
  }
  return { workouts, unreadable };
}

export function serializeStoredWorkouts(workouts: readonly Workout[]): string {
  const envelope: StoredWorkoutsEnvelope = {
    version: STORED_WORKOUTS_VERSION,
    workouts: workouts.map((workout) => storedWorkoutFromWorkout(workout)),
  };
  return JSON.stringify(envelope);
}
