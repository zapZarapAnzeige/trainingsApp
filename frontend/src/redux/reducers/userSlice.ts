import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserData_old } from "../../types";

export type userState = {
  value: UserData_old;
};

const initialState: userState = {
  value: { id: -1, name: "" },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    changeUser: (state, action: PayloadAction<UserData_old>) => {
      state.value = action.payload;
    },
  },
});

export const { changeUser } = userSlice.actions;
export default userSlice.reducer;
