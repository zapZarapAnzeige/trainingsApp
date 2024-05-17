import { Box, Chip, ChipDelete, Select, Stack, Option } from "@mui/joy";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { addTag, removeTag } from "../../../redux/reducers/tagsSlice";
import { arraysEqual } from "../../../utils";
import { useEffect, useState } from "react";
import { getTags } from "../../../api";
import { useAuthHeader } from "react-auth-kit";

export default function ExercisesInterface() {
  const auth = useAuthHeader();
  const [tags, setTags] = useState<string[]>([]);
  const currentTags = useAppSelector((state) => state.tags.value);
  const dispatch = useAppDispatch();

  useEffect(() => {
    getTags(auth())
      .then((tags: string[]) => {
        setTags(tags);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, []);

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
        </Stack>
      </Stack>
    </Box>
  );
}
