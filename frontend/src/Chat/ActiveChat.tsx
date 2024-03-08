import { Box, createTheme, IconButton, Paper, TextField } from "@mui/material";
import { useState, FC } from "react";
import { useWebsocket } from "../Provider/WebSocketProvider";
import SendIcon from "@mui/icons-material/Send";
export const ActiveChat: FC = () => {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const websocket = useWebsocket();
  const [currentActiveChat, setCurrentActiveChat] = useState<string>("a");

  const sendMessage = () => {
    if (websocket) {
      websocket.send(
        JSON.stringify({ recipient: currentActiveChat, content: message })
      );
    }
  };
  const theme = createTheme();

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Paper
        sx={{ flexGrow: 1, bgcolor: theme.palette.grey[50], p: "0.5rem" }}
      ></Paper>
      <Paper
        sx={{
          overflowY: "auto",
          mt: "auto",
          bgcolor: theme.palette.grey[50],
          flexDirection: "column",
          display: "flex",
          p: "0.5rem",
        }}
      >
        <TextField
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          sx={{
            width: "100%",
            backgroundColor: theme.palette.grey[300],
            marginTop: "auto",
          }}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <IconButton onClick={sendMessage} color="secondary">
                <SendIcon />
              </IconButton>
            ),
          }}
        ></TextField>
      </Paper>
    </Box>
  );
};
