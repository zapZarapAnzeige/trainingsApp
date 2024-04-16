import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  accordionDetailsClasses,
  accordionSummaryClasses,
} from "@mui/joy";
import { FC } from "react";
import { CalendarDayData } from "../../../types";

type CalendarDayProps = {
  dayName: string;
  calendarDayData: CalendarDayData;
};

const CalendarDay: FC<CalendarDayProps> = ({ dayName, calendarDayData }) => {
  return (
    <>
      <AccordionGroup
        variant="outlined"
        transition="0.2s"
        sx={{
          maxWidth: 400,
          borderRadius: "lg",
          [`& .${accordionSummaryClasses.button}:hover`]: {
            bgcolor: "transparent",
          },
          [`& .${accordionDetailsClasses.content}`]: {
            boxShadow: (theme) => `inset 0 1px ${theme.vars.palette.divider}`,
            [`&.${accordionDetailsClasses.expanded}`]: {
              paddingBlock: "0.75rem",
            },
          },
        }}
      >
        <Accordion>
          <AccordionSummary>{dayName}</AccordionSummary>
          <AccordionDetails variant="soft">11.04.2024</AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary>Second accordion</AccordionSummary>
          <AccordionDetails variant="soft">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary>Third accordion</AccordionSummary>
          <AccordionDetails variant="soft">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </AccordionDetails>
        </Accordion>
      </AccordionGroup>
    </>
  );
};

export default CalendarDay;
