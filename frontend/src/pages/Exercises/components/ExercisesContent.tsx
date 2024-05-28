import { Sheet, Grid } from "@mui/joy";
import ExercisesEntry from "./ExercisesEntry";
import { useAppSelector } from "../../../hooks";
import { ExercisesEntryData } from "../../../types";
import { useEffect, useState } from "react";
import { getExercisesData } from "../../../api";
import { useAuthHeader } from "react-auth-kit";

export default function ExercisesContent() {
  const auth = useAuthHeader();
  const currentTags = useAppSelector((state) => state.tags.value);
  const [sortedEntries, setSortedEntries] = useState<ExercisesEntryData[]>([]);
  const [exercisesEntryData, setExercisesEntryData] =
    useState<ExercisesEntryData[]>();

  useEffect(() => {
    getExercisesData(auth())
      .then((data: ExercisesEntryData[]) => {
        setExercisesEntryData(data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, []);

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
    if (exercisesEntryData) {
      setSortedEntries([...sortExerciseEntriesByTags(exercisesEntryData)]);
    }
  }, [currentTags, exercisesEntryData]);

  return (
    <Sheet
      variant="outlined"
      color="neutral"
      sx={{ width: "100%", height: "100%", p: 2, overflow: "auto" }}
    >
      <Grid container spacing={4}>
        {sortedEntries.map((exercisesEntryData) => {
          return (
            <Grid xs={4} key={exercisesEntryData.exerciseId}>
              <ExercisesEntry exercisesEntryData={exercisesEntryData} />
            </Grid>
          );
        })}
      </Grid>
    </Sheet>
  );
}
