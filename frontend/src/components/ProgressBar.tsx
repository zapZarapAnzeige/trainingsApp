import React from "react";

type ProgressBarProps = {
  progress: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="mt-4">
      <span
        role="progressbar"
        aria-labelledby="ProgressLabel"
        aria-valuenow={progress}
        className="relative block rounded-full bg-gray-200"
      >
        <span className="absolute inset-0 flex items-center justify-center text-[10px]/4">
          <span className="font-bold text-white"> {progress + "%"} </span>
        </span>

        <span className="block h-4 w-9/10 rounded-full bg-indigo-600 text-center"></span>
      </span>
    </div>
  );
};

export default ProgressBar;
