import { FC, useState, useEffect } from "react";
import * as React from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import Stack from "@mui/joy/Stack";
import AddIcon from "@mui/icons-material/Add";
import { Exercise, Training } from "../../../types";
import Option from "@mui/joy/Option";
import {
  Checkbox,
  Divider,
  IconButton,
  List,
  ListDivider,
  ListItem,
  ListItemContent,
  Select,
} from "@mui/joy";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { exercises, weekdaysAbbreviation } from "../../../constants";
import { useAppSelector, useAppDispatch } from "../../../hooks";
import {
  addDay,
  removeDay,
  setName,
  addExercise,
  removeExercise,
  clearAll,
} from "../../../redux/reducers/trainingScheduleSlice";
import { mapNumberToWeekdayString } from "../../../utils";

type TrainingScheduleDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editTraining?: Training;
};

const TrainingScheduleDialog: FC<TrainingScheduleDialogProps> = ({
  open,
  setOpen,
  editTraining,
}) => {
  const trainingScheduleDialog = useAppSelector(
    (state) => state.trainingScheduleDialog.value
  );
  const dispatch = useAppDispatch();

  const [openExerciseDialog, setOpenExerciseDialog] = useState<boolean>(false);
  const [isDataDirty, setIsDataDirty] = useState<boolean>(false);

  // Excerise Dialog States
  const [selectedExercise, setSelectedExercise] = useState<Exercise>();
  const [minutes, setMinutes] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [repetitions, setRepetitions] = useState<number>(0);
  const [sets, setSets] = useState<number>(0);

  const title = editTraining
    ? "Training bearbeiten"
    : "Neues Training erstellen";

  const handleDayToggle = (checkboxDay: string, check: boolean) => {
    dispatch(check ? addDay(checkboxDay) : dispatch(removeDay(checkboxDay)));
    setIsDataDirty(true);
  };

  const handleExerciseDialogClose = () => {
    setSelectedExercise(undefined);
    setMinutes(0);
    setWeight(0);
    setRepetitions(0);
    setSets(0);
    setOpenExerciseDialog(false);
  };

  const handleClose = () => {
    setIsDataDirty(false);
    dispatch(clearAll());
    setOpen(false);
  };

  const handleExerciseSelect = (
    event: React.SyntheticEvent | null,
    newValue: Exercise | null
  ) => {
    setSelectedExercise(newValue ?? undefined);
  };

  const isExerciseValid = () => {
    if (selectedExercise) {
      if ("minutes" in selectedExercise.exercise) {
        return minutes !== 0;
      } else if ("weight" in selectedExercise.exercise) {
        return weight !== 0 && repetitions !== 0 && sets !== 0;
      } else {
        return false;
      }
    }
  };

  const handleAddExercise = () => {
    if (selectedExercise) {
      dispatch(
        "minutes" in selectedExercise.exercise
          ? addExercise({
              exerciseName: selectedExercise.exerciseName,
              exercise: { minutes: minutes },
            })
          : addExercise({
              exerciseName: selectedExercise.exerciseName,
              exercise: {
                weight: weight,
                repetitionAmount: repetitions,
                setAmount: sets,
              },
            })
      );
      setIsDataDirty(true);
      handleExerciseDialogClose();
    }
  };

  useEffect(() => {
    if (!openExerciseDialog) {
      setSelectedExercise(undefined);
    }
  }, [openExerciseDialog]);

  return (
    <>
      <Modal open={openExerciseDialog} onClose={handleExerciseDialogClose}>
        <ModalDialog>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <DialogTitle>Übung hinzufügen</DialogTitle>
            <IconButton onClick={() => setOpenExerciseDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Divider />
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Übung</FormLabel>
              <Select
                autoFocus
                required
                onChange={handleExerciseSelect}
                sx={{ mb: 1 }}
              >
                {exercises
                  .filter(
                    (exercise) =>
                      !trainingScheduleDialog.exercises.some(
                        (dialogExercise) =>
                          dialogExercise.exerciseName === exercise.exerciseName
                      )
                  )
                  .map((exercise) => (
                    <Option value={exercise}>{exercise.exerciseName}</Option>
                  ))}
              </Select>
              {selectedExercise && "minutes" in selectedExercise.exercise && (
                <FormControl>
                  <FormLabel>Minuten</FormLabel>
                  <Input
                    value={minutes}
                    autoFocus
                    required
                    type="number"
                    onChange={(e) => {
                      setMinutes(parseInt(e.target.value));
                    }}
                  />
                </FormControl>
              )}

              {selectedExercise && "weight" in selectedExercise.exercise && (
                <>
                  <FormControl>
                    <FormLabel>Gewicht</FormLabel>
                    <Input
                      value={weight}
                      autoFocus
                      required
                      type="number"
                      onChange={(e) => {
                        setWeight(parseInt(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Wiederholungen</FormLabel>
                    <Input
                      value={repetitions}
                      required
                      type="number"
                      onChange={(e) => {
                        setRepetitions(parseInt(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Sets</FormLabel>
                    <Input
                      value={sets}
                      required
                      type="number"
                      onChange={(e) => {
                        setSets(parseInt(e.target.value));
                      }}
                    />
                  </FormControl>
                </>
              )}
            </FormControl>
          </Stack>
          <Divider />
          <IconButton
            variant="solid"
            color="primary"
            disabled={!isExerciseValid()}
            onClick={handleAddExercise}
          >
            <CheckIcon />
          </IconButton>
        </ModalDialog>
      </Modal>
      <Modal open={open} onClose={handleClose}>
        <ModalDialog>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <DialogTitle>{title}</DialogTitle>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Divider />
          <Stack>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                autoFocus
                required
                onChange={(e) => {
                  dispatch(setName(e.target.value));
                  setIsDataDirty(true);
                }}
              />
            </FormControl>
          </Stack>
          <Divider />
          <Stack spacing={1} sx={{ height: "25vh", overflow: "auto" }}>
            <Button
              startDecorator={<AddIcon />}
              color="neutral"
              onClick={() => setOpenExerciseDialog(true)}
              disabled={
                trainingScheduleDialog.exercises.length >= exercises.length
              }
            >
              Übung hinzufügen
            </Button>
            {trainingScheduleDialog.exercises.map((exercise, index) => {
              return (
                <List>
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
                  {index < trainingScheduleDialog.exercises.length - 1 && (
                    <ListDivider inset="gutter" />
                  )}
                </List>
              );
            })}
          </Stack>
          <Divider />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {weekdaysAbbreviation.map((day, index) => {
              return (
                <FormControl key={index}>
                  <Checkbox
                    sx={{ marginBottom: 1 }}
                    onChange={(e) =>
                      handleDayToggle(
                        mapNumberToWeekdayString(index),
                        e.target.checked
                      )
                    }
                  />
                  <FormLabel>{day}</FormLabel>
                </FormControl>
              );
            })}
          </Stack>
          <Divider />
          <IconButton variant="solid" color="primary" disabled={!isDataDirty}>
            <CheckIcon />
          </IconButton>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default TrainingScheduleDialog;
