import { FC } from "react";
import * as React from "react";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { DialogTitle, Divider, IconButton, Stack, Typography } from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { clearAll } from "../../../redux/reducers/exercisesInfoDialogSlice";
import Chip from "@mui/joy/Chip";

type ExercisesInfoDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ExercisesInfoDialog: FC<ExercisesInfoDialogProps> = ({
  open,
  setOpen,
}) => {
  const exercisesInfoDialog = useAppSelector(
    (state) => state.exercisesInfoDialog.value
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
          <DialogTitle>{exercisesInfoDialog.exerciseName}</DialogTitle>
          <IconButton
            onClick={() => {
              dispatch(clearAll());
              setOpen(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />
        VIDEO AREA
        <Divider />
        <Typography sx={{ mx: "auto" }}>
          {exercisesInfoDialog.exerciseText}
        </Typography>
        <Divider />
        <Stack direction="row" spacing={2}>
          {exercisesInfoDialog.primaryTags.map((primaryTag) => (
            <Chip color="primary">{primaryTag}</Chip>
          ))}
          {exercisesInfoDialog.secondaryTags.map((secondaryTag) => (
            <Chip>{secondaryTag}</Chip>
          ))}
        </Stack>
      </ModalDialog>
    </Modal>
  );
};

export default ExercisesInfoDialog;
