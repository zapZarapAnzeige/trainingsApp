import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type tagsState = {
  value: string[];
};

const initialState: tagsState = {
  value: [],
};

const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    addTag: (state, action: PayloadAction<string>) => {
      state.value.push(action.payload);
    },
    removeTag: (state, action: PayloadAction<string>) => {
      state.value = state.value.filter((tag) => tag !== action.payload);
    },
  },
});

export const { addTag, removeTag } = tagsSlice.actions;
export default tagsSlice.reducer;
