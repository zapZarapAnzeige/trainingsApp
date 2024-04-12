import { Box, IconButton, Paper, TextField } from "@mui/material";
import { useState, FC, useEffect } from "react";
import { useWebsocket } from "../Provider/WebSocketProvider";
import SendIcon from "@mui/icons-material/Send";
import { ChatSidebar } from "./ChatSidebar";
import { ChatsOverview, UserData, SingleChatHistory } from "../types";
import { useAuthHeader } from "react-auth-kit";
import { getChatHistory, getChatsOverview } from "../api";
import { Message } from "./Message";
import { useSelector } from "react-redux";
import { selectUserData } from "../Redux/selector";

export const ActiveChat: FC = () => {
  const userData = useSelector(selectUserData);
  const [message, setMessage] = useState<string>("");
  const [chatsOverview, setChatsOverview] = useState<ChatsOverview[]>([]);

  const [chatHistory, setChatHistory] = useState<SingleChatHistory[]>([]);
  const [currentActiveChat, setCurrentActiveChat] = useState<UserData>({
    id: -1,
    name: "",
  });
  const auth = useAuthHeader();

  useEffect(() => {
    getChatsOverview(auth()).then((data) => {
      setChatsOverview(data.data.chat_data);
    });
  }, []);

  const websocket = useWebsocket((e) => {
    console.log("here");
    const data: SingleChatHistory = JSON.parse(e.data);
    if (currentActiveChat.id === data.sender) {
      setChatHistory([...chatHistory, data]);
    }
    setChatsOverview(
      chatsOverview.map((overview) => {
        if (overview.partner_id === data.sender) {
          return {
            ...overview,
            last_message_timestamp: data.timestamp,
            last_message: data.content,
          };
        } else {
          return overview;
        }
      })
    );
  });

  useEffect(() => {
    setChatHistory([]);
    if (currentActiveChat.name !== "" && currentActiveChat.id > 0) {
      getChatHistory(auth(), currentActiveChat.id).then((res) => {
        setChatHistory(res.data.chat);
      });
    }
  }, [currentActiveChat]);

  const sendMessage = () => {
    if (websocket) {
      chatHistory.push({
        content: message,
        sender: userData.id,
        timestamp: Date.now().toString(),
      });
      websocket.send(
        JSON.stringify({
          recipient_id: currentActiveChat.id,
          content: message,
        })
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
        {chatsOverview.map((overview) => {
          return (
            <ChatSidebar
              overview={overview}
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
          {chatHistory.map((chat, i) => (
            <Message
              key={i}
              content={chat.content}
              partnerId={currentActiveChat.id}
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