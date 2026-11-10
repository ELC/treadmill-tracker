import { z } from "zod";

export const uuid5Schema = z
  .string()
  .uuid()
  .refine((value) => value[14] === "5", {
    message: "Expected UUID version 5",
  })
  .brand("Uuid5");

export type Uuid5 = z.infer<typeof uuid5Schema>;

/** Stable workout identity: UUID v5 (catalog / legacy, derived from name) or v4 (saved). */
export const workoutIdSchema = z.string().uuid().brand("WorkoutId");

export type WorkoutId = z.infer<typeof workoutIdSchema>;

export const nonEmptyStrSchema = z
  .string()
  .min(1, "Expected non-empty string")
  .brand("NonEmptyStr");

export type NonEmptyStr = z.infer<typeof nonEmptyStrSchema>;

export const positiveIntSchema = z
  .number()
  .int()
  .gt(0, "Expected positive integer")
  .brand("PositiveInt");

export type PositiveInt = z.infer<typeof positiveIntSchema>;

export const positiveIntOrZeroSchema = z
  .number()
  .int()
  .min(0, "Expected non-negative integer")
  .brand("PositiveIntOrZero");

export type PositiveIntOrZero = z.infer<typeof positiveIntOrZeroSchema>;

export const positiveFloatSchema = z
  .number()
  .gte(0, "Expected non-negative number")
  .brand("PositiveFloat");

export type PositiveFloat = z.infer<typeof positiveFloatSchema>;

/** Non-negative speed; 0 or quantized to 0.1 km/h (workout sets and session aggregates). */
export const speedKmhSchema = z
  .number()
  .gte(0, "Expected non-negative speed (km/h)")
  .refine(
    (value) => value === 0 || isQuantized(value, 0.1),
    {
      message: "Speed (km/h) must be zero or a multiple of 0.1",
    },
  )
  .brand("SpeedKmh");

export type SpeedKmh = z.infer<typeof speedKmhSchema>;

export const inclinePercentSchema = z
  .number()
  .gte(0, "Expected non-negative incline (%)")
  .refine((value) => isQuantized(value, 0.5), {
    message: "Incline (%) must be a multiple of 0.5",
  })
  .brand("InclinePercent");

export type InclinePercent = z.infer<typeof inclinePercentSchema>;

/** Elapsed-time-weighted session average speed (not quantized at compute time). */
export const sessionRunAverageSpeedKmhSchema = z
  .number()
  .gte(0, "Expected non-negative speed (km/h)")
  .brand("SessionRunAverageSpeedKmh");

export type SessionRunAverageSpeedKmh = z.infer<
  typeof sessionRunAverageSpeedKmhSchema
>;

/** Elapsed-time-weighted session average incline (not quantized at compute time). */
export const sessionRunAverageInclinePercentSchema = z
  .number()
  .gte(0, "Expected non-negative incline (%)")
  .brand("SessionRunAverageInclinePercent");

export type SessionRunAverageInclinePercent = z.infer<
  typeof sessionRunAverageInclinePercentSchema
>;

function isQuantized(value: number, step: number): boolean {
  const units = value / step;
  return Math.abs(units - Math.round(units)) <= 1e-9;
}
