import { Exercise } from "./types";

export const weekdays: string[] = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];

export const weekdaysAbbreviation: string[] = [
  "Mo.",
  "Di.",
  "Mi.",
  "Do.",
  "Fr.",
  "Sa.",
  "So.",
];

export const tags: string[] = ["a", "b", "c"];

export const exercises: Exercise[] = [
  { exerciseName: "Laufen", exercise: { minutes: 10 } },
  {
    exerciseName: "Gewichte",
    exercise: { weight: 10, repetitionAmount: 15, setAmount: 3 },
  },
];
