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
    primaryTags: [],
    secondaryTags: [],
  },
};

const exercisesInfoDialogSlice = createSlice({
  name: "exercisesInfoDialog",
  initialState,
  reducers: {
    setexercisesInfoDialog: (
      state,
      action: PayloadAction<ExercisesInfoDialog>
    ) => {
      state.value = action.payload;
    },
    clearAll: (state) => {
      state.value = {
        exerciseName: "",
        exerciseText: "",
        video: "",
        primaryTags: [],
        secondaryTags: [],
      };
    },
  },
});

export const { setexercisesInfoDialog, clearAll } =
  exercisesInfoDialogSlice.actions;
export default exercisesInfoDialogSlice.reducer;
