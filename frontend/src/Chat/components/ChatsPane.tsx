import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import { Box, Chip, IconButton, Input } from "@mui/joy";
import List from "@mui/joy/List";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { ChatsOverview, UserData } from "../types";
import { toggleMessagesPane } from "../utils";
import { FC } from "react";
import { ChatListItem } from "./ChatListItem";

type ChatsPaneProps = {
  chatsOverview: ChatsOverview[];
  setActivePartner: (activePartner: UserData) => void;
  activePartner: UserData;
};

export const ChatsPane: FC<ChatsPaneProps> = ({
  chatsOverview,
  setActivePartner,
  activePartner,
}) => {
  const getTotalUnreadMessages = () => {
    let result = 0;
    chatsOverview.forEach((chat) => (result += chat.unread_messages));
    return result;
  };

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
          Messages
        </Typography>
        <IconButton
          variant="plain"
          aria-label="edit"
          color="neutral"
          size="sm"
          sx={{ display: { xs: "none", sm: "unset" } }}
        >
          <EditNoteRoundedIcon />
        </IconButton>
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
          startDecorator={<SearchRoundedIcon />}
          placeholder="Search"
          aria-label="Search"
        />
      </Box>
      <List
        sx={{
          py: 0,
          "--ListItem-paddingY": "0.75rem",
          "--ListItem-paddingX": "1rem",
        }}
      >
        {chatsOverview.map((chatOverview) => (
          <ChatListItem
            key={chatOverview.partner_id}
            activePartner={activePartner}
            chatOverview={chatOverview}
            setActivePartner={setActivePartner}
          />
        ))}
      </List>
    </Sheet>
  );
};
