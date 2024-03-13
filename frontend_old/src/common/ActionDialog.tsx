import {
  Dialog,
  DialogTitle,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { FC } from "react";
import { useIntl } from "react-intl";

type ActionDialogProps = {
  dialogTitle: string;
  dialogContent: string;
  action: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  onCloseAction?: () => void;
};

export const ActionDialog: FC<ActionDialogProps> = ({
  action,
  dialogTitle,
  dialogContent,
  open,
  setOpen,
  onCloseAction,
}) => {
  const intl = useIntl();
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogContent}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
            onCloseAction && onCloseAction();
          }}
          color="secondary"
        >
          {intl.formatMessage({ id: "confirmAbortDialog.abort" })}
        </Button>
        <Button
          onClick={() => {
            action();
            setOpen(false);
          }}
          color="secondary"
          autoFocus
        >
          {intl.formatMessage({ id: "confirmAbortDialog.confirm" })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
