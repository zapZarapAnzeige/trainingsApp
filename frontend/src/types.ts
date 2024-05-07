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
export type ExercisesEntryData = Exercise &
  Tags & {
    rating: number;
    reviews: number;
  };

type Tags = {
  primaryTags: string[];
  secondaryTags: string[];
};

export type ExercisesAddDialog = Exercise & {
  inTraining: string[];
  notInTraining: string[];
};

export type ExercisesInfoDialog = Tags & {
  exerciseName: string;
  exerciseText: string;
  video: string;
};

export type Help = {
  title: string;
  text: string;
};

export type ChatsOverview = {
  partnerName: string;
  partnerId: number;
  lastMessage: string;
  unreadMessages: number;
  lastMessageTimestamp: string | number;
  disabled: boolean;
  profilePicture?: string;
  lastSenderId: number;
  bio?: string;
  nickname?: string;
};

type BaseUserData = {
  name: string;
  id: number;
  profilePicture?: string;
  nickname?: string;
  bio?: string;
};

export type UserData = BaseUserData & {
  searchingForPartner: boolean;
  plz?: string;
};

export type PartnerData = BaseUserData & {
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

export const isSingleChatHistory = (
  value: SingleChatHistory | WSError
): value is SingleChatHistory => {
  return "content" in value && "sender" in value && "timestamp" in value;
};

export const isWSError = (
  value: SingleChatHistory | WSError
): value is WSError => {
  return "error" in value && "message" in value;
};
