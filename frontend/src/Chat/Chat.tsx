import Sheet from "@mui/joy/Sheet";
import { ChatsOverview, SingleChatHistory, UserData } from "../types";
import { FC, useEffect, useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import { getChatHistory, getChatsOverview } from "../api";
import { ChatsPane } from "./ChatsPane";
import { MessagesPane } from "./MessagesPane";
import { useWebsocket } from "../Provider/WebSocketProvider";

export const Chat: FC = () => {
  const [chatsOverview, setChatsOverview] = useState<ChatsOverview[]>([]);
  const [chatHistory, setChatHistory] = useState<SingleChatHistory[]>([]);
  const [activePartner, setActivePartner] = useState<UserData>({
    id: -1,
    name: "",
  });

  useEffect(() => {
    setChatHistory([]);
    if (activePartner.name !== "" && activePartner.id > 0) {
      getChatHistory(auth(), activePartner.id).then((res) => {
        setChatHistory(res.data.chat);
      });
    }
  }, [activePartner]);

  const websocket = useWebsocket((e) => {
    const data: SingleChatHistory = JSON.parse(e.data);
    if (activePartner.id === data.sender) {
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

  const auth = useAuthHeader();

  useEffect(() => {
    getChatsOverview(auth()).then((data) => {
      setChatsOverview(data.data.chat_data);
    });
  }, []);
  return (
    <Sheet
      sx={{
        flex: 1,
        width: "100%",
        mx: "auto",
        pt: { xs: "var(--Header-height)", sm: 0 },
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "minmax(min-content, min(30%, 400px)) 1fr",
        },
      }}
    >
      <Sheet
        sx={{
          position: { xs: "fixed", sm: "sticky" },
          transform: {
            xs: "translateX(calc(100% * (var(--MessagesPane-slideIn, 0) - 1)))",
            sm: "none",
          },
          transition: "transform 0.4s, width 0.4s",
          zIndex: 100,
          width: "100%",
          top: 52,
        }}
      >
        <ChatsPane
          activePartner={activePartner}
          chatsOverview={chatsOverview}
          setActivePartner={setActivePartner}
        />
      </Sheet>
      <MessagesPane
        activePartner={activePartner}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
        websocket={websocket}
      />
    </Sheet>
  );
};
