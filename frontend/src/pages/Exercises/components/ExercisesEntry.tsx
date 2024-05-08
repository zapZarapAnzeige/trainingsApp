import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import { AspectRatio, Box, IconButton, Stack, Typography } from "@mui/joy";
import { ExercisesEntryData } from "../../../types";
import { FC, useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import AddIcon from "@mui/icons-material/Add";
import ExercisesAddDialog from "./ExercisesAddDialog";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { setExercisesAddDialog } from "../../../redux/reducers/exercisesAddDialogSlice";
import { Experimental_CssVarsProvider as MaterialCssVarsProvider } from "@mui/material/styles";

import ExercisesInfoDialog from "./ExercisesInfoDialog";
import {
  setExercisesInfoDialog,
  setUserRating,
} from "../../../redux/reducers/exercisesInfoDialogSlice";

// TESTDATEN // Benötigt werden Daten vom Typ ExercisesAddDialog // API Aufruf Simulieren
import exercisesAddDialogData from "../../../example/exampleExercisesAddDialog.json";
import exercisesInfoDialogData from "../../../example/exampleExercisesInfoDialog.json";

type ExercisesEntryProps = {
  exercisesEntryData: ExercisesEntryData;
};

const ExercisesEntry: FC<ExercisesEntryProps> = ({ exercisesEntryData }) => {
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [openInfoDialog, setOpenInfoDialog] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  dispatch(
    setExercisesAddDialog({
      ...exercisesAddDialogData,
      exerciseName: exercisesEntryData.exerciseName,
      exercise: { minutes: 0 },
    })
  );

  dispatch(
    setExercisesInfoDialog({
      ...exercisesInfoDialogData,
      exerciseName: exercisesEntryData.exerciseName,
      userRating: exercisesEntryData.userRating,
      primaryTags: exercisesEntryData.primaryTags,
      secondaryTags: exercisesEntryData.secondaryTags,
    })
  );

  return (
    <>
      <ExercisesAddDialog open={openAddDialog} setOpen={setOpenAddDialog} />
      <ExercisesInfoDialog open={openInfoDialog} setOpen={setOpenInfoDialog} />
      <Card>
        <Typography level="title-lg" mx="auto">
          {exercisesEntryData.exerciseName}
        </Typography>
        <AspectRatio minHeight="120px" maxHeight="200px">
          <img
            src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
            srcSet="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286&dpr=2 2x"
            loading="lazy"
            alt=""
          />
        </AspectRatio>
        <Stack></Stack>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" spacing={1}>
            <Stack direction="column">
              <Stack direction="row">
                <Typography fontSize="lg" fontWeight="lg" mr={1}>
                  {exercisesEntryData.rating.toFixed(1)}
                </Typography>
                <MaterialCssVarsProvider>
                  <Rating
                    precision={0.5}
                    name="simple-controlled"
                    defaultValue={exercisesEntryData.rating}
                    onChange={(event, newValue) => {
                      dispatch(setUserRating(newValue ?? 0));
                    }}
                  />
                </MaterialCssVarsProvider>
              </Stack>
              <Typography level="body-xs">
                {exercisesEntryData.reviews}{" "}
                {exercisesEntryData.reviews === 1 ? "Bewertung" : "Bewertungen"}
              </Typography>
            </Stack>
            <IconButton
              variant="outlined"
              color="primary"
              sx={{ width: "100%" }}
              onClick={() => setOpenAddDialog(true)}
            >
              <AddIcon />
            </IconButton>
            <IconButton
              variant="outlined"
              color="neutral"
              sx={{ width: "100%" }}
              onClick={() => setOpenInfoDialog(true)}
            >
              <InfoIcon />
            </IconButton>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default ExercisesEntry;
