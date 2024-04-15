import { FormControl, IconButton, Select, Stack } from "@mui/joy";
import Option from "@mui/joy/Option";
import { FC } from "react";
import { Exercise } from "../../types";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

type TrainingsScheduleDialogSelectProps = {
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
};

const TrainingsScheduleDialogSelect: FC<TrainingsScheduleDialogSelectProps> = ({
  exercises,
  setExercises,
}) => {
  const handleChange = (
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) => {};

  return (
    <Stack spacing={2} direction="row">
      <Select
        placeholder="Übung auswählen"
        required
        sx={{ minWidth: 200 }}
        onChange={handleChange}
      >
        <Option value="cardio">Kardio</Option>
        <Option value="weighted">Weighted</Option>
      </Select>
      <IconButton>
        <DeleteOutlineIcon />
      </IconButton>
      {}
    </Stack>
  );
};

export default TrainingsScheduleDialogSelect;
export type { TrainingsScheduleDialogSelectProps };
