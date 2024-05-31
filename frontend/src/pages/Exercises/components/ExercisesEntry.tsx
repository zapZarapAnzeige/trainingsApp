import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import { AspectRatio, Box, IconButton, Stack, Typography } from "@mui/joy";
import { ExerciseAdd, ExerciseInfo, ExercisesEntryData } from "../../../types";
import { FC, useEffect, useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import Rating from "@mui/material/Rating";
import AddIcon from "@mui/icons-material/Add";
import ExercisesAddDialog from "./ExercisesAddDialog";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { setExercisesAddDialog } from "../../../redux/reducers/exercisesAddDialogSlice";
import { Experimental_CssVarsProvider as MaterialCssVarsProvider } from "@mui/material/styles";
import {
  getExercisesAdd,
  getExercisesInfo,
  postExerciseNewUserRating,
} from "../../../api";

import ExercisesInfoDialog from "./ExercisesInfoDialog";
import {
  setExercisesInfoDialog,
  setQuickInfo,
} from "../../../redux/reducers/exercisesInfoDialogSlice";
import { useAuthHeader } from "react-auth-kit";
import { changePage } from "../../../redux/reducers/currentPageSlice";
import { useIntl } from "react-intl";

// TESTDATEN // Benötigt werden Daten vom Typ ExercisesAddDialog // API Aufruf Simulieren
//import exercisesAddDialogData from "../../../example/exampleExercisesAddDialog.json";
//import exercisesInfoDialogData from "../../../example/exampleExercisesInfoDialog.json";

type ExercisesEntryProps = {
  exercisesEntryData: ExercisesEntryData;
};

const ExercisesEntry: FC<ExercisesEntryProps> = ({ exercisesEntryData }) => {
  const auth = useAuthHeader();
  const intl = useIntl();
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [openInfoDialog, setOpenInfoDialog] = useState<boolean>(false);

  const quickInfo = useAppSelector(
    (state) => state.exercisesInfoDialog.quickInfo
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (openAddDialog) {
      getExercisesAdd(auth(), exercisesEntryData.exerciseId)
        .then((exercisesAddDialogData: ExerciseAdd) => {
          dispatch(
            setExercisesAddDialog({
              ...exercisesAddDialogData,
              exerciseName: exercisesEntryData.exerciseName,
              exerciseId: exercisesEntryData.exerciseId,
              exerciseType: exercisesEntryData.exerciseType,
              exercise:
                exercisesEntryData.exerciseType == "Min"
                  ? { minutes: 0 }
                  : { repetitionAmount: 0, setAmount: 0 },
            })
          );
        })
        .catch((error) => {
          console.error("Error fetching data", error);
        });
    }
  }, [openAddDialog]);

  useEffect(() => {
    if (openInfoDialog) {
      getExercisesInfo(auth(), exercisesEntryData.exerciseId)
        .then((exercisesInfoDialogData: ExerciseInfo) => {
          dispatch(
            setExercisesInfoDialog({
              ...exercisesInfoDialogData,
              exerciseName: exercisesEntryData.exerciseName,
              primaryTags: exercisesEntryData.primaryTags,
              secondaryTags: exercisesEntryData.secondaryTags,
            })
          );
        })
        .catch((error) => {
          console.error("Error fetching data", error);
        });
    }
  }, [openInfoDialog]);

  useEffect(() => {
    if (quickInfo === exercisesEntryData.exerciseName) {
      setOpenInfoDialog(true);
      dispatch(setQuickInfo(""));
    }
  }, []);

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
            src={"data:image/jpeg;base64," + exercisesEntryData.previewImage}
            loading="lazy"
            alt=""
          />
        </AspectRatio>
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
                      postExerciseNewUserRating(
                        auth(),
                        newValue ?? 0,
                        exercisesEntryData.exerciseId
                      );
                    }}
                  />
                </MaterialCssVarsProvider>
              </Stack>
              <Typography level="body-xs">
                {exercisesEntryData.reviews}{" "}
                {exercisesEntryData.reviews === 1
                  ? intl.formatMessage({ id: "exercises.label.rating" })
                  : intl.formatMessage({ id: "exercises.label.ratings" })}
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
