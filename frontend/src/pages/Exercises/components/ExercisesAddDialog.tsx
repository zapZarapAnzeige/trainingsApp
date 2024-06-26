import { FC, useState } from "react";
import * as React from "react";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import {
  Checkbox,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemContent,
  Stack,
  Typography,
} from "@mui/joy";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  addToTraining,
  clearAll,
  removeFromTraining,
  setMinutes,
  setRepetitionAmount,
  setSetAmount,
} from "../../../redux/reducers/exercisesAddDialogSlice";
import { putExercisesAdd } from "../../../api";
import { useAuthHeader } from "react-auth-kit";
import { useIntl } from "react-intl";

type ExercisesAddDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ExercisesAddDialog: FC<ExercisesAddDialogProps> = ({ open, setOpen }) => {
  const auth = useAuthHeader();
  const intl = useIntl();
  const [isDataDirty, setIsDataDirty] = useState<boolean>(false);
  const exercisesAddDialog = useAppSelector(
    (state) => state.exercisesAddDialog.value
  );
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setIsDataDirty(false);
    dispatch(clearAll());
    setOpen(false);
  };

  const handleSave = () => {
    putExercisesAdd(auth(), {
      exerciseName: exercisesAddDialog.exerciseName,
      exerciseId: exercisesAddDialog.exerciseId,
      exerciseType: exercisesAddDialog.exerciseType,
      exercise: exercisesAddDialog.exercise,
      inTraining: exercisesAddDialog.inTraining,
      notInTraining: exercisesAddDialog.notInTraining,
    });
    handleClose();
  };

  const isDataValid = () => {
    if (exercisesAddDialog.inTraining.length === 0) {
      return false;
    }
    if ("minutes" in exercisesAddDialog.exercise) {
      return exercisesAddDialog.exercise.minutes != 0;
    } else {
      return (
        exercisesAddDialog.exercise.repetitionAmount != 0 &&
        exercisesAddDialog.exercise.setAmount != 0
      );
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <DialogTitle>{exercisesAddDialog.exerciseName}</DialogTitle>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />
        {"minutes" in exercisesAddDialog.exercise && (
          <FormControl>
            <FormLabel>
              {intl.formatMessage({ id: "exercises.label.minutes" })}
            </FormLabel>
            <Input
              value={exercisesAddDialog.exercise.minutes}
              autoFocus
              required
              type="number"
              onChange={(e) => {
                setIsDataDirty(true);
                dispatch(setMinutes(parseInt(e.target.value)));
              }}
            />
          </FormControl>
        )}

        {"repetitionAmount" in exercisesAddDialog.exercise && (
          <>
            <FormControl>
              <FormLabel>
                {intl.formatMessage({ id: "exercises.label.sets" })}
              </FormLabel>
              <Input
                value={exercisesAddDialog.exercise.setAmount}
                required
                type="number"
                onChange={(e) => {
                  setIsDataDirty(true);
                  dispatch(setSetAmount(parseInt(e.target.value)));
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>
                {intl.formatMessage({ id: "exercises.label.repetitions" })}
              </FormLabel>
              <Input
                value={exercisesAddDialog.exercise.repetitionAmount}
                required
                type="number"
                onChange={(e) => {
                  setIsDataDirty(true);
                  dispatch(setRepetitionAmount(parseInt(e.target.value)));
                }}
              />
            </FormControl>
          </>
        )}
        <Divider />
        <Typography sx={{ mx: "auto" }} fontSize="lg">
          {intl.formatMessage({ id: "exercises.label.addExercise" })}
        </Typography>
        <List sx={{ overflow: "auto" }}>
          {exercisesAddDialog.inTraining
            .concat(exercisesAddDialog.notInTraining)
            .sort((a, b) => a.trainingId - b.trainingId)
            .map((training) => {
              return (
                <ListItem key={training.trainingId}>
                  <ListItemContent>
                    <Stack direction="row" justifyContent="space-between">
                      <Checkbox
                        checked={exercisesAddDialog.inTraining.includes(
                          training
                        )}
                        onChange={(e) => {
                          setIsDataDirty(true);
                          dispatch(
                            e.target.checked
                              ? addToTraining(training.trainingId)
                              : removeFromTraining(training.trainingId)
                          );
                        }}
                      />
                      <Typography fontSize="lg">
                        {training.trainingName}
                      </Typography>
                    </Stack>
                  </ListItemContent>
                </ListItem>
              );
            })}
        </List>

        <Divider />
        <IconButton
          variant="solid"
          color="primary"
          disabled={!isDataDirty || !isDataValid()}
          onClick={handleSave}
        >
          <CheckIcon />
        </IconButton>
      </ModalDialog>
    </Modal>
  );
};

export default ExercisesAddDialog;
