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
import DeleteIcon from "@mui/icons-material/Delete";
import { DismissDialogType, Training } from "../../../types";
import { FC, useState } from "react";
import TrainingScheduleDialog from "./TrainingScheduleDialog";
import { weekdaysAbbreviation, weekdaysNames } from "../../../constants";
import {
  setReloadTrainingScheduleContent,
  setTraining,
} from "../../../redux/reducers/trainingScheduleDialogSlice";
import { useIntl } from "react-intl";
import { deleteTraining } from "../../../api";
import { useAuthHeader } from "react-auth-kit";
import DismissDialog from "../../../Common/DismissDialog";

type TrainingScheduleEntryProps = {
  training: Training;
};

const TrainingScheduleEntry: FC<TrainingScheduleEntryProps> = ({
  training,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const intl = useIntl();
  const auth = useAuthHeader();
  const [isDeleteTrainingDialogOpen, setIsDeleteTrainingDialogOpen] =
    useState<boolean>(false);

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
              <Grid display={"flex"} flexDirection={"row"}>
                <IconButton
                  aria-label="delete"
                  onClick={() => setIsDeleteTrainingDialogOpen(true)}
                >
                  <DeleteIcon />
                </IconButton>
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
                        {intl.formatMessage(
                          { id: "calendar.label.min" },
                          { min: exercise.exercise.minutes }
                        )}
                      </ListItemContent>
                    ) : (
                      <ListItemContent>
                        {exercise.exercise.setAmount} x{" "}
                        {intl.formatMessage(
                          { id: "calendar.label.rep" },
                          { rep: exercise.exercise.repetitionAmount }
                        )}
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
                      disabled={true}
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
      <DismissDialog
        closeDismissDialog={() => setIsDeleteTrainingDialogOpen(false)}
        dismissDialogType={DismissDialogType.WARNING}
        dialogContent={intl.formatMessage(
          {
            id: "trainingsSchedule.confirmDelete",
          },
          { trainingName: training.name }
        )}
        open={isDeleteTrainingDialogOpen}
        okAction={() =>
          deleteTraining(auth(), training.trainingId).then(() =>
            dispatch(setReloadTrainingScheduleContent(true))
          )
        }
      />
    </>
  );
};

export default TrainingScheduleEntry;
