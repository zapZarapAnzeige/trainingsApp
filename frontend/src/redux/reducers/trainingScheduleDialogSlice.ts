import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Exercise, Training } from "../../types";
import { sortAndInsertDay } from "../../utils";

export type TrainingScheduleDialogState = {
  value: Training;
};

const initialState: TrainingScheduleDialogState = {
  value: { name: "", onDays: [], exercises: [] },
};

const trainingScheduleDialogSlice = createSlice({
  name: "trainingScheduleDialog",
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
    setTraining: (state, action: PayloadAction<Training>) => {
      state.value = action.payload;
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
  setTraining,
  clearAll,
} = trainingScheduleDialogSlice.actions;
export default trainingScheduleDialogSlice.reducer;
