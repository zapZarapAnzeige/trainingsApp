import React from "react";

const TrainingCheckbox: React.FC = () => {
  return (
    <div className="space-y-2">
      <div>
        <strong className="my-auto font-medium text-gray-900">Training:</strong>
      </div>
      <label
        htmlFor="Option1"
        className="flex cursor-pointer items-start gap-4 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50"
      >
        <div className="flex items-center">
          &#8203;
          <input
            type="checkbox"
            className="size-4 rounded border-gray-300"
            id="Option1"
          />
        </div>
      </label>
    </div>
  );
};

export default TrainingCheckbox;
