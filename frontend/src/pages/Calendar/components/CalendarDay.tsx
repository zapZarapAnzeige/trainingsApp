import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemContent,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { FC } from "react";
import { CalendarDayData } from "../../../types";
import { getWeekday } from "../../../utils";

type CalendarDayProps = {
  calendarDayData: CalendarDayData;
};

const CalendarDay: FC<CalendarDayProps> = ({ calendarDayData }) => {
  return (
    <>
      <Sheet variant="outlined" sx={{ mb: 1 }}>
        <Typography sx={{ mx: "auto" }}>
          {getWeekday(calendarDayData.date)}
        </Typography>
        <Typography sx={{ mx: "auto" }}>{calendarDayData.date}</Typography>
      </Sheet>
      <AccordionGroup variant="outlined" transition="0.2s">
        {calendarDayData.trainings ? (
          calendarDayData.trainings.map((training) => (
            <Accordion>
              <AccordionSummary>{training.name}</AccordionSummary>
              <AccordionDetails variant="soft">
                <List>
                  {training.exercises.map((exercise) => (
                    <>
                      <ListItem>
                        <ListItemContent>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography>{exercise.exerciseName}</Typography>
                            <IconButton>
                              <InfoOutlinedIcon />
                            </IconButton>
                          </Stack>
                        </ListItemContent>
                      </ListItem>
                      <Divider />
                      {"minutes" in exercise.exercise ? (
                        <ListItem>
                          <ListItemContent>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Typography>
                                {exercise.exercise.minutes} Min.
                              </Typography>
                              <Checkbox />
                            </Stack>
                          </ListItemContent>
                        </ListItem>
                      ) : (
                        <ListItem>
                          <ListItemContent>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Typography>
                                {exercise.exercise.setAmount} x{" "}
                                {exercise.exercise.repetitionAmount} Wdh.
                              </Typography>
                              <Checkbox />
                            </Stack>
                          </ListItemContent>
                        </ListItem>
                      )}
                      <Divider />
                      <FormControl>
                        <FormLabel>
                          {"minutes" in exercise.exercise ? "Distance" : "KG"}
                        </FormLabel>
                        <Input required type="number" />
                      </FormControl>
                    </>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Accordion disabled>
            <AccordionSummary>Kein Training</AccordionSummary>
            <AccordionDetails variant="soft">e</AccordionDetails>
          </Accordion>
        )}
      </AccordionGroup>
    </>
  );
};

export default CalendarDay;
