import { Sheet, Grid } from "@mui/joy";
import ExercisesEntry from "./ExercisesEntry";
import { useAppSelector } from "../../../hooks";

// TESTDATEN // Benötigt werden Daten vom Typ Training
import exercisesTestData from "../../../example/exampleExerciseEntry.json";
import { ExercisesEntryData } from "../../../types";
import { useEffect, useState } from "react";

export default function ExercisesContent() {
  const currentTags = useAppSelector((state) => state.tags.value);
  const [sortedEntries, setSortedEntries] = useState<ExercisesEntryData[]>([]);

  function sortExerciseEntriesByTags(
    exerciseEntryData: ExercisesEntryData[]
  ): ExercisesEntryData[] {
    return exerciseEntryData.sort((a, b) => {
      const matchCountA = countPrimaryMatches(a.primaryTags, currentTags);
      const matchCountB = countPrimaryMatches(b.primaryTags, currentTags);

      if (matchCountA !== matchCountB) {
        return matchCountB - matchCountA;
      } else {
        return b.rating - a.rating; // Sortiere nach Bewertung
      }
    });
  }

  function countPrimaryMatches(
    primaryTags: string[],
    currentTags: string[]
  ): number {
    const set = new Set(currentTags);
    return primaryTags.reduce(
      (count, val) => (set.has(val) ? count + 1 : count),
      0
    );
  }

  useEffect(() => {
    setSortedEntries([...sortExerciseEntriesByTags(exercisesTestData)]);
  }, [currentTags]);

  return (
    <Sheet
      variant="outlined"
      color="neutral"
      sx={{ width: "100%", height: "100%", p: 2, overflow: "auto" }}
    >
      <Grid container spacing={4}>
        {sortedEntries.map((exercisesEntryData) => {
          return (
            <Grid xs={4}>
              <ExercisesEntry exercisesEntryData={exercisesEntryData} />
            </Grid>
          );
        })}
      </Grid>
    </Sheet>
  );
}