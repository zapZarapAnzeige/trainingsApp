import React from "react";

type WeekColumnProps = {
  day: string;
  date: string;
  hasTraining: boolean;
  didTrain: boolean;
  lastColumn: boolean;
};

const WeekColumn: React.FC<WeekColumnProps> = ({
  day,
  date,
  hasTraining,
  didTrain,
  lastColumn,
}) => {
  return (
    <div
      className={`flex-1 flex flex-col items-center justify-center ${
        lastColumn && "border-r divide-r"
      } `}
    >
      <div className="flex-shrink-0 h-32 rounded-lg bg-gray-200 p-2 text-gray-900">
        <p>{day}</p>
        <p>{date}</p>
        {hasTraining && (
          <div
            className={`h-16 rounded-lg flex justify-between items-center text ${
              didTrain ? "bg-green-200" : "bg-red-200"
            } p-2 text-gray-700`}
          >
            <div className="flex items-center">
              <strong>Training:</strong>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="size-4 rounded border-gray-300"
                checked={didTrain}
                disabled
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeekColumn;
