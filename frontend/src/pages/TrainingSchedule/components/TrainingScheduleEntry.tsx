import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import ListDivider from "@mui/joy/ListDivider";
import {
  Box,
  Checkbox,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemContent,
  Stack,
  Typography,
} from "@mui/joy";
import { useAppDispatch } from "../../../hooks";
import FormLabel from "@mui/joy/FormLabel";
import CreateIcon from "@mui/icons-material/Create";
import { Training } from "../../../types";
import { FC, useState } from "react";
import TrainingScheduleDialog from "./TrainingScheduleDialog";
import { weekdaysAbbreviation, weekdaysNames } from "../../../constants";
import { setTraining } from "../../../redux/reducers/trainingScheduleDialogSlice";

type TrainingScheduleEntryProps = {
  training: Training;
};

const TrainingScheduleEntry: FC<TrainingScheduleEntryProps> = ({
  training,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleOpenEditDialog = () => {
    dispatch(setTraining(training));
    setOpen(true);
  };

  return (
    <>
      <TrainingScheduleDialog
        open={open}
        setOpen={setOpen}
        editTraining={true}
      />
      <Card
        sx={{
          maxWidth: "100%",
          boxShadow: "lg",
          margin: "auto",
          height: "50vh",
        }}
      >
        <CardOverflow sx={{ bgcolor: "background.level1" }}>
          <CardContent>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid>
                <Typography level="h4">{training.name}</Typography>
              </Grid>
              <Grid>
                <IconButton aria-label="edit" onClick={handleOpenEditDialog}>
                  <CreateIcon />
                </IconButton>
              </Grid>
            </Grid>
          </CardContent>
        </CardOverflow>
        <CardContent sx={{ overflow: "auto" }}>
          <List>
            {training.exercises.map((exercise, index) => {
              return (
                <Box key={exercise.exerciseId}>
                  <ListItem>
                    <ListItemContent>{exercise.exerciseName}</ListItemContent>
                    {"minutes" in exercise.exercise ? (
                      <ListItemContent>
                        {exercise.exercise.minutes} Min.
                      </ListItemContent>
                    ) : (
                      <ListItemContent>
                        {exercise.exercise.setAmount} x{" "}
                        {exercise.exercise.repetitionAmount} Wdh.
                      </ListItemContent>
                    )}
                  </ListItem>
                  {index < training.exercises.length - 1 && (
                    <ListDivider inset="gutter" />
                  )}
                </Box>
              );
            })}
          </List>
        </CardContent>
        <CardOverflow sx={{ bgcolor: "background.level1" }}>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              {weekdaysNames.map((day, index) => {
                return (
                  <FormControl key={day}>
                    <Checkbox
                      checked={training.onDays.includes(day)}
                      sx={{ marginBottom: 1 }}
                      readOnly
                      color="neutral"
                    />
                    <FormLabel>{weekdaysAbbreviation[index]}</FormLabel>
                  </FormControl>
                );
              })}
            </Stack>
          </CardContent>
        </CardOverflow>
      </Card>
    </>
  );
};

export default TrainingScheduleEntry;
