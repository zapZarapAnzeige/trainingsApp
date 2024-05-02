import {
  Box,
  Chip,
  ChipDelete,
  Select,
  Stack,
  Typography,
  Option,
} from "@mui/joy";
import { useState } from "react";
import { tags } from "../../../constants";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { addTag, removeTag } from "../../../redux/reducers/tagsSlice";

export default function ExercisesInterface() {
  const currentPage = useAppSelector((state) => state.tags.value);
  const dispatch = useAppDispatch();

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={1}
        bgcolor="primary.main"
        color="white"
      >
        <Box display="flex" alignItems="center">
          <Select>
            {tags.map((tag) => {
              return <Option value={tag}>{tag}</Option>;
            })}
          </Select>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <div>
            <Typography level="title-lg" id="best-movie" mb={2}>
              Best Movie
            </Typography>
            <Stack direction="row" spacing={2}>
              {tags.map((name) => {
                return (
                  <Chip
                    variant="soft"
                    color="danger"
                    endDecorator={
                      <ChipDelete onDelete={() => alert("Delete")} />
                    }
                  >
                    Delete
                  </Chip>
                );
              })}
            </Stack>
          </div>
        </Box>
      </Box>
    </>
  );
}
