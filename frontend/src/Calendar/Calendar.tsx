import { Box, Grid, Sheet } from "@mui/joy";
import Pagination from "../Common/Pagination";
import { weekdays } from "../constants";
import CalendarDay from "./components/CalendarDay";

// TESTDATEN // Benötigt wird eine KW des Typen CalendarDayData[] der Größe 7
import testCalendar from "../example/week.json";
import HeadingArea from "../Common/HeadingArea";

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
          {weekdays.map((dayName, index) => {
            return (
              <Grid xs={12 / 7}>
                <CalendarDay
                  dayName={dayName}
                  calendarDayData={testCalendar[index]}
                />
              </Grid>
            );
          })}
        </Grid>
      </Sheet>
    </>
  );
}
