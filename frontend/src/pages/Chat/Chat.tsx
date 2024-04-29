import Sheet from "@mui/joy/Sheet";
import {
  ChatsOverview,
  DismissDialogType,
  SingleChatHistory,
  PartnerData,
  WSError,
  isSingleChatHistory,
  isWSError,
} from "../../types";
import { FC, useEffect, useState } from "react";
import { getChatHistory, getChatsOverview } from "../../api";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatContentPage } from "./components/ChatContentPage";
import { useWebsocket } from "../../Provider/WebSocketProvider";
import { useAuthHeader } from "react-auth-kit";
import DismissDialog from "../../Common/DismissDialog";
import { useIntl } from "react-intl";
import { Profile } from "../Profile/Profile";

export const Chat: FC = () => {
  const [chatsOverview, setChatsOverview] = useState<ChatsOverview[]>([]);
  const [chatHistory, setChatHistory] = useState<SingleChatHistory[]>([]);
  const [activePartner, setActivePartner] = useState<PartnerData>({
    id: -1,
    name: "",
    disabled: true,
    lastMessageSenderId: -1,
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const intl = useIntl();
  const [viewProfile, setViewProfile] = useState<boolean>();

  useEffect(() => {
    setChatHistory([]);
    if (activePartner.name !== "" && activePartner.id > 0) {
      getChatHistory(auth(), activePartner.id).then((res) => {
        setChatHistory(res.data.chat);
      });
    }
  }, [activePartner]);

  const websocket = useWebsocket((e) => {
    const data: SingleChatHistory | WSError = JSON.parse(e.data);
    if (isSingleChatHistory(data)) {
      if (activePartner.id === data.sender) {
        setChatHistory([...chatHistory, data]);
      }
      setChatsOverview(
        chatsOverview.map((overview) =>
          overview.partnerId === data.sender
            ? {
                ...overview,
                lastMessageTimestamp: data.timestamp,
                lastMessage: data.content,
                unreadMessages:
                  overview.partnerId === activePartner.id
                    ? 0
                    : overview.unreadMessages + 1,
              }
            : overview
        )
      );
    } else if (isWSError(data)) {
      setErrorMessage(
        data.error_message ?? intl.formatMessage({ id: "error.unknown" })
      );
      setChatHistory(
        chatHistory.filter((chat) => chat.tempId !== data.message.id)
      );
    }
  });

  const auth = useAuthHeader();

  useEffect(() => {
    getChatsOverview(auth()).then((res) => {
      setChatsOverview(
        res.data.chat_data.map(
          (data: any): ChatsOverview => ({
            bio: data.bio,
            disabled: data.disabled,
            lastMessage: data.last_message,
            lastMessageTimestamp: data.last_message_timestamp,
            lastSenderId: data.last_sender_id,
            nickname: data.nickname,
            partnerId: data.partner_id,
            partnerName: data.partner_name,
            profilePicture: data.profile_picture,
            unreadMessages: data.unread_messages,
          })
        )
      );
    });
  }, []);

  return viewProfile ? (
    <Profile setViewProfile={setViewProfile} userData={activePartner} />
  ) : (
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
          overflow: "hidden",
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
        <ChatSidebar
          setChatsOverview={setChatsOverview}
          activePartner={activePartner}
          chatsOverview={chatsOverview}
          setActivePartner={setActivePartner}
        />
      </Sheet>
      <ChatContentPage
        setViewProfile={setViewProfile}
        setActivePartner={setActivePartner}
        setChatsOverview={setChatsOverview}
        activePartner={activePartner}
        chatHistory={chatHistory}
        websocket={websocket}
      />
      <DismissDialog
        dismissDialogType={DismissDialogType.ERROR}
        open={errorMessage !== ""}
        closeDismissDialog={() => {
          setErrorMessage("");
        }}
        dialogContent={errorMessage}
      />
    </Sheet>
  );
};
