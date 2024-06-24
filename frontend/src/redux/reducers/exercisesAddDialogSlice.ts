import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ExercisesAddDialog, InTraining } from "../../types";
import { moveString } from "../../utils";

export type ExercisesAddDialogState = {
  value: ExercisesAddDialog;
};

const initialState: ExercisesAddDialogState = {
  value: {
    exerciseName: "",
    exerciseId: 0,
    exerciseType: "Min",
    exercise: { minutes: 0 },
    inTraining: [],
    notInTraining: [],
  },
};

const exercisesAddDialogSlice = createSlice({
  name: "exercisesAddDialog",
  initialState,
  reducers: {
    addToTraining: (state, action: PayloadAction<number>) => {
      moveString(
        state.value?.notInTraining,
        state.value?.inTraining,
        action.payload
      );
    },
    removeFromTraining: (state, action: PayloadAction<number>) => {
      moveString(
        state.value?.inTraining,
        state.value?.notInTraining,
        action.payload
      );
    },
    setMinutes: (state, action: PayloadAction<number>) => {
      state.value.exercise = { minutes: action.payload };
    },
    setRepetitionAmount: (state, action: PayloadAction<number>) => {
      state.value.exercise = {
        ...state.value.exercise,
        repetitionAmount: action.payload,
      };
    },
    setSetAmount: (state, action: PayloadAction<number>) => {
      state.value.exercise = {
        ...state.value.exercise,
        setAmount: action.payload,
      };
    },
    setExercisesAddDialog: (
      state,
      action: PayloadAction<ExercisesAddDialog>
    ) => {
      state.value = action.payload;
    },
    clearAll: (state) => {
      state.value = {
        exerciseName: "",
        exerciseId: 0,
        exerciseType: "Min",
        exercise: { minutes: 0 },
        inTraining: [],
        notInTraining: [],
      };
    },
  },
});

export const {
  addToTraining,
  removeFromTraining,
  setMinutes,
  setRepetitionAmount,
  setSetAmount,
  setExercisesAddDialog,
  clearAll,
} = exercisesAddDialogSlice.actions;
export default exercisesAddDialogSlice.reducer;
