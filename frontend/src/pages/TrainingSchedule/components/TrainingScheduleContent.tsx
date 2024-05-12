import { Sheet, Grid } from "@mui/joy";
import TrainingScheduleEntry from "./TrainingScheduleEntry";

// TESTDATEN // Benötigt werden Daten vom Typ Training
// import trainingTestData from "../../../example/trainingSchedule.json";
import { Training } from "../../../types";
import { useEffect, useState } from "react";
import { getTrainingData } from "../../../api";

export default function ExercisesContent() {
  const [trainingData, setTrainingData] = useState<Training[]>();

  useEffect(() => {
    getTrainingData("TOKEN__")
      .then((data: Training[]) => {
        setTrainingData(data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  });

  return (
    <Sheet
      variant="outlined"
      color="neutral"
      sx={{ width: "100%", height: "100%", p: 2, overflow: "auto" }}
    >
      <Grid container spacing={4}>
        {trainingData?.map((trainingScheduleEntryData) => {
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
