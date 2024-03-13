import { format, getDay, getISOWeek } from "date-fns";

export function getCurrentCW() {
  return getISOWeek(new Date()).toString();
}

export function getDayOfWeekName(day: Date) {
  return getDay(day).toString();
}
