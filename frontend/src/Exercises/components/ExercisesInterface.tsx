import { Box, IconButton, Select } from "@mui/joy";
import Button from "@mui/joy/Button";
import AddIcon from "@mui/icons-material/Add";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useState } from "react";

export default function ExercisesInterface() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={1}
        bgcolor="primary.main"
        color="white"
      >
        <Box display="flex" alignItems="center">
          <Select></Select>
        </Box>
      </Box>
    </>
  );
}
