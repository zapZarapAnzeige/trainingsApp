import Box from "@mui/joy/Box";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { ListItemButtonProps } from "@mui/joy/ListItemButton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import CircleIcon from "@mui/icons-material/Circle";
import { ChatsOverview, PartnerData } from "../../types";
import { formatTimestamp, toggleMessagesPane } from "../../utils";
import { FC, Fragment } from "react";
import { ProfilePicture } from "../../Common/ProfilePicture";
import { useIntl } from "react-intl";

type ChatListItemProps = ListItemButtonProps & {
  activePartner: PartnerData;
  chatOverview: ChatsOverview;
  readMessages: () => void;
  setActivePartner: (chat: PartnerData) => void;
};

export const ChatListItem: FC<ChatListItemProps> = ({
  chatOverview,
  activePartner,
  setActivePartner,
  readMessages,
}) => {
  const selected = chatOverview.partner_id === activePartner.id;
  const intl = useIntl();
  return (
    <Fragment>
      <ListItem sx={{ overflowX: "hidden" }}>
        <ListItemButton
          onClick={() => {
            toggleMessagesPane();
            readMessages();
            setActivePartner({
              disabled: chatOverview.disabled,
              id: chatOverview.partner_id,
              name: chatOverview.partner_name,
              profile_picture: chatOverview.profile_picture,
              lastMessageSenderId: chatOverview.last_sender_id,
            });
          }}
          selected={selected}
          color="neutral"
          sx={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            flexDirection: "column",
            alignItems: "initial",
            gap: 1,
            // this is neccessary for the box not to Grow
            width: "1px",
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
              <Typography level="body-sm">
                {intl.formatMessage(
                  { id: "chat.unreadMessages" },
                  { unreadMessages: chatOverview.unread_messages }
                )}
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
                {formatTimestamp(chatOverview.last_message_timestamp, intl)}
              </Typography>
            </Box>
          </Stack>
          <Typography
            level="body-sm"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
              width: "100%",
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
