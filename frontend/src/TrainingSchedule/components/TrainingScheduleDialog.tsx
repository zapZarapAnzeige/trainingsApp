import { FC, useState } from "react";
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
import { Exercise, Training } from "../../types";
import { Checkbox, Divider, IconButton, Select } from "@mui/joy";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { weekdaysAbbreviation } from "../../constants";
import { useAppSelector, useAppDispatch } from "../../hooks";
import {
  addDay,
  removeDay,
  setName,
} from "../../redux/reducers/trainingScheduleSlice";
import { mapNumberToWeekdayString } from "../../utils";
import TrainingsScheduleDialogSelect from "./TrainingsScheduleDialogSelect";

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

  const [exerciseStack, setExerciseStack] = useState<
    FC<TrainingScheduleDialogProps>[]
  >([]);

  const [exercises, setExercises] = useState<Exercise[]>([]);

  const title = editTraining
    ? "Training bearbeiten"
    : "Neues Training erstellen";

  const handleDayToggle = (checkboxDay: string, check: boolean) => {
    dispatch(check ? addDay(checkboxDay) : dispatch(removeDay(checkboxDay)));
    console.log(trainingScheduleDialog.onDays);
  };

  /*const handleAddExercise = () => {
    setExercises([...exercises, {exerciseName: "", exercise: }])
    setExerciseStack([...exerciseStack, <TrainingsScheduleDialogSelect exercises={exercises[-1]} />]
      
    );
  };*/

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <DialogTitle>{title}</DialogTitle>
          <IconButton onClick={() => setOpen(false)}>
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
              onChange={(e) => dispatch(setName(e.target.value))}
            />
          </FormControl>
        </Stack>
        <Divider />
        <Stack spacing={2}>
          {}
          <Button startDecorator={<AddIcon />} color="neutral">
            Übung hinzufügen
          </Button>
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
        <IconButton variant="solid" color="primary">
          <CheckIcon />
        </IconButton>
      </ModalDialog>
    </Modal>
  );
};

export default TrainingScheduleDialog;
