import { RootState } from "./store";

export const selectUserData = (state: RootState) => state.app.userData;
