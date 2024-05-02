import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
} from "@mui/joy";
import List from "@mui/joy/List";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { ChatsOverview, DismissDialogType, PartnerData } from "../../../types";
import { toggleMessagesPane } from "../../../utils";
import { FC, ReactNode, forwardRef, useState } from "react";
import { ChatSidebarListItem } from "./ChatSidebarListItem";
import { useIntl } from "react-intl";
import SendIcon from "@mui/icons-material/Send";
import { InfoOutlined } from "@mui/icons-material";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { useAuthHeader } from "react-auth-kit";
import { findNewPartner } from "../../../api";
import DismissDialog from "../../../Common/DismissDialog";
import { ProfilePicture } from "../../../Common/ProfilePicture";

type ChatSidebarProps = {
  chatsOverview: ChatsOverview[];
  setActivePartner: (activePartner: PartnerData) => void;
  activePartner: PartnerData;
  setChatsOverview: (chatsOverview: ChatsOverview[]) => void;
};

interface NumericFormatAdapterProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatAdapter = forwardRef<
  NumericFormatProps,
  NumericFormatAdapterProps
>(function NumericFormatAdapter(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      valueIsNumericString
    />
  );
});

export const ChatSidebar: FC<ChatSidebarProps> = ({
  chatsOverview,
  setActivePartner,
  activePartner,
  setChatsOverview,
}) => {
  const intl = useIntl();
  const auth = useAuthHeader();
  const getTotalUnreadMessages = () => {
    let result = 0;
    chatsOverview.forEach((chat) => (result += chat.unreadMessages));
    return result;
  };

  const [searchbarText, setSearchbarText] = useState<string>("");
  const [searchForPartnerText, setSearchForPartnerText] = useState<string>("");
  const [searchForPartnerErrorText, setSearchForPartnerErrorText] =
    useState<string>("");
  const [infoMessage, setInfoMessage] = useState<string | ReactNode>("");

  return (
    <Sheet
      sx={{
        borderRight: "1px solid",
        borderColor: "divider",
        height: "calc(100dvh - var(--Header-height))",
        overflowY: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        p={2}
        pb={1.5}
      >
        <Typography
          fontSize={{ xs: "md", md: "lg" }}
          component="h1"
          fontWeight="lg"
          endDecorator={
            <Chip
              variant="soft"
              color="primary"
              size="md"
              slotProps={{ root: { component: "span" } }}
            >
              {getTotalUnreadMessages()}
            </Chip>
          }
          sx={{ mr: "auto" }}
        >
          {intl.formatMessage({ id: "chat.label.messages" })}
        </Typography>
        <IconButton
          variant="plain"
          aria-label="edit"
          color="neutral"
          size="sm"
          onClick={() => {
            toggleMessagesPane();
          }}
          sx={{ display: { sm: "none" } }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Stack>
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Input
          size="sm"
          onChange={(e) => {
            setSearchbarText(e.target.value);
          }}
          startDecorator={<SearchRoundedIcon />}
          placeholder={intl.formatMessage({ id: "chat.label.search" })}
          aria-label={intl.formatMessage({ id: "chat.label.search" })}
        />
      </Box>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        <List
          sx={{
            overflow: "auto",
            py: 0,
            "--ListItem-paddingY": "0.75rem",
            "--ListItem-paddingX": "1rem",
          }}
        >
          {chatsOverview.map((chatOverview) =>
            chatOverview.partnerName.includes(searchbarText) ? (
              <ChatSidebarListItem
                key={chatOverview.partnerId}
                activePartner={activePartner}
                chatOverview={chatOverview}
                setActivePartner={setActivePartner}
                readMessages={() =>
                  setChatsOverview(
                    chatsOverview.map((chat) =>
                      chat.partnerId === chatOverview.partnerId
                        ? { ...chat, unreadMessages: 0 }
                        : chat
                    )
                  )
                }
              />
            ) : (
              <></>
            )
          )}
        </List>
        <Box sx={{ px: 2, pb: 1.5 }}>
          <FormControl error>
            <Input
              endDecorator={
                <IconButton
                  onClick={() => {
                    if (searchForPartnerText.length !== 5) {
                      setSearchForPartnerErrorText(
                        intl.formatMessage({ id: "chat.error.plzIncorrect" })
                      );
                    } else {
                      findNewPartner(auth(), searchForPartnerText).then(
                        (res) => {
                          if (typeof res.data !== "string") {
                            setChatsOverview([
                              ...chatsOverview,
                              {
                                bio: res.data.bio,
                                nickname: res.data.nickname,
                                disabled: false,
                                lastMessage: "newMatch",
                                lastMessageTimestamp: Date.now(),
                                lastSenderId: res.data.user_id,
                                partnerId: res.data.user_id,
                                partnerName: res.data.user_name,
                                unreadMessages: 1,
                                profilePicture: res.data.profile_picture,
                              },
                            ]);
                            setInfoMessage(
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignContent: "center",
                                }}
                              >
                                {res.data.profile_picture && (
                                  <ProfilePicture
                                    base64ProfilePicture={
                                      res.data.profile_picture
                                    }
                                  />
                                )}
                                <Typography>
                                  {intl.formatMessage(
                                    {
                                      id: "chat.info.newPartner",
                                    },
                                    { partnerName: res.data.user_name }
                                  )}
                                </Typography>
                              </Box>
                            );
                          } else {
                            setInfoMessage(res.data);
                          }
                        }
                      );
                    }
                  }}
                  disabled={searchForPartnerText.length !== 5}
                >
                  <SendIcon />
                </IconButton>
              }
              slotProps={{
                input: {
                  component: NumericFormatAdapter,
                },
              }}
              error={searchForPartnerErrorText !== ""}
              size="sm"
              onChange={(e) => {
                if (e.target.value.length > 5) {
                  setSearchForPartnerErrorText(
                    intl.formatMessage({ id: "chat.error.plzIncorrect" })
                  );
                } else {
                  setSearchForPartnerErrorText("");
                }
                setSearchForPartnerText(e.target.value);
              }}
              startDecorator={<SearchRoundedIcon />}
              placeholder={intl.formatMessage({
                id: "chat.label.searchPartner",
              })}
              aria-label={intl.formatMessage({
                id: "chat.label.searchPartner",
              })}
            />
            {searchForPartnerErrorText && (
              <FormHelperText>
                <InfoOutlined />
                {searchForPartnerErrorText}
              </FormHelperText>
            )}
          </FormControl>
        </Box>
      </Box>
      <DismissDialog
        open={infoMessage !== ""}
        dismissDialogType={DismissDialogType.INFO}
        closeDismissDialog={() => setInfoMessage("")}
        dialogContent={infoMessage}
      />
    </Sheet>
  );
};
