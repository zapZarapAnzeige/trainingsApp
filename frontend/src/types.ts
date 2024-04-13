export type CalendarDayData = {
  name: string;
  date: string;
  trainingData: CalendarDayTrainingData[] | null;
};

export type CalendarDayTrainingData = {
  exercise: string;
  repititionAmount: number;
  setAmount: number;
  weight: number;
  done: boolean;
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
