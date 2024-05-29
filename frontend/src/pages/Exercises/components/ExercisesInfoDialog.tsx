import { FC } from "react";
import * as React from "react";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { DialogTitle, Divider, IconButton, Stack, Typography } from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { clearAll } from "../../../redux/reducers/exercisesInfoDialogSlice";
import Chip from "@mui/joy/Chip";
import Rating from "@mui/material/Rating";
import { Experimental_CssVarsProvider as MaterialCssVarsProvider } from "@mui/material/styles";
import { useIntl } from "react-intl";

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
  const intl = useIntl();

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
        <Stack direction="row" spacing={2}>
          <Typography>{intl.formatMessage({id: "exercises.label.yourRating"})}</Typography>
          <MaterialCssVarsProvider>
            <Rating
              precision={0.5}
              name="simple-controlled"
              value={exercisesInfoDialog.userRating}
              readOnly
            />
          </MaterialCssVarsProvider>
        </Stack>
        <Divider />
        <Typography sx={{ mx: "auto" }}>
          {exercisesInfoDialog.exerciseText}
        </Typography>
        <Divider />
        <Stack direction="row" spacing={2}>
          {exercisesInfoDialog.primaryTags.map((primaryTag, i) => (
            <Chip color="primary" key={i}>
              {primaryTag}
            </Chip>
          ))}
          {exercisesInfoDialog.secondaryTags.map((secondaryTag, i) => (
            <Chip key={i}>{secondaryTag}</Chip>
          ))}
        </Stack>
      </ModalDialog>
    </Modal>
  );
};

export default ExercisesInfoDialog;
