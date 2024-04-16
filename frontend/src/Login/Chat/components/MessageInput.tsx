import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import Textarea from "@mui/joy/Textarea";
import { Stack } from "@mui/joy";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { FC, useRef } from "react";
import { useIntl } from "react-intl";

export type MessageInputProps = {
  textAreaValue: string;
  setTextAreaValue: (value: string) => void;
  onSubmit: () => void;
};

export const MessageInput: FC<MessageInputProps> = (
  props: MessageInputProps
) => {
  const intl = useIntl();
  const { textAreaValue, setTextAreaValue, onSubmit } = props;
  const textAreaRef = useRef<HTMLDivElement>(null);
  const handleClick = () => {
    if (textAreaValue.trim() !== "") {
      onSubmit();
      setTextAreaValue("");
    }
  };
  return (
    <Box sx={{ px: 2, pb: 3 }}>
      <FormControl>
        <Textarea
          placeholder={intl.formatMessage({ id: "chat.placeholder.message" })}
          aria-label={intl.formatMessage({ id: "chat.label.message" })}
          ref={textAreaRef}
          onChange={(e) => {
            setTextAreaValue(e.target.value);
          }}
          value={textAreaValue}
          minRows={3}
          maxRows={10}
          endDecorator={
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexGrow={1}
              sx={{
                py: 1,
                pr: 1,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Button
                size="sm"
                color="primary"
                sx={{ alignSelf: "center", borderRadius: "sm", ml: "auto" }}
                endDecorator={<SendRoundedIcon />}
                onClick={handleClick}
              >
                {intl.formatMessage({ id: "chat.label.send" })}
              </Button>
            </Stack>
          }
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              handleClick();
            }
          }}
          sx={{
            "& textarea:first-of-type": {
              minHeight: 72,
            },
          }}
        />
      </FormControl>
    </Box>
  );
};
