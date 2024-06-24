import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserData } from "../../types";

export type userState = {
  value: UserData;
};

const initialState: userState = {
  value: { id: -1, name: "", searchingForPartner: false },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    changeUser: (state, action: PayloadAction<UserData>) => {
      state.value = action.payload;
    },
  },
});

export const { changeUser } = userSlice.actions;
export default userSlice.reducer;
