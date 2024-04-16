import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import ListDivider from "@mui/joy/ListDivider";
import {
  Checkbox,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemContent,
  Stack,
  Typography,
} from "@mui/joy";
import FormLabel from "@mui/joy/FormLabel";
import CreateIcon from "@mui/icons-material/Create";
import { Training } from "../../types";
import { FC, useState } from "react";
import TrainingScheduleDialog from "./TrainingScheduleDialog";
import { weekdaysAbbreviation } from "../../constants";

type TrainingScheduleEntryProps = {
  training: Training;
};

const TrainingScheduleEntry: FC<TrainingScheduleEntryProps> = ({
  training,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <TrainingScheduleDialog open={open} setOpen={setOpen} />
      <Card
        sx={{
          width: 320,
          maxWidth: "100%",
          boxShadow: "lg",
          margin: "auto",
        }}
      >
        <CardOverflow sx={{ bgcolor: "background.level1" }}>
          <CardContent>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid>
                <Typography level="h4">{training.name}</Typography>
              </Grid>
              <Grid>
                <IconButton aria-label="edit" onClick={() => setOpen(true)}>
                  <CreateIcon />
                </IconButton>
              </Grid>
            </Grid>
          </CardContent>
        </CardOverflow>
        <CardContent>
          <List>
            {training.exercises.map((exercise, index) => {
              return (
                <>
                  <ListItem>
                    <ListItemContent>{exercise.exerciseName}</ListItemContent>
                    {"minutes" in exercise.exercise ? (
                      <ListItemContent>
                        {exercise.exercise.minutes} Min.
                      </ListItemContent>
                    ) : (
                      <ListItemContent>
                        {exercise.exercise.setAmount} x{" "}
                        {exercise.exercise.repititionAmount} Wdh.
                      </ListItemContent>
                    )}
                  </ListItem>
                  {index < training.exercises.length - 1 && (
                    <ListDivider inset="gutter" />
                  )}
                </>
              );
            })}
          </List>
        </CardContent>
        <CardOverflow sx={{ bgcolor: "background.level1" }}>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              {weekdaysAbbreviation.map((day) => {
                return (
                  <FormControl>
                    <Checkbox
                      checked={training.onDays.includes(day)}
                      sx={{ marginBottom: 1 }}
                    />
                    <FormLabel>{day}</FormLabel>
                  </FormControl>
                );
              })}
            </Stack>
          </CardContent>
        </CardOverflow>
      </Card>
    </>
  );
};

export default TrainingScheduleEntry;
