import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { FC } from "react";
import { useIntl } from "react-intl";

type ErrorDialogProps = {
  open: boolean;
  closeErrorDialog: VoidFunction;
  errorMessage: string;
};

export const ErrorDialog: FC<ErrorDialogProps> = ({
  closeErrorDialog,
  errorMessage,
  open,
}) => {
  const intl = useIntl();
  return (
    <Modal open={open} onClose={closeErrorDialog}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>
          <WarningRoundedIcon />
          Error
        </DialogTitle>
        <Divider />
        <DialogContent>{errorMessage}</DialogContent>
        <DialogActions>
          <Button onClick={closeErrorDialog} variant="solid" color="danger">
            {intl.formatMessage({ id: "errorDialog.close" })}
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};
