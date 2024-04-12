import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type currentPageState = {
  value: string;
};

const initialState: currentPageState = {
  value: "calendar",
};

const currentPageSlice = createSlice({
  name: "currentPage",
  initialState,
  reducers: {
    changePage: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { changePage } = currentPageSlice.actions;
export default currentPageSlice.reducer;
