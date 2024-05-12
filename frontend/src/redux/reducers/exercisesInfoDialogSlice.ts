import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ExercisesInfoDialog } from "../../types";

export type ExercisesInfoDialogState = {
  value: ExercisesInfoDialog;
};

const initialState: ExercisesInfoDialogState = {
  value: {
    exerciseName: "",
    exerciseText: "",
    video: "",
    userRating: 0,
    primaryTags: [],
    secondaryTags: [],
  },
};

const exercisesInfoDialogSlice = createSlice({
  name: "exercisesInfoDialog",
  initialState,
  reducers: {
    setExercisesInfoDialog: (
      state,
      action: PayloadAction<ExercisesInfoDialog>
    ) => {
      state.value = action.payload;
    },
    clearAll: (state) => {
      state.value = {
        exerciseName: "",
        exerciseText: "",
        userRating: 0,
        video: "",
        primaryTags: [],
        secondaryTags: [],
      };
    },
  },
});

export const { setExercisesInfoDialog, clearAll } =
  exercisesInfoDialogSlice.actions;
export default exercisesInfoDialogSlice.reducer;
