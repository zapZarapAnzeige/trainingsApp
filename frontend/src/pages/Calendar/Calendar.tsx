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
  fillMissingTrainingDays,
  getMondayOfWeek,
  roundToTwoDecimalPlaces,
  splitPastFuture,
} from "../../utils";

// TESTDATEN // Benötigt wird eine KW des Typen CalendarDayData[] der Größe 7
//import pastCalendar from "../../example/examplePastCalendar.json";
//import futureCalendar from "../../example/exampleFutureCalendar.json";
import { useAppSelector } from "../../hooks";
import { useDispatch } from "react-redux";
import {
  reloadCalendar,
  setCalendarData,
  setIsDataDirty,
} from "../../redux/reducers/calendarSlice";
import { getFutureTrainings, getPastTrainings, postCalendar } from "../../api";
import { useAuthHeader } from "react-auth-kit";
import { useIntl } from "react-intl";

export default function Calendar() {
  const auth = useAuthHeader();
  const intl = useIntl();
  const dispatch = useDispatch();
  const isDataDirty = useAppSelector((state) => state.calendar.isDataDirty);
  const currentCW = useAppSelector((state) => state.calendar.currentCW);
  const calendarData = useAppSelector((state) => state.calendar.calendarData);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const token = auth();
        const weekStart = getMondayOfWeek(currentCW, new Date().getFullYear());

        const pastTrainings = await getPastTrainings(token, weekStart);

        const futureTrainings = await getFutureTrainings(token, weekStart);

        const filledTrainings = fillMissingTrainingDays([
          ...pastTrainings,
          ...futureTrainings,
        ]);

        const splitData = splitPastFuture(filledTrainings);

        dispatch(setCalendarData(splitData));
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchTrainings();
    dispatch(reloadCalendar(false));
  }, [reloadCalendar]);

  useEffect(() => {
    dispatch(reloadCalendar(true));
  }, [currentCW]);

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
          {calendarData.pastTrainings.map(
            (calendarDayData: CalendarDayData) => {
              return (
                <Grid xs={12 / 7} key={calendarDayData.date}>
                  <CalendarDay
                    calendarDayData={calendarDayData}
                    completable={true}
                  />
                </Grid>
              );
            }
          )}
          {calendarData.futureTrainings
            .slice()
            .sort(
              (t1, t2) =>
                new Date(t1.date).getTime() - new Date(t2.date).getTime()
            )
            .map((calendarDayData: CalendarDayData) => {
              return (
                <Grid xs={12 / 7} key={calendarDayData.date}>
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
                {intl.formatMessage({ id: "calendar.label.dailyGoal" }) +
                  roundToTwoDecimalPlaces(
                    calculateDayGoal(
                      [
                        ...calendarData.pastTrainings,
                        ...calendarData.futureTrainings,
                      ],
                      new Date().toISOString().split("T")[0]
                    )
                  ) +
                  "%"}
                <LinearProgress
                  color="success"
                  determinate
                  value={calculateDayGoal(
                    [
                      ...calendarData.pastTrainings,
                      ...calendarData.futureTrainings,
                    ],
                    new Date().toISOString().split("T")[0]
                  )}
                />
              </Sheet>
              <Sheet variant="outlined" sx={{ mb: 1, borderRadius: 5, p: 2 }}>
                {intl.formatMessage({ id: "calendar.label.weeklyGoal" }) +
                  roundToTwoDecimalPlaces(
                    calculateWeekGoal([
                      ...calendarData.pastTrainings,
                      ...calendarData.futureTrainings,
                    ])
                  ) +
                  "%"}
                <LinearProgress
                  color="success"
                  determinate
                  value={calculateWeekGoal([
                    ...calendarData.pastTrainings,
                    ...calendarData.futureTrainings,
                  ])}
                />
              </Sheet>
              <IconButton
                variant="solid"
                color="primary"
                disabled={!isDataDirty}
                onClick={() => {
                  dispatch(setIsDataDirty(false));
                  postCalendar(auth(), calendarData.pastTrainings);
                  dispatch(reloadCalendar(true));
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
