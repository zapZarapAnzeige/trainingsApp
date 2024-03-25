import { Box, Button, Typography } from "@mui/material";
import { FC } from "react";
import { ChatOverview, UserData } from "../types";
import { ProfilePicture } from "./ProfilePicture";

type ChatSidebarProps = {
  overview: ChatOverview;
  setCurrentActiveChat: (currentActiveChat: UserData) => void;
};

export const ChatSidebar: FC<ChatSidebarProps> = ({
  overview,
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
          setCurrentActiveChat({
            id: overview.partner_id,
            name: overview.partner_name,
          });
        }}
      >
        <ProfilePicture
          base64ProfilePicture={overview.profile_picture}
          partnerName={overview.partner_name}
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
            {overview.partner_name}
          </Typography>
          <Typography
            variant="caption"
            maxWidth={"100%"}
            color={"black"}
            overflow="hidden"
            textOverflow={"ellipsis"}
            sx={{ mr: "auto" }}
          >
            {overview.last_message}
          </Typography>
        </Box>
      </Button>
    </Box>
  );
};
