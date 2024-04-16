import { Sheet, Grid } from "@mui/joy";
import TrainingScheduleEntry from "./TrainingScheduleEntry";

// TESTDATEN // Benötigt werden Daten vom Typ Training
import trainingTestData from "../../../example/trainingSchedule.json";

export default function ExercisesContent() {
  return (
    <Sheet
      variant="outlined"
      color="neutral"
      sx={{ width: "100%", height: "100%", p: 2 }}
    >
      <Grid container spacing={4}>
        {trainingTestData.map((trainingScheduleEntryData) => {
          return (
            <Grid xs={4}>
              <TrainingScheduleEntry training={trainingScheduleEntryData} />
            </Grid>
          );
        })}
      </Grid>
    </Sheet>
  );
}
