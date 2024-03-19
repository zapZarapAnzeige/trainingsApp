import React from "react";
import WeekColumn from "./WeekColumn";

const weekData: CalendarDayData[] = require("../exampleData/calendar.json");

type WeekColumnsProps = {
  cw: string;
};

const WeekColumns: React.FC<WeekColumnsProps> = ({ cw }) => {
  // TODO Aufruf an die Datenbank um Wochenkalenderdaten basierend auf CW zu bekommen
  return (
    <div className="flex">
      {weekData.map((day: CalendarDayData, index, array) => {
        return (
          <WeekColumn
            day={day.day}
            date={day.date}
            hasTraining={day.hasTraining}
            didTrain={day.didTrain}
            lastColumn={index !== array.length - 1}
          />
        );
      })}
    </div>
  );
};

export default WeekColumns;
