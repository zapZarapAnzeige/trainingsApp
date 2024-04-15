import { IntlShape } from "react-intl";
import { weekdaysAbbreviation } from "./constants";

export function openSidebar() {
  if (typeof window !== "undefined") {
    document.body.style.overflow = "hidden";
    document.documentElement.style.setProperty("--SideNavigation-slideIn", "1");
  }
}

export function closeSidebar() {
  if (typeof window !== "undefined") {
    document.documentElement.style.removeProperty("--SideNavigation-slideIn");
    document.body.style.removeProperty("overflow");
  }
}

export function toggleSidebar() {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--SideNavigation-slideIn");
    if (slideIn) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
}

export function getPageName(page: string) {
  switch (page) {
    case "calendar":
      return "Mein Kalendar";
    case "trainingSchedule":
      return "Mein Trainingsplan";
    case "chats":
      return "Meine Chats";
    case "exercises":
      return "Meine Übungen";
    case "help":
      return "Hilfe";
    case "about":
      return "Über uns";
    default:
      return "";
  }
}

export function openMessagesPane() {
  if (typeof window !== "undefined") {
    document.body.style.overflow = "hidden";
    document.documentElement.style.setProperty("--MessagesPane-slideIn", "1");
  }
}

export function closeMessagesPane() {
  if (typeof window !== "undefined") {
    document.documentElement.style.removeProperty("--MessagesPane-slideIn");
    document.body.style.removeProperty("overflow");
  }
}

export function toggleMessagesPane() {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--MessagesPane-slideIn");
    if (slideIn) {
      closeMessagesPane();
    } else {
      openMessagesPane();
    }
  }
}

const THRESHOLDS = {
  minutes: 60,
  hours: 60 * 60,
  days: 60 * 60 * 24,
  months: 60 * 60 * 24 * 30,
  years: 60 * 60 * 24 * 365,
};

const getPluralMessage = (
  id: string,
  seconds: number,
  threshold: number,
  intl: IntlShape
) => {
  const count = Math.floor(seconds / threshold);
  return {
    unit: intl.formatMessage({ id: id }, { count: count }),
    count: count,
  };
};

const getUnitForTimestamp = (seconds: number, intl: IntlShape) => {
  const getMessage = (id: string, threshold: number) => {
    return getPluralMessage(id, seconds, threshold, intl);
  };
  switch (true) {
    case seconds > THRESHOLDS.years:
      return getMessage("unit.years", THRESHOLDS.years);
    case seconds > THRESHOLDS.months:
      return getMessage("unit.months", THRESHOLDS.months);
    case seconds > THRESHOLDS.days:
      return getMessage("unit.days", THRESHOLDS.days);
    case seconds > THRESHOLDS.hours:
      return getMessage("unit.hours", THRESHOLDS.hours);
    case seconds > THRESHOLDS.minutes:
      return getMessage("unit.minutes", THRESHOLDS.minutes);

    default:
      return getMessage("unit.seconds", 1);
  }
};

export const formatTimestamp = (date: string, intl: IntlShape) => {
  const seconds = Math.floor(Math.abs(Date.now() - Date.parse(date)) / 1000);
  return intl.formatMessage(
    { id: "chat.timestamp" },
    getUnitForTimestamp(seconds, intl)
  );
};

export function mapNumberToWeekdayString(index: number) {
  return weekdaysAbbreviation[index];
}
