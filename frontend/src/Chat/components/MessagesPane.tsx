import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import { ChatsOverview, SingleChatHistory, UserData } from "../../types";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { MessagesPaneHeader } from "./MessagesPaneHeader";
import { ChatBubble } from "./ChatBubble";
import { MessageInput } from "./MessageInput";
import { ProfilePicture } from "./ProfilePicture";
import { useAppSelector } from "../../hooks";

type MessagesPaneProps = {
  setChatsOverview: Dispatch<SetStateAction<ChatsOverview[]>>;
  activePartner: UserData;
  chatHistory: SingleChatHistory[];
  websocket: WebSocket;
  setActivePartner: (sender: UserData) => void;
};

export const MessagesPane: FC<MessagesPaneProps> = ({
  activePartner,
  chatHistory,
  websocket,
  setChatsOverview,
  setActivePartner,
}) => {
  const userData = useAppSelector((state) => state.user.value);
  const [textAreaValue, setTextAreaValue] = useState<string>("");
  const [tempMessageId, setTempMessageId] = useState<number>(0);

  const sendMessage = () => {
    if (websocket) {
      chatHistory.push({
        content: textAreaValue,
        sender: userData.id,
        timestamp: Date.now(),
        tempId: tempMessageId,
      });

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
      <MessagesPaneHeader
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
                    partnerName={activePartner.profile_picture}
                    base64ProfilePicture={activePartner.profile_picture}
                  />
                )}
                <ChatBubble
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
