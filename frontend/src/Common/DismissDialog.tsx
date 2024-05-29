import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import CancelRoundedIcon from "@mui/icons-material/Cancel";
import InfoRoundedIcon from "@mui/icons-material/Info";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { FC, ReactNode } from "react";
import { useIntl } from "react-intl";
import { DismissDialogType } from "../types";

type DismissDialogProps = {
  open: boolean;
  dismissDialogType: DismissDialogType;
  closeDismissDialog: VoidFunction;
  dialogContent: string | ReactNode;
};

const DismissDialog: FC<DismissDialogProps> = ({
  open,
  dismissDialogType,
  closeDismissDialog,
  dialogContent,
}) => {
  const intl = useIntl();

  function getDialogTitleIcon(dismissDialogType: DismissDialogType) {
    switch (dismissDialogType) {
      case DismissDialogType.INFO:
        return <InfoRoundedIcon />;
      case DismissDialogType.WARNING:
        return <WarningRoundedIcon color="warning" />;
      case DismissDialogType.ERROR:
        return <CancelRoundedIcon color="error" />;
      default:
        return <CancelRoundedIcon />;
    }
  }

  function getDialogTitle(dismissDialogType: DismissDialogType) {
    switch (dismissDialogType) {
      case DismissDialogType.INFO:
        return intl.formatMessage({id: "dismissDialog.label.note"});
      case DismissDialogType.WARNING:
        return intl.formatMessage({id: "dismissDialog.label.warning"});
      case DismissDialogType.ERROR:
        return intl.formatMessage({id: "dismissDialog.label.error"});
      default:
        return intl.formatMessage({id: "dismissDialog.label.error"});
    }
  }

  return (
    <Modal open={open} onClose={closeDismissDialog}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>
          {getDialogTitleIcon(dismissDialogType)}
          {getDialogTitle(dismissDialogType)}
        </DialogTitle>
        <Divider />
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <Button onClick={closeDismissDialog} variant="solid" color="neutral">
            {intl.formatMessage({ id: "dismissDialog.close" })}
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export default DismissDialog;
