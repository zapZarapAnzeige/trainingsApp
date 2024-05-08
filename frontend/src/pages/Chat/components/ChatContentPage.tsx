import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import { ChatsOverview, SingleChatHistory, PartnerData } from "../../../types";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { ChatContentPageHeader } from "./ChatContentPageHeader";
import { ChatMessage } from "./ChatMessage";
import { MessageInput } from "./MessageInput";
import { ProfilePicture } from "../../../Common/ProfilePicture";
import { useAppSelector } from "../../../hooks";

type ChatContentPageProps = {
  setChatsOverview: Dispatch<SetStateAction<ChatsOverview[]>>;
  activePartner: PartnerData;
  chatHistory: SingleChatHistory[];
  websocket: WebSocket;
  setActivePartner: (sender: PartnerData) => void;
  setViewProfile: (viewProfile: boolean) => void;
  setNewLastMessage: (message: SingleChatHistory) => void;
};

export const ChatContentPage: FC<ChatContentPageProps> = ({
  activePartner,
  chatHistory,
  websocket,
  setChatsOverview,
  setActivePartner,
  setViewProfile,
  setNewLastMessage,
}) => {
  const userData = useAppSelector((state) => state.user.value);
  const [textAreaValue, setTextAreaValue] = useState<string>("");
  const [tempMessageId, setTempMessageId] = useState<number>(0);

  const sendMessage = () => {
    if (websocket) {
      const newMessage = {
        content: textAreaValue,
        sender: userData.id,
        timestamp: Date.now(),
        tempId: tempMessageId,
      };
      chatHistory.push(newMessage);
      setNewLastMessage({ ...newMessage, sender: activePartner.id });

      websocket.send(
        JSON.stringify({
          recipient_id: activePartner.id,
          content: textAreaValue,
          id: tempMessageId,
        })
      );
      setTempMessageId(tempMessageId + 1);
      setTextAreaValue("");
    }
  };

  return (
    <Sheet
      sx={{
        height: { xs: "calc(100dvh - var(--Header-height))", lg: "100dvh" },
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.level1",
      }}
    >
      <ChatContentPageHeader
        setViewProfile={setViewProfile}
        setSender={setActivePartner}
        sender={activePartner}
        setChatsOverview={setChatsOverview}
      />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: "scroll",
          flexDirection: "column-reverse",
        }}
      >
        <Stack spacing={2} justifyContent="flex-end">
          {chatHistory.map((message: SingleChatHistory, index: number) => {
            return (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                flexDirection={
                  message.sender !== activePartner.id ? "row-reverse" : "row"
                }
              >
                {message.sender === activePartner.id && (
                  <ProfilePicture
                    partnerName={activePartner.profilePicture}
                    base64ProfilePicture={activePartner.profilePicture}
                  />
                )}
                <ChatMessage
                  activePartner={activePartner}
                  userData={userData}
                  messageSentByUser={message.sender !== activePartner.id}
                  {...message}
                />
              </Stack>
            );
          })}
        </Stack>
      </Box>
      <MessageInput
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
        onSubmit={sendMessage}
      />
    </Sheet>
  );
};
