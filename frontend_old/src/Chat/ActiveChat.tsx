import { Box, IconButton, Paper, TextField } from "@mui/material";
import { useState, FC, useEffect } from "react";
import { useWebsocket } from "../Provider/WebSocketProvider";
import SendIcon from "@mui/icons-material/Send";
import { ChatSidebar } from "./ChatSidebar";
import { ChatOverview, SingleChatHistory } from "../types";
import { useAuthHeader } from "react-auth-kit";
import { getChatHistory } from "../api";
import { Message } from "./Message";
import { useSelector } from "react-redux";
import { selectUser } from "../Redux/selector";
import dayjs, { Dayjs } from "dayjs";

export const ActiveChat: FC = () => {
  //user needs to be initialized correctly
  const user = useSelector(selectUser);
  const [message, setMessage] = useState<string>("");
  const [chatOverview, setChatOverview] = useState<ChatOverview[]>([
    { partnerName: "abc", lastMessage: "lol" },
    { partnerName: "a", lastMessage: "lol" },
    { partnerName: "c", lastMessage: "losadasdasdasdsadasdadasl" },
  ]);

  const [chatHistory, setChatHistory] = useState<SingleChatHistory[]>([]);
  const websocket = useWebsocket((e) => {
    console.log(JSON.parse(e.data));
    console.log(e.data.content);
    setChatHistory([...chatHistory, JSON.parse(e.data)]);
    console.log(chatHistory);
  });

  const [currentActiveChat, setCurrentActiveChat] = useState<string>("a");
  const auth = useAuthHeader();

  useEffect(() => {
    setChatHistory([]);
    getChatHistory(auth(), currentActiveChat).then((res) => {
      setChatHistory(res.data.chat);
    });
  }, [currentActiveChat]);

  const sendMessage = () => {
    if (websocket) {
      chatHistory.push({
        content: message,
        sender: user,
        timestamp: Date.now().toString(),
      });
      websocket.send(
        JSON.stringify({ recipient: currentActiveChat, content: message })
      );
      setMessage("");
    }
  };

  return (
    <Box height="100vh" display="flex" flexDirection="row" width={"100%"}>
      <Paper
        sx={{
          width: "8rem",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {chatOverview.map(({ partnerName, lastMessage }) => {
          return (
            <ChatSidebar
              key={partnerName}
              partnerName={partnerName}
              lastMessage={lastMessage}
              setCurrentActiveChat={setCurrentActiveChat}
            />
          );
        })}
      </Paper>
      <Box display="flex" flexDirection="column" width="100%" overflow="auto">
        <Paper
          sx={{
            overflow: "auto",
            height: "100%",
          }}
        >
          {chatHistory.map((chat) => (
            <Message
              content={chat.content}
              partnerName={currentActiveChat}
              sender={chat.sender}
            />
          ))}
        </Paper>
        <Paper
          sx={{
            mt: "auto",

            flexDirection: "column",
            display: "flex",
            p: "0",
          }}
        >
          <TextField
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            multiline
            value={message}
            sx={{
              width: "100%",
              backgroundColor: "inherit",
              color: "black",
            }}
            variant="outlined"
            InputProps={{
              style: { color: "black" },
              endAdornment: (
                <IconButton onClick={sendMessage} color="secondary">
                  <SendIcon />
                </IconButton>
              ),
            }}
          />
        </Paper>
      </Box>
    </Box>
  );
};
