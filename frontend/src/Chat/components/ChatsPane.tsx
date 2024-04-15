import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import { Box, Chip, IconButton, Input } from "@mui/joy";
import List from "@mui/joy/List";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { ChatsOverview, PartnerData } from "../../types";
import { toggleMessagesPane } from "../../utils";
import { FC, useState } from "react";
import { ChatListItem } from "./ChatListItem";
import { useIntl } from "react-intl";

type ChatsPaneProps = {
  chatsOverview: ChatsOverview[];
  setActivePartner: (activePartner: PartnerData) => void;
  activePartner: PartnerData;
  setChatsOverview: (chatsOverview: ChatsOverview[]) => void;
};

export const ChatsPane: FC<ChatsPaneProps> = ({
  chatsOverview,
  setActivePartner,
  activePartner,
  setChatsOverview,
}) => {
  const intl = useIntl();
  const getTotalUnreadMessages = () => {
    let result = 0;
    chatsOverview.forEach((chat) => (result += chat.unread_messages));
    return result;
  };

  const [searchbarText, setSearchbarText] = useState<string>("");

  return (
    <Sheet
      sx={{
        borderRight: "1px solid",
        borderColor: "divider",
        height: "calc(100dvh - var(--Header-height))",
        overflowY: "auto",
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
      <List
        sx={{
          py: 0,
          "--ListItem-paddingY": "0.75rem",
          "--ListItem-paddingX": "1rem",
        }}
      >
        {chatsOverview.map((chatOverview) =>
          chatOverview.partner_name.includes(searchbarText) ? (
            <ChatListItem
              key={chatOverview.partner_id}
              activePartner={activePartner}
              chatOverview={chatOverview}
              setActivePartner={setActivePartner}
              readMessages={() =>
                setChatsOverview(
                  chatsOverview.map((chat) =>
                    chat.partner_id === chatOverview.partner_id
                      ? { ...chat, unread_messages: 0 }
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
    </Sheet>
  );
};
