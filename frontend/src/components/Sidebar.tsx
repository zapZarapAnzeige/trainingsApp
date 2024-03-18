"use client";

import React from "react";
import { sidebarUrls } from "@/config/sidebarUrls";
import useTranslation from "next-translate/useTranslation";

const Sidebar: React.FC = () => {
  const { t } = useTranslation("common");
  let user = "Daniel Jaufmann";
  let email = "daniel@training.com";

  return (
    <div className="flex flex-col h-screen justify-between border-e bg-primary w-1/5">
      <div className="px-4 py-6">
        <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
          Logo
        </span>

        <ul className="mt-6 space-y-1">
          {sidebarUrls.map((url, index) => {
            return (
              <li>
                <a
                  href={url}
                  className="block rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-black mb-3"
                >
                  {t("lol")}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
        <a
          href="#"
          className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50"
        >
          <img
            alt=""
            src="/profile.png"
            className="size-10 rounded-full object-cover"
          />

          <div>
            <p className="text-xs">
              <strong className="block font-medium text-white">{user}</strong>

              <span className="text-gray-700"> {email} </span>
            </p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 ml-auto text-gray-500 hover:text-red-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
