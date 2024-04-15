import { Sheet, Grid } from "@mui/joy";
import ExercisesEntry from "./ExercisesEntry";

// TESTDATEN // Benötigt werden Daten vom Typ Training
import exercisesTestData from "../../example/exampleExerciseEntry.json";

export default function ExercisesContent() {
  return (
    <Sheet
      variant="outlined"
      color="neutral"
      sx={{ width: "100%", height: "100%", p: 2 }}
    >
      <Grid container spacing={4}>
        {exercisesTestData.map((exercisesEntryData) => {
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
