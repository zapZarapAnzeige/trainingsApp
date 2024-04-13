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
import { FC } from "react";
import { useIntl } from "react-intl";
import { DismissDialogType } from "../types";

type InfoDialogProps = {
  open: boolean;
  dismissDialogType: DismissDialogType;
  closeErrorDialog: VoidFunction;
  errorMessage: string;
};

const InfoDialog: FC<InfoDialogProps> = ({
  open,
  dismissDialogType,
  closeErrorDialog,
  errorMessage,
}) => {
  const intl = useIntl();

  function getDialogTitleIcon(dismissDialogType: DismissDialogType) {
    switch (dismissDialogType) {
      case DismissDialogType.INFO:
        return <InfoRoundedIcon />;
      case DismissDialogType.WARNING:
        return <WarningRoundedIcon />;
      case DismissDialogType.ERROR:
        return <CancelRoundedIcon />;
      default:
        return <CancelRoundedIcon />;
    }
  }

  function getDialogTitle(dismissDialogType: DismissDialogType) {
    switch (dismissDialogType) {
      case DismissDialogType.INFO:
        return "Hinweis";
      case DismissDialogType.WARNING:
        return "Warnung";
      case DismissDialogType.ERROR:
        return "Error";
      default:
        return "Error";
    }
  }

  return (
    <Modal open={open} onClose={closeErrorDialog}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>
          {getDialogTitleIcon(dismissDialogType)}
          <WarningRoundedIcon />
          {getDialogTitle(dismissDialogType)}
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

export default InfoDialog;
