import { z } from "zod";

import {
  inclinePercentSchema,
  positiveIntOrZeroSchema,
  speedKmhSchema,
} from "./types.js";

export const workoutCompletionStatsSchema = z
  .object({
    totalDurationSeconds: positiveIntOrZeroSchema,
    averageSpeedKmh: speedKmhSchema,
    averageInclinePercent: inclinePercentSchema,
  })
  .strict();

export type WorkoutCompletionStats = z.infer<typeof workoutCompletionStatsSchema>;
