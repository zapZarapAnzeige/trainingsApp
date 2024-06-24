import { Sheet, Grid } from "@mui/joy";
import TrainingScheduleEntry from "./TrainingScheduleEntry";
import { Training } from "../../../types";
import { useEffect, useState } from "react";
import { getTrainingData } from "../../../api";
import { useAuthHeader } from "react-auth-kit";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { setReloadTrainingScheduleContent } from "../../../redux/reducers/trainingScheduleDialogSlice";

export default function ExercisesContent() {
  const auth = useAuthHeader();
  const [trainingData, setTrainingData] = useState<Training[]>([]);

  const reloadTrainingScheduleContent = useAppSelector(
    (state) => state.trainingScheduleDialog.reloadTrainingScheduleContent
  );

  const currentPage = useAppSelector((state) => state.currentPage.value);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (reloadTrainingScheduleContent || currentPage === "trainingSchedule") {
      getTrainingData(auth())
        .then((data: Training[]) => {
          setTrainingData(data);
        })
        .catch((error) => {
          console.error("Error fetching data", error);
        });
      dispatch(setReloadTrainingScheduleContent(false));
    }
  }, [reloadTrainingScheduleContent, currentPage]);

  return (
    <Sheet
      variant="outlined"
      color="neutral"
      sx={{ width: "100%", height: "100%", p: 2, overflow: "auto" }}
    >
      <Grid container spacing={4}>
        {trainingData.map((trainingScheduleEntryData) => {
          return (
            <Grid xs={4} key={trainingScheduleEntryData.trainingId}>
              <TrainingScheduleEntry training={trainingScheduleEntryData} />
            </Grid>
          );
        })}
      </Grid>
    </Sheet>
  );
}
