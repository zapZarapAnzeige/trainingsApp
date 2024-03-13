import { getCurrentCW } from "@/utils/utils";
import React from "react";

type WeekSelectorProps = {
  cw: string;
};

const WeekSelector: React.FC<WeekSelectorProps> = ({ cw }) => {
  const currentCw = getCurrentCW();
  return (
    <div className="inline-flex justify-start gap-1">
      <label className="my-auto mr-2 text-gray-700">KW:</label>
      <a
        href={"/calendar/" + (parseInt(cw) - 1).toString}
        className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </a>

      <div>
        <input
          disabled
          type="number"
          className="h-8 w-12 rounded border border-gray-100 bg-white p-0 text-center text-xs font-medium text-gray-900 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          min="1"
          value={cw}
          id="PaginationPage"
        />
      </div>

      {cw !== currentCw && (
        <a
          href={"/calendar/" + (parseInt(cw) + 1).toString}
          className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      )}
    </div>
  );
};

export default WeekSelector;
