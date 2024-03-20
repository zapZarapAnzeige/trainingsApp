import React from "react";
import WeekColumn from "./WeekColumn";
import useTranslation from "next-translate/useTranslation";

const weekData: CalendarDayData[] = require("../exampleData/calendar.json");

type WeekColumnsProps = {
  cw: string;
};

const WeekColumns: React.FC<WeekColumnsProps> = ({ cw }) => {
  // TODO Aufruf an die Datenbank um Wochenkalenderdaten basierend auf CW zu bekommen
  const { t } = useTranslation("common");
  const weekdays = t("weekdays", { returnObjects: true });
  console.log(weekdays);
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
