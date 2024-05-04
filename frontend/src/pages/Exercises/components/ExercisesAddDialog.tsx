import { FC, useState } from "react";
import * as React from "react";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import {
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Stack,
} from "@mui/joy";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  setExercisesAddDialog,
  setMinutes,
  setRepetitionAmount,
  setSetAmount,
  setWeight,
} from "../../../redux/reducers/exercisesAddDialogSlice";

type ExercisesAddDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ExercisesAddDialog: FC<ExercisesAddDialogProps> = ({ open, setOpen }) => {
  const [isDataDirty, setIsDataDirty] = useState<boolean>(false);
  const exercisesAddDialog = useAppSelector(
    (state) => state.exercisesAddDialog.value
  );
  const dispatch = useAppDispatch();

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <DialogTitle>{exercisesAddDialog.exerciseName}</DialogTitle>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Stack>
        {"minutes" in exercisesAddDialog.exercise && (
          <FormControl>
            <FormLabel>Minuten</FormLabel>
            <Input
              value={exercisesAddDialog.exercise.minutes}
              autoFocus
              required
              type="number"
              onChange={(e) => {
                setIsDataDirty(true);
                setMinutes(parseInt(e.target.value));
              }}
            />
          </FormControl>
        )}

        {"weight" in exercisesAddDialog.exercise && (
          <>
            <FormControl>
              <FormLabel>Gewicht</FormLabel>
              <Input
                value={exercisesAddDialog.exercise.weight}
                autoFocus
                required
                type="number"
                onChange={(e) => {
                  setIsDataDirty(true);
                  setWeight(parseInt(e.target.value));
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Wiederholungen</FormLabel>
              <Input
                value={exercisesAddDialog.exercise.repetitionAmount}
                required
                type="number"
                onChange={(e) => {
                  setIsDataDirty(true);
                  setRepetitionAmount(parseInt(e.target.value));
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Sets</FormLabel>
              <Input
                value={exercisesAddDialog.exercise.setAmount}
                required
                type="number"
                onChange={(e) => {
                  setIsDataDirty(true);
                  setSetAmount(parseInt(e.target.value));
                }}
              />
            </FormControl>
          </>
        )}
        <Divider />
        <IconButton
          variant="solid"
          color="primary"
          disabled={!isDataDirty}
          onClick={() => {}}
        >
          <CheckIcon />
        </IconButton>
      </ModalDialog>
    </Modal>
  );
};

export default ExercisesAddDialog;
