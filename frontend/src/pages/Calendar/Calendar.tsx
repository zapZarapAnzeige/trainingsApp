import { Box, Grid, Sheet } from "@mui/joy";
import Pagination from "../../Common/Pagination";
import { weekdays } from "../../constants";
import CalendarDay from "./components/CalendarDay";
import HeadingArea from "../../Common/HeadingArea";

// TESTDATEN // Benötigt wird eine KW des Typen CalendarDayData[] der Größe 7
import pastCalendar from "../../example/examplePastCalendar.json";
import futureCalendar from "../../example/exampleFutureCalendar.json";
import { CalendarData, CalendarDayData } from "../../types";

export default function Calendar() {
  return (
    <>
      <HeadingArea />
      <Pagination />
      <Sheet
        variant="outlined"
        color="neutral"
        sx={{ width: "100%", height: "100%", p: 2 }}
      >
        <Grid container spacing={1} sx={{ flexGrow: 1 }}>
          {pastCalendar.map((calendarDayData: CalendarDayData) => {
            return (
              <Grid xs={12 / 7}>
                <CalendarDay calendarDayData={calendarDayData} />
              </Grid>
            );
          })}
          {futureCalendar.map((calendarDayData: CalendarDayData) => {
            return (
              <Grid xs={12 / 7}>
                <CalendarDay calendarDayData={calendarDayData} />
              </Grid>
            );
          })}
        </Grid>
      </Sheet>
    </>
  );
}
