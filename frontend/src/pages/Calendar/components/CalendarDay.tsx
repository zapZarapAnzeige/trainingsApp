import {
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemContent,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { FC } from "react";
import { CalendarDayData, CalendarExercise } from "../../../types";
import { getWeekday } from "../../../utils";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { setIsDataDirty } from "../../../redux/reducers/calendarSlice";
import { changePage } from "../../../redux/reducers/currentPageSlice";
import { setExercisesAddDialog } from "../../../redux/reducers/exercisesAddDialogSlice";
import { setQuickInfo } from "../../../redux/reducers/exercisesInfoDialogSlice";

type CalendarDayProps = {
  calendarDayData: CalendarDayData;
  completable: boolean;
};

const CalendarDay: FC<CalendarDayProps> = ({
  calendarDayData,
  completable,
}) => {
  const dispatch = useAppDispatch();

  const handleInfoClick = (exerciseName: string) => {
    dispatch(setQuickInfo(exerciseName));
    dispatch(changePage("exercises"));
  };

  return (
    <>
      <Sheet
        variant="outlined"
        sx={{ mb: 1, borderRadius: 5, textAlign: "center" }}
      >
        <Typography sx={{ mx: "auto" }}>
          {getWeekday(calendarDayData.date)}
        </Typography>
        <Typography sx={{ mx: "auto" }}>{calendarDayData.date}</Typography>
      </Sheet>
      {calendarDayData.trainings.length > 0 && (
        <Sheet
          variant="outlined"
          sx={{
            mb: 1,
            borderRadius: 5,
            textAlign: "center",
            px: 0.5,
            height: 200,
            overflow: "auto",
          }}
        >
          {calendarDayData.trainings ? (
            calendarDayData.trainings.map((training) => (
              <List sx={{ display: "flex", flexDirection: "column" }}>
                {training.exercises.map((exercise) => (
                  <>
                    <ListItem sx={{ flexGrow: 6 }}>
                      <ListItemContent>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography>{exercise.exerciseName}</Typography>
                          <IconButton
                            onClick={() =>
                              handleInfoClick(exercise.exerciseName)
                            }
                          >
                            <InfoOutlinedIcon />
                          </IconButton>
                        </Stack>
                      </ListItemContent>
                    </ListItem>
                    <Divider />
                    {"minutes" in exercise.exercise ? (
                      <ListItem sx={{ flexGrow: 6 }}>
                        <ListItemContent>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography>
                              {exercise.exercise.minutes} Min.
                            </Typography>
                            <Checkbox
                              disabled={!completable}
                              color={completable ? "primary" : "neutral"}
                              onClick={() => {
                                if (completable) {
                                  dispatch(setIsDataDirty(true));
                                }
                              }}
                            />
                          </Stack>
                        </ListItemContent>
                      </ListItem>
                    ) : (
                      <ListItem sx={{ flexGrow: 6 }}>
                        <ListItemContent>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography>
                              {exercise.exercise.setAmount} x{" "}
                              {exercise.exercise.repetitionAmount} Wdh.
                            </Typography>
                            <Checkbox />
                          </Stack>
                        </ListItemContent>
                      </ListItem>
                    )}
                    <Divider />
                    {"setAmount" in exercise.exercise && (
                      <FormControl>
                        <FormLabel>
                          {"setAmount" in exercise.exercise && "KG"}
                        </FormLabel>
                        <Input required type="number" />
                      </FormControl>
                    )}
                  </>
                ))}
              </List>
            ))
          ) : (
            <></>
          )}
        </Sheet>
      )}
    </>
  );
};

export default CalendarDay;
