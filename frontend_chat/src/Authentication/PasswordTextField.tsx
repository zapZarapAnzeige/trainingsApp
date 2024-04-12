import { TextField, InputAdornment, IconButton } from "@mui/material";
import { FC } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

type PasswordTextFieldProps = {
  showPassword: boolean;
  setShowPassword: (showPassword: boolean) => void;
  passwordError: string;
  textFieldName: string;
  value: string;
  setValue: (value: string) => void;
};

export const PasswordTextField: FC<PasswordTextFieldProps> = ({
  showPassword,
  passwordError,
  setShowPassword,
  textFieldName,
  value,
  setValue,
}) => {
  return (
    <TextField
      margin="normal"
      required
      sx={{ width: "100%" }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      name={textFieldName}
      label={textFieldName}
      type={showPassword ? "" : "password"}
      id={textFieldName}
      autoComplete="current-password"
      helperText={passwordError}
      error={passwordError !== ""}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              edge="end"
              color="primary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
