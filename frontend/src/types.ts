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
  last_message_timestamp: string | number;
  disabled: boolean;
  profile_picture?: string;
  last_sender_id: number;
};

export type UserData_old = {
  name: string;
  id: number;
};

export type UserData = {
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
