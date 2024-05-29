import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Typography } from "@mui/joy";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  increaseCW,
  decreaseCW,
  setIsDataDirty,
} from "../redux/reducers/calendarSlice";

export default function Pagination() {
  const dispatch = useAppDispatch();
  const isDataDirty = useAppSelector((state) => state.calendar.isDataDirty);
  const currentCW = useAppSelector((state) => state.calendar.currentCW);

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
        onClick={() => {
          dispatch(decreaseCW());
          dispatch(setIsDataDirty(false));
        }}
      >
        Zurück
      </Button>

      <Box sx={{ flex: 1 }} />
      <Typography>{"KW: " + currentCW}</Typography>
      <Box sx={{ flex: 1 }} />

      <Button
        size="sm"
        variant="outlined"
        color="neutral"
        endDecorator={<KeyboardArrowRightIcon />}
        onClick={() => {
          dispatch(increaseCW());
          dispatch(setIsDataDirty(false));
        }}
      >
        Weiter
      </Button>
    </Box>
  );
}
