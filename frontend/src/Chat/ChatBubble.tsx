import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { SingleChatHistory, UserData, UserData_old } from "../types";
import { FC, useState } from "react";

type ChatBubbleProps = SingleChatHistory & {
  messageSentByUser: boolean;
  userData: UserData_old;
  activePartner: UserData;
};

export const ChatBubble: FC<ChatBubbleProps> = ({
  content,
  messageSentByUser,
  sender,
  timestamp,
  userData,
  activePartner,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isCelebrated, setIsCelebrated] = useState<boolean>(false);
  return (
    <Box sx={{ maxWidth: "60%", minWidth: "auto" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 0.25 }}
      >
        <Typography level="body-xs">
          {sender === userData.id ? "You" : activePartner.name}
        </Typography>
        <Typography level="body-xs">{timestamp}</Typography>
      </Stack>

      <Box
        sx={{ position: "relative" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Sheet
          color={messageSentByUser ? "primary" : "neutral"}
          variant={messageSentByUser ? "solid" : "soft"}
          sx={{
            p: 1.25,
            borderRadius: "lg",
            borderTopRightRadius: messageSentByUser ? 0 : "lg",
            borderTopLeftRadius: messageSentByUser ? "lg" : 0,
            backgroundColor: messageSentByUser
              ? "var(--joy-palette-primary-solidBg)"
              : "background.body",
          }}
        >
          <Typography
            level="body-sm"
            sx={{
              color: messageSentByUser
                ? "var(--joy-palette-common-white)"
                : "var(--joy-palette-text-primary)",
            }}
          >
            {content}
          </Typography>
        </Sheet>
        {(isHovered || isLiked || isCelebrated) && (
          <Stack
            direction="row"
            justifyContent={messageSentByUser ? "flex-end" : "flex-start"}
            spacing={0.5}
            sx={{
              position: "absolute",
              top: "50%",
              p: 1.5,
              ...(messageSentByUser
                ? {
                    left: 0,
                    transform: "translate(-100%, -50%)",
                  }
                : {
                    right: 0,
                    transform: "translate(100%, -50%)",
                  }),
            }}
          >
            <IconButton
              variant={isLiked ? "soft" : "plain"}
              color={isLiked ? "danger" : "neutral"}
              size="sm"
              onClick={() => setIsLiked((prevState) => !prevState)}
            >
              {isLiked ? "❤️" : <FavoriteBorderIcon />}
            </IconButton>
            <IconButton
              variant={isCelebrated ? "soft" : "plain"}
              color={isCelebrated ? "warning" : "neutral"}
              size="sm"
              onClick={() => setIsCelebrated((prevState) => !prevState)}
            >
              {isCelebrated ? "🎉" : <CelebrationOutlinedIcon />}
            </IconButton>
          </Stack>
        )}
      </Box>
    </Box>
  );
};
