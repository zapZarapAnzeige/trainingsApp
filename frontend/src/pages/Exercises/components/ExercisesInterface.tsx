import { Box, Chip, ChipDelete, Select, Stack, Option } from "@mui/joy";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  addTag,
  removeAllTags,
  removeTag,
} from "../../../redux/reducers/tagsSlice";
import { arraysEqual } from "../../../utils";
import { useEffect, useState } from "react";
import { getTags } from "../../../api";
import { useAuthHeader } from "react-auth-kit";

export default function ExercisesInterface() {
  const auth = useAuthHeader();
  const [tags, setTags] = useState<string[]>([]);
  const currentTags = useAppSelector((state) => state.tags.value);
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.currentPage.value);

  useEffect(() => {
    getTags(auth())
      .then((tags: string[]) => {
        setTags(tags);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, []);

  useEffect(() => {
    dispatch(removeAllTags());
  }, [currentPage]);

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
          placeholder="Tags auswählen"
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
            .map((tag, i) => (
              <Option key={i} value={tag}>
                {tag}
              </Option>
            ))}
        </Select>
        <Stack direction="row" spacing={2}>
          <Box sx={{ overflow: "auto" }}>
            {currentTags.map((tag, i) => {
              return (
                <Chip
                  key={i}
                  variant="outlined"
                  endDecorator={
                    <ChipDelete
                      onDelete={() => {
                        dispatch(removeTag(tag));
                      }}
                    />
                  }
                >
                  {tag}
                </Chip>
              );
            })}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
