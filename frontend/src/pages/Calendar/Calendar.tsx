import {
  Box,
  Grid,
  IconButton,
  LinearProgress,
  Sheet,
  Stack,
  Typography,
  VariantProp,
} from "@mui/joy";
import Pagination from "../../Common/Pagination";
import CalendarDay from "./components/CalendarDay";
import CheckIcon from "@mui/icons-material/Check";
import HeadingArea from "../../Common/HeadingArea";
import { CalendarData, CalendarDayData } from "../../types";
import { useEffect, useState } from "react";
import {
  calculateDayGoal,
  calculateWeekGoal,
  getMondayOfWeek,
} from "../../utils";

// TESTDATEN // Benötigt wird eine KW des Typen CalendarDayData[] der Größe 7
import pastCalendar from "../../example/examplePastCalendar.json";
import futureCalendar from "../../example/exampleFutureCalendar.json";
import { useAppSelector } from "../../hooks";
import { useDispatch } from "react-redux";
import {
  setCalendarData,
  setIsDataDirty,
} from "../../redux/reducers/calendarSlice";
import { getFutureTrainings, getPastTrainings, postCalendar } from "../../api";
import { useAuthHeader } from "react-auth-kit";

export default function Calendar() {
  const auth = useAuthHeader();
  const dispatch = useDispatch();
  const isDataDirty = useAppSelector((state) => state.calendar.isDataDirty);
  const currentCW = useAppSelector((state) => state.calendar.currentCW);
  const calendarData = useAppSelector((state) => state.calendar.calendarData);

  /*useEffect(() => {
    getPastTrainings(
      auth(),
      getMondayOfWeek(currentCW, new Date().getFullYear())
    )
      .then((data: CalendarDayData[]) => {
        dispatch(
          setCalendarData({
            pastTrainings: data,
            futureTrainings: calendarData.futureTrainings,
          })
        );
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
    getFutureTrainings(
      auth(),
      getMondayOfWeek(currentCW, new Date().getFullYear())
    )
      .then((data: CalendarDayData[]) => {
        dispatch(
          setCalendarData({
            pastTrainings: calendarData.pastTrainings,
            futureTrainings: data,
          })
        );
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, [currentCW]);*/

  return (
    <>
      <HeadingArea />
      <Pagination />
      <Sheet
        variant="outlined"
        color="neutral"
        sx={{ width: "100%", height: "100%", p: 2, overflow: "auto" }}
      >
        <Grid container spacing={1} sx={{ flexGrow: 1 }}>
          {pastCalendar.map((calendarDayData: CalendarDayData) => {
            return (
              <Grid xs={12 / 7}>
                <CalendarDay
                  calendarDayData={calendarDayData}
                  completable={true}
                />
              </Grid>
            );
          })}
          {futureCalendar.map((calendarDayData: CalendarDayData) => {
            return (
              <Grid xs={12 / 7}>
                <CalendarDay
                  calendarDayData={calendarDayData}
                  completable={false}
                />
              </Grid>
            );
          })}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Stack spacing={2} width={"100%"}>
              <Sheet
                variant="outlined"
                sx={{ mb: 1, borderRadius: 5, width: "100%", p: 2 }}
              >
                {"Tagesziel: " +
                  calculateDayGoal(
                    [...pastCalendar, ...futureCalendar],
                    new Date().toISOString().split("T")[0]
                  ) +
                  "%"}
                <LinearProgress
                  color="success"
                  determinate
                  value={calculateDayGoal(
                    [...pastCalendar, ...futureCalendar],
                    new Date().toISOString().split("T")[0]
                  )}
                />
              </Sheet>
              <Sheet variant="outlined" sx={{ mb: 1, borderRadius: 5, p: 2 }}>
                {"Wochenziel: " +
                  calculateWeekGoal([...pastCalendar, ...futureCalendar]) +
                  "%"}
                <LinearProgress
                  color="success"
                  determinate
                  value={calculateWeekGoal([
                    ...pastCalendar,
                    ...futureCalendar,
                  ])}
                />
              </Sheet>
              <IconButton
                variant="solid"
                color="primary"
                disabled={!isDataDirty}
                onClick={() => {
                  dispatch(setIsDataDirty(false));
                  postCalendar(
                    auth(),
                    calendarData,
                    getMondayOfWeek(currentCW, new Date().getFullYear())
                  );
                }}
              >
                <CheckIcon />
              </IconButton>
            </Stack>
            <Sheet
              sx={{
                background: "transparent",
                pl: 4,
                borderLeft: "1px solid",
                borderColor: "divider",
              }}
            ></Sheet>
          </Box>
        </Grid>
      </Sheet>
    </>
  );
}
