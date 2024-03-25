export type ChatOverview = {
  partner_name: string;
  partner_id: number;
  last_message: string;
  unread_messages: number;
  last_message_timestamp: string;
  profile_picture?: string;
};
export type UserData = {
  name: string;
  id: number;
};
export type SingleChatHistory = {
  sender: number;
  content: string;
  timestamp: string;
};
