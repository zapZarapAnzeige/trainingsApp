import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import { SingleChatHistory, PartnerData, UserData } from "../../../types";
import { FC } from "react";
import { formatTimestamp } from "../../../utils";
import { useIntl } from "react-intl";

type ChatMessageProps = SingleChatHistory & {
  messageSentByUser: boolean;
  userData: UserData;
  activePartner: PartnerData;
};

export const ChatMessage: FC<ChatMessageProps> = ({
  content,
  messageSentByUser,
  sender,
  timestamp,
  userData,
  activePartner,
}) => {
  const intl = useIntl();
  return (
    <Box sx={{ maxWidth: "60%", minWidth: "auto" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 0.25 }}
      >
        <Typography level="body-xs">
          {sender === userData.id
            ? intl.formatMessage({ id: "chat.label.you" })
            : activePartner.name}
        </Typography>
        <Typography level="body-xs">
          {formatTimestamp(timestamp, intl)}
        </Typography>
      </Stack>

      <Box sx={{ position: "relative" }}>
        <Sheet
          color={messageSentByUser ? "primary" : "neutral"}
          variant={messageSentByUser ? "solid" : "soft"}
          sx={{
            wordBreak: "break-word",
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
              //textAlign: messageSentByUser ? "end" : "start",
              wordWrap: "break-word",
              whiteSpace: "pre-wrap",
              color: messageSentByUser
                ? "var(--joy-palette-common-white)"
                : "var(--joy-palette-text-primary)",
            }}
          >
            {content}
          </Typography>
        </Sheet>
      </Box>
    </Box>
  );
};
