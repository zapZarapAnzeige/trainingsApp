import {
  Avatar,
  IconButton,
  Stack,
  Typography,
  Menu,
  MenuItem,
  MenuButton,
  Dropdown,
} from "@mui/joy";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { ChatsOverview, PartnerData } from "../../../types";
import { Dispatch, FC, SetStateAction } from "react";
import { toggleMessagesPane } from "../../../utils";
import { useAuthHeader } from "react-auth-kit";
import { changeBlockStatus } from "../../../api";
import { useAppSelector } from "../../../hooks";
import { useIntl } from "react-intl";

type MessagesPaneHeaderProps = {
  setSender: (sender: PartnerData) => void;
  sender: PartnerData;
  setChatsOverview: Dispatch<SetStateAction<ChatsOverview[]>>;
};

export const MessagesPaneHeader: FC<MessagesPaneHeaderProps> = ({
  sender,
  setChatsOverview,
  setSender,
}) => {
  const auth = useAuthHeader();
  const intl = useIntl();
  const userData = useAppSelector((state) => state.user.value);
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.body",
      }}
      py={{ xs: 2, md: 2 }}
      px={{ xs: 1, md: 2 }}
    >
      <Stack direction="row" spacing={{ xs: 1, md: 2 }} alignItems="center">
        <IconButton
          variant="plain"
          color="neutral"
          size="sm"
          sx={{
            display: { xs: "inline-flex", sm: "none" },
          }}
          onClick={() => toggleMessagesPane()}
        >
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
        <Avatar size="lg" src={sender.profile_picture} />
        <div>
          <Typography fontWeight="lg" fontSize="lg" component="h2" noWrap>
            {sender.name}
          </Typography>
          <Typography level="body-sm">{sender.name}</Typography>
        </div>
      </Stack>
      <Stack spacing={1} direction="row" alignItems="center">
        <Dropdown>
          <MenuButton
            size="sm"
            variant="plain"
            sx={{ borderWidth: 0, maxWidth: "32px", maxHeight: "32px" }}
          >
            <IconButton size="sm" variant="plain" color="neutral">
              <MoreVertRoundedIcon />
            </IconButton>
          </MenuButton>
          <Menu
            placement="bottom-end"
            size="sm"
            sx={{
              zIndex: "99999",
              p: 1,
              gap: 1,
              "--ListItem-radius": "var(--joy-radius-sm)",
            }}
          >
            <MenuItem onClick={() => {}}>
              {intl.formatMessage({ id: "chat.label.viewProfile" })}
            </MenuItem>
            <MenuItem
              disabled={
                sender.disabled && sender.lastMessageSenderId !== userData.id
              }
              onClick={() => {
                setChatsOverview((chatOverview) =>
                  chatOverview.map((chat) =>
                    chat.partner_id === sender.id
                      ? {
                          ...chat,
                          unread_messages: 0,
                          disabled: !chat.disabled,
                          profile_picture: undefined,
                        }
                      : chat
                  )
                );
                setSender({
                  ...sender,
                  disabled: !sender.disabled,
                  profile_picture: undefined,
                });

                changeBlockStatus(auth(), sender.disabled, sender.id);
              }}
            >
              {intl.formatMessage({
                id: sender.disabled ? "unblock User" : "Block User",
              })}
            </MenuItem>
          </Menu>
        </Dropdown>
      </Stack>
    </Stack>
  );
};
