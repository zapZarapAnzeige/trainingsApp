import {
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
import { ProfilePicture } from "../../../Common/ProfilePicture";

type ChatContentPageHeaderProps = {
  setSender: (sender: PartnerData) => void;
  sender: PartnerData;
  setChatsOverview: Dispatch<SetStateAction<ChatsOverview[]>>;
  setViewProfile: (viewProfile: boolean) => void;
};

export const ChatContentPageHeader: FC<ChatContentPageHeaderProps> = ({
  sender,
  setChatsOverview,
  setSender,
  setViewProfile,
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
        <ProfilePicture
          base64ProfilePicture={sender.profilePicture}
          props={{ size: "lg" }}
        />
        <IconButton onClick={() => setViewProfile(true)}>
          <Typography fontWeight="lg" fontSize="lg" component="h2" noWrap>
            {sender.name}
          </Typography>
        </IconButton>
      </Stack>
      <Stack spacing={1} direction="row" alignItems="center">
        <Dropdown>
          <MenuButton
            size="sm"
            variant="plain"
            sx={{ borderWidth: 0, maxWidth: "32px", maxHeight: "32px" }}
          >
            <MoreVertRoundedIcon />
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
            <MenuItem onClick={() => setViewProfile(true)}>
              {intl.formatMessage({ id: "chat.label.viewProfile" })}
            </MenuItem>
            <MenuItem
              disabled={
                sender.disabled && sender.lastMessageSenderId !== userData.id
              }
              onClick={() => {
                setChatsOverview((chatOverview) =>
                  chatOverview.map((chat) =>
                    chat.partnerId === sender.id
                      ? {
                          ...chat,
                          unreadMessages: 0,
                          disabled: !chat.disabled,
                          profilePicture: undefined,
                        }
                      : chat
                  )
                );
                setSender({
                  ...sender,
                  disabled: !sender.disabled,
                  profilePicture: undefined,
                });

                changeBlockStatus(auth(), sender.disabled, sender.id);
              }}
            >
              {intl.formatMessage({
                id: sender.disabled ? "chat.label.unblock" : "chat.label.block",
              })}
            </MenuItem>
          </Menu>
        </Dropdown>
      </Stack>
    </Stack>
  );
};
