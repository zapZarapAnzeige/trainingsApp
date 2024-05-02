import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Exercise, Training } from "../../types";
import { weekdaysAbbreviation } from "../../constants";

export type trainingScheduleDialogState = {
  value: Training;
};

const initialState: trainingScheduleDialogState = {
  value: { name: "", onDays: [], exercises: [] },
};

function sortAndInsertDay(days: string[], dayToAdd: string) {
  days.push(dayToAdd);

  days.sort((a: string, b: string) => {
    return weekdaysAbbreviation.indexOf(a) - weekdaysAbbreviation.indexOf(b);
  });

  return days;
}

const trainingScheduleDialogSlice = createSlice({
  name: "currentPage",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.value.name = action.payload;
    },
    addDay: (state, action: PayloadAction<string>) => {
      state.value.onDays = sortAndInsertDay(state.value.onDays, action.payload);
    },
    removeDay: (state, action: PayloadAction<string>) => {
      state.value.onDays = state.value.onDays.filter(
        (day) => day !== action.payload
      );
    },
    addExercise: (state, action: PayloadAction<Exercise>) => {
      state.value.exercises.push(action.payload);
    },
    removeExercise: (state, action: PayloadAction<string>) => {
      state.value.exercises = state.value.exercises.filter(
        (exercise) => exercise.exerciseName !== action.payload
      );
    },
    clearAll: (state) => {
      state.value = { name: "", onDays: [], exercises: [] };
    },
  },
});

export const {
  setName,
  addDay,
  removeDay,
  addExercise,
  removeExercise,
  clearAll,
} = trainingScheduleDialogSlice.actions;
export default trainingScheduleDialogSlice.reducer;
