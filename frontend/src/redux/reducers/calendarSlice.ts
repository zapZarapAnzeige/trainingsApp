import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getCurrentYear, getISOWeekNumber, getYearCwCount } from "../../utils";
import { CalendarData } from "../../types";

export type calendarState = {
  isDataDirty: boolean;
  currentCW: number;
  calendarData: CalendarData;
  reloadCalendar: boolean;
  currentYear: number;
};

const initialState: calendarState = {
  isDataDirty: false,
  currentCW: getISOWeekNumber(new Date()),
  calendarData: { pastTrainings: [], futureTrainings: [] },
  reloadCalendar: true,
  currentYear: getCurrentYear(),
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setIsDataDirty: (state, action: PayloadAction<boolean>) => {
      state.isDataDirty = action.payload;
    },
    increaseCW: (state) => {
      if (state.currentCW === getYearCwCount(state.currentYear)) {
        state.currentYear += 1;
        state.currentCW = 1;
      } else {
        state.currentCW += 1;
      }
    },
    decreaseCW: (state) => {
      if (state.currentCW === 1) {
        state.currentYear -= 1;
        state.currentCW = getYearCwCount(state.currentYear);
      } else {
        state.currentCW -= 1;
      }
    },
    setCalendarData: (state, action: PayloadAction<CalendarData>) => {
      state.calendarData = action.payload;
    },
    resetCalendar: (state) => {
      state.isDataDirty = false;
      state.currentCW = getISOWeekNumber(new Date());
      state.calendarData = { pastTrainings: [], futureTrainings: [] };
      state.reloadCalendar = true;
      state.currentYear = getCurrentYear();
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
