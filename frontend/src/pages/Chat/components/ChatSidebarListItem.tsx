import Box from "@mui/joy/Box";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { ListItemButtonProps } from "@mui/joy/ListItemButton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import CircleIcon from "@mui/icons-material/Circle";
import { ChatsOverview, PartnerData } from "../../../types";
import { formatTimestamp, toggleMessagesPane } from "../../../utils";
import { FC, Fragment } from "react";
import { ProfilePicture } from "../../../Common/ProfilePicture";
import { useIntl } from "react-intl";

type ChatSidebarListItemProps = ListItemButtonProps & {
  activePartner: PartnerData;
  chatOverview: ChatsOverview;
  readMessages: () => void;
  setActivePartner: (chat: PartnerData) => void;
};

export const ChatSidebarListItem: FC<ChatSidebarListItemProps> = ({
  chatOverview,
  activePartner,
  setActivePartner,
  readMessages,
}) => {
  const selected = chatOverview.partnerId === activePartner.id;
  const intl = useIntl();
  return (
    <Fragment>
      <ListItem sx={{ overflowX: "hidden" }}>
        <ListItemButton
          onClick={() => {
            toggleMessagesPane();
            readMessages();
            setActivePartner({
              bio: chatOverview.bio,
              nickname: chatOverview.nickname,
              disabled: chatOverview.disabled,
              id: chatOverview.partnerId,
              name: chatOverview.partnerName,
              profilePicture: chatOverview.profilePicture,
              lastMessageSenderId: chatOverview.lastSenderId,
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
              base64ProfilePicture={chatOverview.profilePicture}
              partnerName={chatOverview.partnerName}
            />
            <Box sx={{ flex: 1 }}>
              <Typography level="title-sm">
                {chatOverview.partnerName}
              </Typography>
              <Typography level="body-sm">
                {intl.formatMessage(
                  { id: "chat.unreadMessages" },
                  { unreadMessages: chatOverview.unreadMessages }
                )}
              </Typography>
            </Box>
            <Box
              sx={{
                lineHeight: 1.5,
                textAlign: "right",
              }}
            >
              {chatOverview.unreadMessages > 0 && (
                <CircleIcon sx={{ fontSize: 12 }} color="primary" />
              )}
              <Typography
                level="body-xs"
                display={{ xs: "none", md: "block" }}
                noWrap
              >
                {formatTimestamp(chatOverview.lastMessageTimestamp, intl)}
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
            {chatOverview.lastMessage}
          </Typography>
        </ListItemButton>
      </ListItem>
      <ListDivider sx={{ margin: 0 }} />
    </Fragment>
  );
};
