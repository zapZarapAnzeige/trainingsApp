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

//
//
//
export type UserProps = {
  name: string;
  username: string;
  avatar: string;
  online: boolean;
};

export type MessageProps = {
  id: string;
  content: string;
  timestamp: string;
  unread?: boolean;
  sender: UserProps | "You";
};

export type ChatProps = {
  id: string;
  sender: UserProps;
  messages: MessageProps[];
};
