import { FC } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

type MessageProps = {
  content: string;
  sender: number;
  partnerId: number;
};

export const Message: FC<MessageProps> = ({ content, sender, partnerId }) => {
  return (
    <Paper
      sx={{
        display: "flex",
        alignItems: "center",
        marginBottom: 2,
        padding: 2,
        maxWidth: "60%",
        "&.received": {
          marginLeft: "auto",
          backgroundColor: "#E0E0E0",
        },
      }}
      className={sender === partnerId ? "received" : ""}
      elevation={3}
    >
      {sender === partnerId && (
        <AccountCircleIcon
          color="secondary"
          fontSize="large"
          sx={{ mt: "auto", mb: "auto", mr: "auto" }}
        />
      )}
      <Typography variant="body1" color="black">
        {content}
      </Typography>
    </Paper>
  );
};
