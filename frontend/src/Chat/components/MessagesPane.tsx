import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import { SingleChatHistory, UserData, UserData_old } from "../../types";
import { FC, useState } from "react";
import { MessagesPaneHeader } from "./MessagesPaneHeader";
import { ChatBubble } from "./ChatBubble";
import { MessageInput } from "./MessageInput";
import { useSelector } from "react-redux";
import { ProfilePicture } from "./ProfilePicture";

type MessagesPaneProps = {
  activePartner: UserData;
  chatHistory: SingleChatHistory[];
  setChatHistory: (chatHistory: SingleChatHistory[]) => void;
  websocket: WebSocket;
};

export const MessagesPane: FC<MessagesPaneProps> = ({
  activePartner,
  chatHistory,
  setChatHistory,
  websocket,
}) => {
  const [textAreaValue, setTextAreaValue] = useState<string>("");
  //const userData = useSelector(selectUserData);

  const userData: UserData_old = { id: 1, name: "temp" };

  const sendMessage = () => {
    if (websocket) {
      chatHistory.push({
        content: textAreaValue,
        sender: userData.id,
        timestamp: Date.now().toString(),
      });
      websocket.send(
        JSON.stringify({
          recipient_id: activePartner.id,
          content: textAreaValue,
        })
      );
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
      <MessagesPaneHeader sender={activePartner} />
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
