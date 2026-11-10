import { v5 as uuidv5 } from "uuid";
import { z } from "zod";

import {
  inclinePercentSchema,
  nonEmptyStrSchema,
  positiveIntSchema,
  speedKmhSchema,
  type InclinePercent,
  type NonEmptyStr,
  type PositiveInt,
  type SpeedKmh,
  type Uuid5,
} from "./types.js";

/** Namespace for set ids — do not change once workouts are persisted. */
export const WORKOUT_SET_ID_NAMESPACE =
  "550e8400-e29b-53d4-a716-446655440000";

/** One treadmill segment: duration, speed, and incline. */
export class WorkoutSet {
  readonly id: Uuid5;
  readonly name: NonEmptyStr;
  readonly durationSeconds: PositiveInt;
  readonly speedKmh: SpeedKmh;
  readonly inclinePercent: InclinePercent;

  constructor(
    name: string,
    durationSeconds: number,
    speedKmh: number,
    inclinePercent: number,
  ) {
    this.name = nonEmptyStrSchema.parse(name);
    this.id = uuidv5(this.name, WORKOUT_SET_ID_NAMESPACE) as Uuid5;
    this.durationSeconds = positiveIntSchema.parse(durationSeconds);
    const roundedSpeed = Math.round(speedKmh * 10) / 10;
    this.speedKmh = speedKmhSchema.parse(roundedSpeed);
    this.inclinePercent = inclinePercentSchema.parse(
      Math.round(inclinePercent * 2) / 2,
    );
  }
}

export const workoutSetSchema = z.custom<WorkoutSet>(
  (value) => value instanceof WorkoutSet,
  "Expected WorkoutSet",
);
