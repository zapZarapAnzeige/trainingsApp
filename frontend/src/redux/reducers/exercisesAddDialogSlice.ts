import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ExercisesAddDialog } from "../../types";
import { weekdaysAbbreviation } from "../../constants";
import { moveString } from "../../utils";

export type exercisesAddDialogState = {
  value: ExercisesAddDialog;
};

const initialState: exercisesAddDialogState = {
  value: {
    exerciseName: "",
    exercise: { minutes: 0 },
    inTraining: [],
    notInTraining: [],
  },
};

function sortAndInsertDay(days: string[], dayToAdd: string) {
  days.push(dayToAdd);

  days.sort((a: string, b: string) => {
    return weekdaysAbbreviation.indexOf(a) - weekdaysAbbreviation.indexOf(b);
  });

  return days;
}

const exercisesAddDialogSlice = createSlice({
  name: "currentPage",
  initialState,
  reducers: {
    addToTraining: (state, action: PayloadAction<string>) => {
      moveString(
        state.value?.notInTraining,
        state.value?.inTraining,
        action.payload
      );
    },
    removeFromTraining: (state, action: PayloadAction<string>) => {
      moveString(
        state.value?.inTraining,
        state.value?.notInTraining,
        action.payload
      );
    },
    setMinutes: (state, action: PayloadAction<number>) => {
      state.value.exercise = { minutes: action.payload };
    },
    setWeight: (state, action: PayloadAction<number>) => {
      state.value.exercise = {
        ...state.value.exercise,
        weight: action.payload,
      };
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
  setWeight,
  setRepetitionAmount,
  setSetAmount,
  setExercisesAddDialog,
  clearAll,
} = exercisesAddDialogSlice.actions;
export default exercisesAddDialogSlice.reducer;
