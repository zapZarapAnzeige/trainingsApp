import { Box, IconButton } from "@mui/joy";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function TrainingScheduleInterface() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={2}
      bgcolor="primary.main"
      color="white"
    >
      <Box display="flex" alignItems="center">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="small"
          style={{ marginRight: "8px" }}
        >
          Trainingsplan hinzufügen
        </Button>
      </Box>
      <Box>
        <IconButton aria-label="Info">
          <InfoOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
