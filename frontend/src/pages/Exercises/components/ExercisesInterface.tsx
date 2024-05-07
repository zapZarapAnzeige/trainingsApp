import {
  Box,
  Chip,
  ChipDelete,
  Select,
  Stack,
  Typography,
  Option,
  IconButton,
} from "@mui/joy";
import { useState } from "react";
import { tags } from "../../../constants";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { addTag, removeTag } from "../../../redux/reducers/tagsSlice";
import { CloseRounded } from "@mui/icons-material";
import { arraysEqual } from "../../../utils";

export default function ExercisesInterface() {
  const currentTags = useAppSelector((state) => state.tags.value);
  const dispatch = useAppDispatch();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      marginBottom={1}
      bgcolor="primary.main"
      color="white"
    >
      <Stack direction="column" spacing={2}>
        <Select
          disabled={arraysEqual(tags, currentTags)}
          onChange={(
            event: React.SyntheticEvent | null,
            newValue: string | null
          ) => {
            if (newValue) {
              dispatch(addTag(newValue));
            }
          }}
          sx={{ minWidth: 320 }}
        >
          {tags
            .filter((tag) => !currentTags.includes(tag))
            .map((tag) => (
              <Option key={tag} value={tag}>
                {tag}
              </Option>
            ))}
        </Select>
        <Stack direction="row" spacing={2}>
          {currentTags.map((tag) => {
            return (
              <Chip
                variant="soft"
                color="danger"
                endDecorator={
                  <ChipDelete onDelete={() => dispatch(removeTag(tag))} />
                }
              >
                {tag}
              </Chip>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
