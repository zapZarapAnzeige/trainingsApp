import { FormHelperText, IconButton } from "@mui/joy";
import { FormControl, FormLabel, Input } from "@mui/joy";
import { FC } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { InfoOutlined } from "@mui/icons-material";

type InputFieldProps = {
  fieldName: string;
  setField: (password: string) => void;
  errorMessage: string;
  showPassword?: boolean;
  setShowPassword?: (password: boolean) => void;
  fieldValue: string;
};

export const InputField: FC<InputFieldProps> = ({
  fieldName,
  setShowPassword,
  showPassword,
  setField,
  errorMessage,
  fieldValue,
}) => {
  return (
    <FormControl required>
      <FormLabel>{fieldName}</FormLabel>
      <Input
        value={fieldValue}
        type={showPassword ? "" : "Password"}
        name={fieldName}
        onChange={(e) => {
          setField(e.target.value);
        }}
        error={errorMessage !== ""}
        endDecorator={
          showPassword !== undefined && setShowPassword !== undefined ? (
            <IconButton onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          ) : (
            <></>
          )
        }
      />
      {errorMessage ? (
        <FormHelperText>
          <InfoOutlined />
          {errorMessage}
        </FormHelperText>
      ) : (
        <></>
      )}
    </FormControl>
  );
};
