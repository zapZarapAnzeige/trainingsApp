import React from "react";
import WeekColumn from "./WeekColumn";

const weekData: CalendarDayData[] = require("../exampleData/calendar.json");

type WeekColumnsProps = {
  cw: string;
};

const WeekColumns: React.FC<WeekColumnsProps> = ({ cw }) => {
  // TODO Aufruf an die Datenbank um Wochenkalenderdaten basierend auf CW zu bekommen
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 lg:gap-8 mt-4">
      {weekData.map((day: CalendarDayData) => {
        return (
          <WeekColumn
            day={day.day}
            date={day.date}
            hasTraining={day.hasTraining}
            didTrain={day.didTrain}
          />
        );
      })}
    </div>
  );
};

export default WeekColumns;
