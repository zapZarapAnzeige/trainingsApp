import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import { AspectRatio, IconButton, Stack, Typography } from "@mui/joy";
import { ExercisesEntryData } from "../../types";
import { BookmarkAdd } from "@mui/icons-material";
import { FC } from "react";
import AddIcon from "@mui/icons-material/Add";

type ExercisesEntryProps = {
  exercisesEntryData: ExercisesEntryData;
};

const ExercisesEntry: FC<ExercisesEntryProps> = ({ exercisesEntryData }) => {
  return (
    <Card sx={{ width: 320 }}>
      <div>
        <Typography level="title-lg">
          {exercisesEntryData.exerciseName}
        </Typography>
        <IconButton
          aria-label="bookmark Bahamas Islands"
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ position: "absolute", top: "0.875rem", right: "0.5rem" }}
        >
          <BookmarkAdd />
        </IconButton>
      </div>
      <AspectRatio minHeight="120px" maxHeight="200px">
        <img
          src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
          srcSet="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286&dpr=2 2x"
          loading="lazy"
          alt=""
        />
      </AspectRatio>
      <Stack></Stack>
      <CardContent orientation="horizontal">
        <div>
          <Typography level="body-xs">Rating</Typography>
          <Typography fontSize="lg" fontWeight="lg">
            {exercisesEntryData.rating + " Stars"}
          </Typography>
        </div>
        <IconButton variant="solid" color="primary">
          <AddIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default ExercisesEntry;
