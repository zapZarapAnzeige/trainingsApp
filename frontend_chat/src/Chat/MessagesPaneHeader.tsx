import Avatar from "@mui/joy/Avatar";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { UserData } from "../types";
import { FC } from "react";
import { toggleMessagesPane } from "../utils";

type MessagesPaneHeaderProps = {
  sender: UserData;
};

export const MessagesPaneHeader: FC<MessagesPaneHeaderProps> = (
  props: MessagesPaneHeaderProps
) => {
  const { sender } = props;
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
        <Button
          color="neutral"
          variant="outlined"
          size="sm"
          sx={{
            display: { xs: "none", md: "inline-flex" },
          }}
        >
          View profile
        </Button>
        <IconButton size="sm" variant="plain" color="neutral">
          <MoreVertRoundedIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
};
