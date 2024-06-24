import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ExercisesInfoDialog } from "../../types";

export type ExercisesInfoDialogState = {
  value: ExercisesInfoDialog;
  quickInfo: string;
};

const initialState: ExercisesInfoDialogState = {
  value: {
    exerciseName: "",
    exerciseText: "",
    userRating: 0,
    primaryTags: [],
    secondaryTags: [],
  },
  quickInfo: "",
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
    setQuickInfo: (state, action: PayloadAction<string>) => {
      state.quickInfo = action.payload;
    },
    clearAll: (state) => {
      state.value = {
        exerciseName: "",
        exerciseText: "",
        userRating: 0,
        primaryTags: [],
        secondaryTags: [],
      };
    },
  },
});

export const { setExercisesInfoDialog, setQuickInfo, clearAll } =
  exercisesInfoDialogSlice.actions;
export default exercisesInfoDialogSlice.reducer;
