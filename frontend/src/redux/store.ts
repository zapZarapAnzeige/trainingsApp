import { configureStore } from "@reduxjs/toolkit";
import currentPageSlice from "./reducers/currentPageSlice";
import userSlice from "./reducers/userSlice";
import trainingScheduleDialogSlice from "./reducers/trainingScheduleDialogSlice";
import tagsSlice from "./reducers/tagsSlice";
import exercisesAddDialogSlice from "./reducers/exercisesAddDialogSlice";
import exercisesInfoDialogSlice from "./reducers/exercisesInfoDialogSlice";
import calendarSlice from "./reducers/calendarSlice";

export const store = configureStore({
  reducer: {
    currentPage: currentPageSlice,
    user: userSlice,
    calendar: calendarSlice,
    trainingScheduleDialog: trainingScheduleDialogSlice,
    tags: tagsSlice,
    exercisesAddDialog: exercisesAddDialogSlice,
    exercisesInfoDialog: exercisesInfoDialogSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
