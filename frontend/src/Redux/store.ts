import {
  configureStore,
  createReducer,
  PayloadAction,
  CombinedState,
} from "@reduxjs/toolkit";
import { setUser } from "./actions";

interface AppState {
  user: string;
}

const initialState: RootState = {
  app: {
    user: "",
  },
};

const appReducer = createReducer(initialState, (builder) => {
  builder.addCase(setUser, (state, action: PayloadAction<string>) => {
    state.app.user = action.payload;
  });
});

export type RootState = CombinedState<{
  app: AppState;
}>;

const store = configureStore({
  reducer: appReducer,
});

export default store;
