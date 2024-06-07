import { Checkbox } from "@mui/joy";
import { FC } from "react";
import { useAppDispatch } from "../../../hooks";
import {
  setIsDataDirty,
  setCalendarData,
} from "../../../redux/reducers/calendarSlice";
import {
  CalendarData,
  CalendarExercise,
  CalendarTraining,
} from "../../../types";

type CalendarCheckboxProps = {
  completable: boolean;
  exercise: CalendarExercise;
  training: CalendarTraining;
  calendarData: CalendarData;
};

export const CalendarCheckbox: FC<CalendarCheckboxProps> = ({
  completable,
  exercise,
  training,
  calendarData,
}) => {
  const dispatch = useAppDispatch();
  return (
    <Checkbox
      disabled={!completable}
      color={completable ? "primary" : "neutral"}
      checked={exercise.completed}
      onClick={() => {
        if (completable) {
          dispatch(setIsDataDirty(true));
          dispatch(
            setCalendarData({
              pastTrainings: calendarData.pastTrainings.map((day) => ({
                ...day,
                trainings: day.trainings.map((t) => ({
                  ...t,
                  exercises:
                    t.trainingId === training.trainingId
                      ? t.exercises.map((ex) => ({
                          ...ex,
                          completed:
                            exercise.exerciseId === ex.exerciseId
                              ? !ex.completed
                              : ex.completed,
                        }))
                      : t.exercises,
                })),
              })),
              futureTrainings: calendarData.futureTrainings,
            })
          );
        }
      }}
    />
  );
};
