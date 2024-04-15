// Trainingstypen
export type Training = {
  name: string;
  onDays: string[];
  exercises: Exercise[];
};

export type Exercise = {
  exerciseName: string;
  exercise: ExerciseCardio | ExerciseWeighted;
};

export type ExerciseCardio = {
  minutes: number;
};

export type ExerciseWeighted = {
  repititionAmount: number;
  setAmount: number;
  weight: number;
};

export type ExerciseCalendar = Exercise & {
  done: boolean;
};

export type CalendarDayData = {
  name: string;
  day: string;
  exercises: ExerciseCalendar[];
};

// Exercises
export type ExercisesEntryData = Exercise & {
  rating: number;
};

export type ChatsOverview = {
  partner_name: string;
  partner_id: number;
  last_message: string;
  unread_messages: number;
  last_message_timestamp: string;
  profile_picture?: string;
};

export type UserData_old = {
  name: string;
  id: number;
};

export type UserData = {
  name: string;
  id: number;
  profile_picture?: string;
};

export type SingleChatHistory = {
  sender: number;
  content: string;
  timestamp: string;
};

export enum DismissDialogType {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}
