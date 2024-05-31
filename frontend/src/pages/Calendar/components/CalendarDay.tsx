import {
  Box,
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
import { CalendarDayData, isExerciseWeighted } from "../../../types";
import { getWeekday } from "../../../utils";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  setCalendarData,
  setIsDataDirty,
} from "../../../redux/reducers/calendarSlice";
import { changePage } from "../../../redux/reducers/currentPageSlice";
import { setQuickInfo } from "../../../redux/reducers/exercisesInfoDialogSlice";
import { CalendarCheckbox } from "./CalendarCheckbox";
import { useIntl } from "react-intl";

type CalendarDayProps = {
  calendarDayData: CalendarDayData;
  completable: boolean;
};

const CalendarDay: FC<CalendarDayProps> = ({
  calendarDayData,
  completable,
}) => {
  const dispatch = useAppDispatch();
  const calendarData = useAppSelector((state) => state.calendar.calendarData);
  const intl = useIntl();

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
              <>
                <Typography fontWeight={"bold"}>
                  {training.trainingName}
                </Typography>
                <Divider />
                <List
                  sx={{ display: "flex", flexDirection: "column" }}
                  key={training.trainingId}
                >
                  {training.exercises.map((exercise) => (
                    <Box key={exercise.exerciseId}>
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
                      {!isExerciseWeighted(exercise.exercise) ? (
                        <ListItem sx={{ flexGrow: 6 }}>
                          <ListItemContent>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Typography>
                                {intl.formatMessage(
                                  { id: "calendar.label.min" },
                                  { min: exercise.exercise.minutes }
                                )}
                              </Typography>
                              <CalendarCheckbox
                                completable={completable}
                                calendarData={calendarData}
                                exercise={exercise}
                                training={training}
                              />
                            </Stack>
                          </ListItemContent>
                        </ListItem>
                      ) : (
                        <ListItem sx={{ flexGrow: 6 }}>
                          <ListItemContent>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Typography>
                                {exercise.exercise.setAmount} x{" "}
                                {intl.formatMessage(
                                  { id: "calendar.label.rep" },
                                  { rep: exercise.exercise.repetitionAmount }
                                )}
                              </Typography>
                              <CalendarCheckbox
                                completable={completable}
                                calendarData={calendarData}
                                exercise={exercise}
                                training={training}
                              />
                            </Stack>
                          </ListItemContent>
                        </ListItem>
                      )}
                      {isExerciseWeighted(exercise.exercise) && (
                        <FormControl>
                          <Input
                            required
                            type="number"
                            placeholder="KG"
                            value={exercise.exercise.weight}
                            onChange={(e) => {
                              dispatch(setIsDataDirty(true));
                              dispatch(
                                setCalendarData({
                                  pastTrainings: calendarData.pastTrainings.map(
                                    (day) => ({
                                      ...day,
                                      trainings: day.trainings.map((t) => ({
                                        ...t,
                                        exercises:
                                          t.trainingId === training.trainingId
                                            ? t.exercises.map((ex) => ({
                                                ...ex,
                                                exercise:
                                                  exercise.exerciseId ===
                                                    ex.exerciseId &&
                                                  isExerciseWeighted(
                                                    ex.exercise
                                                  )
                                                    ? {
                                                        ...ex.exercise,
                                                        weight: parseInt(
                                                          e.target.value
                                                        ),
                                                      }
                                                    : ex.exercise,
                                              }))
                                            : t.exercises,
                                      })),
                                    })
                                  ),
                                  futureTrainings: calendarData.futureTrainings,
                                })
                              );
                            }}
                          />
                        </FormControl>
                      )}
                    </Box>
                  ))}
                </List>
              </>
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
