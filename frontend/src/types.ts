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
  repetitionAmount: number;
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

export type Help = {
  title: string;
  text: string;
};

export type ChatsOverview = {
  partner_name: string;
  partner_id: number;
  last_message: string;
  unread_messages: number;
  last_message_timestamp: string | number;
  disabled: boolean;
  profile_picture?: string;
  last_sender_id: number;
};

export type SmallChatOverview = {
  partner_name: string;
  partner_id: number;
  profile_picture?: string;
};

export type UserData = {
  name: string;
  id: number;
  searchingForPartner: boolean;
  plz?: string;
  profilePicture?: string;
};

export type PartnerData = {
  name: string;
  id: number;
  profile_picture?: string;
  disabled: boolean;
  lastMessageSenderId: number;
};

export type SingleChatHistory = {
  sender: number;
  content: string;
  timestamp: string | number;
  tempId?: number;
};

export type WSError = {
  error: boolean;
  error_message?: string;
  message: Message;
};
type Message = {
  recipient_id: number;
  content: string;
  id: number;
};

export enum DismissDialogType {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}
