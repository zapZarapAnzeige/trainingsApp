import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import { AspectRatio, Box, IconButton, Stack, Typography } from "@mui/joy";
import { ExercisesEntryData } from "../../../types";
import { FC } from "react";
import AddIcon from "@mui/icons-material/Add";

type ExercisesEntryProps = {
  exercisesEntryData: ExercisesEntryData;
};

const ExercisesEntry: FC<ExercisesEntryProps> = ({ exercisesEntryData }) => {
  return (
    <Card>
      <Box>
        <Typography level="title-lg">
          {exercisesEntryData.exerciseName}
        </Typography>
      </Box>
      <AspectRatio minHeight="120px" maxHeight="200px">
        <img
          src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
          srcSet="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286&dpr=2 2x"
          loading="lazy"
          alt=""
        />
      </AspectRatio>
      <Stack></Stack>
      <CardContent>
        <Stack spacing={2} direction="row" justifyContent="space-between">
          <Box>
            <Typography level="body-xs">Rating</Typography>
            <Typography fontSize="lg" fontWeight="lg">
              {exercisesEntryData.rating + " Stars"}
            </Typography>
          </Box>
          <IconButton variant="solid" color="primary">
            <AddIcon />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ExercisesEntry;
