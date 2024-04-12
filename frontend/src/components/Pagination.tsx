import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Typography } from "@mui/joy";

export default function Pagination() {
  return (
    <Box
      className="Pagination-laptopUp"
      sx={{
        pt: 2,
        mb: 1,
        gap: 1,
        [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
        display: {
          xs: "none",
          md: "flex",
        },
      }}
    >
      <Button
        size="sm"
        variant="outlined"
        color="neutral"
        startDecorator={<KeyboardArrowLeftIcon />}
      >
        Zurück
      </Button>

      <Box sx={{ flex: 1 }} />
      <Typography>KW: 5</Typography>
      <Box sx={{ flex: 1 }} />

      <Button
        size="sm"
        variant="outlined"
        color="neutral"
        endDecorator={<KeyboardArrowRightIcon />}
      >
        Weiter
      </Button>
    </Box>
  );
}
