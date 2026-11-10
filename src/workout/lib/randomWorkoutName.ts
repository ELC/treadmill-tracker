import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from "unique-names-generator";

export function randomWorkoutName(): string {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: " ",
    style: "capital",
    length: 2,
  });
}
