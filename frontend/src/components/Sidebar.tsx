import React from "react";
import useTranslation from "next-translate/useTranslation";

const Sidebar: React.FC = () => {
  const { t } = useTranslation("common");
  let user = "user";
  let email = "user@training.com";

  return (
    <div className="flex flex-col h-screen justify-between border-e border-border bg-primary w-1/5">
      <div className="px-4 py-6">
        <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
          Logo
        </span>

        <ul className="mt-6 space-y-1">
          <li>
            <a
              href={"/calendar"}
              className="block rounded-lg bg-highlight px-4 py-2 text-sm font-medium text-black mb-3"
            >
              {t("sidebar.calendar")}
            </a>
          </li>
          <li>
            <a
              href={"/trainingSchedule"}
              className="block rounded-lg bg-highlight px-4 py-2 text-sm font-medium text-black mb-3"
            >
              {t("sidebar.trainingSchedule")}
            </a>
          </li>
          <li>
            <a
              href={"/chats"}
              className="block rounded-lg bg-highlight px-4 py-2 text-sm font-medium text-black mb-3"
            >
              {t("sidebar.chats")}
            </a>
          </li>
          <li>
            <a
              href={"/exercises"}
              className="block rounded-lg bg-highlight px-4 py-2 text-sm font-medium text-black mb-3"
            >
              {t("sidebar.exercises")}
            </a>
          </li>
          <li>
            <a
              href={"/help"}
              className="block rounded-lg bg-highlight px-4 py-2 text-sm font-medium text-black mb-3"
            >
              {t("sidebar.help")}
            </a>
          </li>
          <li>
            <a
              href={"/about"}
              className="block rounded-lg bg-highlight px-4 py-2 text-sm font-medium text-black mb-3"
            >
              {t("sidebar.about")}
            </a>
          </li>
        </ul>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-border">
        <a
          href="#"
          className="flex items-center gap-2 bg-primary p-4 hover:bg-highlight"
        >
          <img
            alt=""
            src="/profile.png"
            className="size-10 rounded-full object-cover"
          />

          <div>
            <p className="text-xs">
              <strong className="block font-medium text-black">{user}</strong>

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
