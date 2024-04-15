import { configureStore } from "@reduxjs/toolkit";
import currentPageSlice from "./reducers/currentPageSlice";
import userSlice from "./reducers/userSlice";
import trainingScheduleDialogSlice from "./reducers/trainingScheduleSlice";

export const store = configureStore({
  reducer: {
    currentPage: currentPageSlice,
    user: userSlice,
    trainingScheduleDialog: trainingScheduleDialogSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
