import { Box, Button, Icon, Typography } from "@mui/material";
import { FC, ReactNode } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

type ChatSidebarProps = {
  partnerName: string;
  lastMessage: string;
  setCurrentActiveChat: (currentActiveChat: string) => void;
  profilePicture?: ReactNode;
};

export const ChatSidebar: FC<ChatSidebarProps> = ({
  partnerName,
  lastMessage,
  setCurrentActiveChat,
}) => {
  return (
    <Box overflow={"hidden"} display="flex" flexDirection={"row"}>
      <Button
        sx={{
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
          width: "100%",
        }}
        onClick={() => {
          setCurrentActiveChat(partnerName);
        }}
      >
        <AccountCircleIcon
          color="secondary"
          fontSize="large"
          sx={{ mt: "auto", mb: "auto", mr: "auto" }}
        />

        <Box
          flexGrow={1}
          display={"flex"}
          flexDirection="column"
          overflow={"hidden"}
          textOverflow="ellipsis"
          sx={{ mr: "auto" }}
        >
          <Typography variant="h6" color={"black"} sx={{ mr: "auto" }}>
            {partnerName}
          </Typography>
          <Typography
            variant="caption"
            maxWidth={"100%"}
            color={"black"}
            overflow="hidden"
            textOverflow={"ellipsis"}
            sx={{ mr: "auto" }}
          >
            {lastMessage}
          </Typography>
        </Box>
      </Button>
    </Box>
  );
};
