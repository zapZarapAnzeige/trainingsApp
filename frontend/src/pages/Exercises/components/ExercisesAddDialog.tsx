import { FC } from "react";
import * as React from "react";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";

type ExercisesAddDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ExercisesAddDialog: FC<ExercisesAddDialogProps> = ({ open, setOpen }) => {
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog></ModalDialog>
    </Modal>
  );
};

export default ExercisesAddDialog;
