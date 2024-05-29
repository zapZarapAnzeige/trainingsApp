import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getISOWeekNumber } from "../../utils";
import { CalendarData } from "../../types";

export type calendarState = {
  isDataDirty: boolean;
  currentCW: number;
  calendarData: CalendarData;
  reloadCalendar: boolean;
};

const initialState: calendarState = {
  isDataDirty: false,
  currentCW: getISOWeekNumber(new Date()),
  calendarData: { pastTrainings: [], futureTrainings: [] },
  reloadCalendar: true,
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setIsDataDirty: (state, action: PayloadAction<boolean>) => {
      state.isDataDirty = action.payload;
    },
    increaseCW: (state) => {
      state.currentCW += 1;
    },
    decreaseCW: (state) => {
      state.currentCW -= 1;
    },
    setCalendarData: (state, action: PayloadAction<CalendarData>) => {
      state.calendarData = action.payload;
    },
    resetCalendar: (state) => {
      state.isDataDirty = false;
      state.currentCW = getISOWeekNumber(new Date());
      state.calendarData = { pastTrainings: [], futureTrainings: [] };
    },
    reloadCalendar: (state, action: PayloadAction<boolean>) => {
      state.reloadCalendar = action.payload;
    },
  },
});

export const {
  setIsDataDirty,
  increaseCW,
  decreaseCW,
  setCalendarData,
  resetCalendar,
  reloadCalendar,
} = calendarSlice.actions;
export default calendarSlice.reducer;
