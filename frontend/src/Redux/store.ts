import {
  configureStore,
  createReducer,
  PayloadAction,
  CombinedState,
} from "@reduxjs/toolkit";
import { UserData_old } from "../types";
import { setUserData } from "./actions";

interface AppState {
  userData: UserData_old;
}

const initialState: RootState = {
  app: {
    userData: { name: "", id: -1 },
  },
};

const appReducer = createReducer(initialState, (builder) => {
  builder.addCase(setUserData, (state, action: PayloadAction<UserData_old>) => {
    state.app.userData = action.payload;
  });
});

export type RootState = CombinedState<{
  app: AppState;
}>;

const store = configureStore({
  reducer: appReducer,
});

export default store;
