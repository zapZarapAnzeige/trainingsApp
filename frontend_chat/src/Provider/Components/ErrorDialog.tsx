import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
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
    <Dialog open={open} onClose={closeErrorDialog}>
      <DialogTitle>Error</DialogTitle>
      <DialogContent>
        <DialogContentText>{errorMessage}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeErrorDialog} color="secondary">
          {intl.formatMessage({ id: "errorDialog.close" })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
