import Container from "@mui/joy/Typography";
import CssBaseline from "@mui/joy/Typography";
import Box from "@mui/joy/Typography";
import TextField from "@mui/joy/Typography";
import Button from "@mui/joy/Typography";
import Snackbar from "@mui/joy/Typography";
import Alert from "@mui/joy/Typography";
import Link from "@mui/joy/Typography";
import createTheme from "@mui/joy/Typography";
import SvgIcon from "@mui/joy/Typography";
import Typography from "@mui/joy/Typography";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { FC, useEffect, useState } from "react";
import { login, signUp } from "../../../frontend/src/api";
import { useIsAuthenticated, useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { AxiosError } from "axios";
import { PasswordTextField } from "./PasswordTextField";
import { customTheme } from "../Theme/theme";

export const LoginScreen: FC = () => {
  const [signInError, setSignInError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const signIn = useSignIn();
  const navigate = useNavigate();
  const intl = useIntl();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, []);

  const getMessage = (id: string): string => {
    return intl.formatMessage({ id: id });
  };

  const checkIfUsernameAndPaswordArePresent = (
    username: FormDataEntryValue | null,
    password: FormDataEntryValue | null
  ): boolean => {
    if (
      username !== null &&
      username !== "" &&
      password !== null &&
      password !== ""
    ) {
      return true;
    } else {
      if (username === "" || username === null) {
        setUsernameError(getMessage("loginScreen.error.noUsername"));
      }
      if (password === null || password === "") {
        setPasswordError(getMessage("loginScreen.error.noPassword"));
      }
      return false;
    }
  };

  const clearFields = () => {
    setPasswordError("");
    setSignInError("");
    setUsernameError("");
    setPassword("");
    setRepeatPassword("");
    setUsername("");
  };

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (checkIfUsernameAndPaswordArePresent(username, password)) {
      login(username!.toString(), password!.toString())
        .then((res) => {
          signIn({
            expiresIn: res.data.expires_in,
            token: res.data.access_token,
            tokenType: res.data.token_type,
            authState: {},
          });
          navigate("/");
        })
        .catch((err: AxiosError) => {
          if (err.response?.status === 401) {
            setPasswordError(getMessage("loginScreen.error.wrongCredentials"));
            setUsernameError(getMessage("loginScreen.error.wrongCredentials"));
            setSignInError(getMessage("loginScreen.error.wrongCredentials"));
          }
        });
    }
  };

  const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPassword("");
    setRepeatPassword("");
    if (password === repeatPassword) {
      if (checkIfUsernameAndPaswordArePresent(username, password)) {
        signUp(username!.toString(), password!.toString())
          .then(() => {
            setIsSignIn(true);
            clearFields();
          })
          .catch((err: AxiosError) => {
            if ((err.status = 409)) {
              setUsernameError(getMessage("loginScreen.usernameAlreadyExists"));
            }
          });
      }
    } else {
      setPasswordError(getMessage("loginScreen.error.notMatchingPassword"));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <SvgIcon path="../../public/app.svg"></SvgIcon>
        <Typography component="h1" variant="h5">
          {isSignIn ? "Sign in" : "Sign Up"}
        </Typography>
        <Box
          component="form"
          onSubmit={isSignIn ? handleSignIn : handleSignUp}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            sx={{ width: "100%" }}
            id={getMessage("loginScreen.username")}
            label={getMessage("loginScreen.username")}
            name={getMessage("loginScreen.username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
            helperText={usernameError}
            error={usernameError !== ""}
          />
          <PasswordTextField
            setValue={setPassword}
            value={password}
            passwordError={passwordError}
            setShowPassword={setShowPassword}
            showPassword={showPassword}
            textFieldName={getMessage("loginScreen.password")}
          />
          {!isSignIn && (
            <PasswordTextField
              setValue={setRepeatPassword}
              value={repeatPassword}
              passwordError={passwordError}
              setShowPassword={setShowPassword}
              showPassword={showPassword}
              textFieldName={intl.formatMessage({
                id: "loginScreen.repeatPassword",
              })}
            />
          )}

          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2, width: "100%" }}
          >
            {intl.formatMessage({
              id: isSignIn ? "loginScreen.signIn" : "loginScreen.signUp",
            })}
          </Button>
          <Typography align="center">
            <Link
              sx={{
                "&:hover": {
                  cursor: "pointer",
                },
              }}
              color={theme.palette.primary.light}
              onClick={(e) => {
                e.preventDefault();
                setIsSignIn((v) => !v);
                clearFields();
              }}
            >
              {intl.formatMessage({
                id: isSignIn ? "loginScreen.signUp" : "loginScreen.signIn",
              })}
            </Link>
          </Typography>
        </Box>
      </Box>
      <Snackbar
        open={signInError !== ""}
        autoHideDuration={5000}
        onClose={() => setSignInError("")}
      >
        <Alert severity="error">{signInError}</Alert>
      </Snackbar>
    </Container>
  );
};
