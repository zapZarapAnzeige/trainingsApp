import Box from "@mui/joy/Box";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { ListItemButtonProps } from "@mui/joy/ListItemButton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import CircleIcon from "@mui/icons-material/Circle";
import { ChatsOverview, UserData } from "../types";
import { toggleMessagesPane } from "../utils";
import { FC, Fragment } from "react";
import { ProfilePicture } from "./ProfilePicture";

type ChatListItemProps = ListItemButtonProps & {
  activePartner: UserData;
  chatOverview: ChatsOverview;

  setActivePartner: (chat: UserData) => void;
};
//<Typography level="body-sm">{sender.username}</Typography>

export const ChatListItem: FC<ChatListItemProps> = ({
  chatOverview,
  activePartner,
  setActivePartner,
}) => {
  const selected = chatOverview.partner_id === activePartner.id;
  return (
    <Fragment>
      <ListItem>
        <ListItemButton
          onClick={() => {
            toggleMessagesPane();
            setActivePartner({
              id: chatOverview.partner_id,
              name: chatOverview.partner_name,
              profile_picture: chatOverview.profile_picture,
            });
          }}
          selected={selected}
          color="neutral"
          sx={{
            flexDirection: "column",
            alignItems: "initial",
            gap: 1,
          }}
        >
          <Stack direction="row" spacing={1.5}>
            <ProfilePicture
              base64ProfilePicture={chatOverview.profile_picture}
              partnerName={chatOverview.partner_name}
            />
            <Box sx={{ flex: 1 }}>
              <Typography level="title-sm">
                {chatOverview.partner_name}
              </Typography>
            </Box>
            <Box
              sx={{
                lineHeight: 1.5,
                textAlign: "right",
              }}
            >
              {chatOverview.unread_messages > 0 && (
                <CircleIcon sx={{ fontSize: 12 }} color="primary" />
              )}
              <Typography
                level="body-xs"
                display={{ xs: "none", md: "block" }}
                noWrap
              >
                {chatOverview.last_message_timestamp}
              </Typography>
            </Box>
          </Stack>
          <Typography
            level="body-sm"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {chatOverview.last_message}
          </Typography>
        </ListItemButton>
      </ListItem>
      <ListDivider sx={{ margin: 0 }} />
    </Fragment>
  );
};
