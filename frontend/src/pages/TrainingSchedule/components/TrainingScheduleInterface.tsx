import { Box, IconButton } from "@mui/joy";
import Button from "@mui/joy/Button";
import AddIcon from "@mui/icons-material/Add";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import TrainingScheduleDialog from "./TrainingScheduleDialog";
import { useState } from "react";

export default function TrainingScheduleInterface() {
  const [open, setOpen] = useState<boolean>(false);

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
            Neues Training hinzufügen
          </Button>
        </Box>
        <Box>
          <IconButton aria-label="Info">
            <HelpOutlineIcon />
          </IconButton>
        </Box>
      </Box>
    </>
  );
}
