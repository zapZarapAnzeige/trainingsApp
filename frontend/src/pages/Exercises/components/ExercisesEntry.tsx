import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import { AspectRatio, Box, IconButton, Stack, Typography } from "@mui/joy";
import { ExercisesEntryData } from "../../../types";
import { FC } from "react";
import InfoIcon from "@mui/icons-material/Info";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

type ExercisesEntryProps = {
  exercisesEntryData: ExercisesEntryData;
};

const ExercisesEntry: FC<ExercisesEntryProps> = ({ exercisesEntryData }) => {
  const starRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;

    // Vollständige Sterne hinzufügen
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon color="warning" key={i} />);
    }

    // Halben Stern hinzufügen, wenn vorhanden
    if (halfStar) {
      stars.push(<StarHalfIcon color="warning" key="half" />);
    }

    // Leere Sterne hinzufügen, bis zu insgesamt 5
    const totalStars = stars.length;
    for (let i = totalStars; i < 5; i++) {
      stars.push(<StarBorderIcon color="warning" key={i} />);
    }

    return <>{stars}</>;
  };

  return (
    <Card>
      <Typography level="title-lg" mx="auto">
        {exercisesEntryData.exerciseName}
      </Typography>
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
        <Stack direction="row" justifyContent="space-between" spacing={1}>
          <Stack direction="column">
            <Stack direction="row">
              <Typography fontSize="lg" fontWeight="lg" mr={1}>
                {exercisesEntryData.rating.toFixed(1)}
              </Typography>
              {starRating(exercisesEntryData.rating)}
            </Stack>
            <Typography level="body-xs">
              {exercisesEntryData.reviews}{" "}
              {exercisesEntryData.reviews === 1 ? "Bewertung" : "Bewertungen"}
            </Typography>
          </Stack>
          <IconButton variant="outlined" color="primary" sx={{ width: "100%" }}>
            <FitnessCenterIcon />
          </IconButton>
          <IconButton variant="outlined" color="neutral" sx={{ width: "100%" }}>
            <InfoIcon />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ExercisesEntry;
