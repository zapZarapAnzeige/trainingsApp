import { Box, IconButton } from "@mui/joy";
import Button from "@mui/joy/Button";
import AddIcon from "@mui/icons-material/Add";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import TrainingScheduleDialog from "./TrainingScheduleDialog";
import { useState } from "react";
import { changePage } from "../../../redux/reducers/currentPageSlice";
import { useAppDispatch } from "../../../hooks";
import { useIntl } from "react-intl";

export default function TrainingScheduleInterface() {
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const intl = useIntl();

  return (
    <>
      <TrainingScheduleDialog
        editTraining={false}
        open={open}
        setOpen={setOpen}
      />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={1}
        bgcolor="primary.main"
        color="white"
      >
        <Box display="flex" alignItems="center">
          <Button
            variant="solid"
            startDecorator={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            {intl.formatMessage({ id: "trainingSchedule.label.addTraining" })}
          </Button>
        </Box>
        <Box>
          <IconButton
            aria-label="Info"
            size="lg"
            onClick={() => dispatch(changePage("tips"))}
          >
            <HelpOutlineIcon color="primary" />
          </IconButton>
        </Box>
      </Box>
    </>
  );
}
