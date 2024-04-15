import { Sheet, Grid } from "@mui/joy";
import TrainingScheduleEntry from "./TrainingScheduleEntry";

// TESTDATEN // Benötigt werden Daten vom Typ Training
import testTrainingData from "../../example/trainingSchedule.json";

export default function TrainingScheduleContent() {
  return (
    <Sheet
      variant="outlined"
      color="neutral"
      sx={{ width: "100%", height: "100%", p: 2 }}
    >
      <Grid container spacing={4}>
        {testTrainingData.map((training) => {
          return (
            <Grid xs={4}>
              <TrainingScheduleEntry training={training} />
            </Grid>
          );
        })}
      </Grid>
    </Sheet>
  );
}
