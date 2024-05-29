import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import IconButton, { IconButtonProps } from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import { AxiosError } from "axios";
import { useIntl } from "react-intl";
import { login, signUp } from "../api";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, FormEvent } from "react";
import { useSignIn, useIsAuthenticated } from "react-auth-kit";
import { Link, Snackbar } from "@mui/joy";
import { InputField } from "./InputField";

function ColorSchemeToggle(props: IconButtonProps) {
  const { onClick, ...other } = props;
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <IconButton
      aria-label="toggle light/dark mode"
      size="sm"
      variant="outlined"
      disabled={!mounted}
      onClick={(event) => {
        setMode(mode === "light" ? "dark" : "light");
        onClick?.(event);
      }}
      {...other}
    >
      {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}

export default function Login() {
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

  const handleSignIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (checkIfUsernameAndPaswordArePresent(username, password)) {
      login(username!.toString(), password!.toString())
        .then((res) => {
          if (
            signIn({
              expiresIn: res.data.expires_in,
              token: res.data.access_token,
              tokenType: res.data.token_type,
              authState: {},
            })
          ) {
            navigate("/");
          }
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

  const handleSignUp = (event: FormEvent<HTMLFormElement>) => {
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
    <CssVarsProvider defaultMode="dark" disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": {
            "--Form-maxWidth": "800px",
            "--Transition-duration": "0.4s", // set to `none` to disable transition
          },
        }}
      />
      <Box
        sx={(theme) => ({
          width: { xs: "100%", md: "50vw" },
          transition: "width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255 255 255 / 0.2)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundColor: "rgba(19 19 24 / 0.4)",
          },
        })}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            width: "100%",
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{
              py: 3,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
              <IconButton variant="soft" color="primary" size="sm">
                <BadgeRoundedIcon />
              </IconButton>
              <Typography level="title-lg">
                {getMessage("label.companyName")}
              </Typography>
            </Box>
            <ColorSchemeToggle />
          </Box>
          <Box
            component="main"
            sx={{
              my: "auto",
              py: 2,
              pb: 5,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: 400,
              maxWidth: "100%",
              mx: "auto",
              borderRadius: "sm",
              "& form": {
                display: "flex",
                flexDirection: "column",
                gap: 2,
              },
              [`& .MuiFormLabel-asterisk`]: {
                visibility: "hidden",
              },
            }}
          >
            <Stack gap={4} sx={{ mb: 2 }}>
              <Stack gap={1}>
                <Typography component="h1" level="h3">
                  {getMessage(
                    isSignIn
                      ? "loginScreen.label.signIn"
                      : "loginScreen.label.signUp"
                  )}
                </Typography>
                <Typography level="body-sm">
                  {getMessage(
                    isSignIn
                      ? "loginScreen.subheading.signIn"
                      : "loginScreen.subheading.signUp"
                  )}
                  <Link onClick={() => setIsSignIn(!isSignIn)}>
                    {getMessage(
                      isSignIn
                        ? "loginScreen.label.signUp"
                        : "loginScreen.label.signIn"
                    )}
                  </Link>
                </Typography>
              </Stack>
            </Stack>
            <Stack gap={4} sx={{ mt: 2 }}>
              <form onSubmit={isSignIn ? handleSignIn : handleSignUp}>
                <InputField
                  errorMessage={usernameError}
                  showPassword={true}
                  fieldName={getMessage("loginScreen.username")}
                  setField={setUsername}
                />
                <InputField
                  errorMessage={passwordError}
                  fieldName={getMessage("loginScreen.password")}
                  setField={setPassword}
                  setShowPassword={setShowPassword}
                  showPassword={showPassword}
                />
                {!isSignIn && (
                  <InputField
                    errorMessage={passwordError}
                    fieldName={getMessage("loginScreen.repeatPassword")}
                    setField={setRepeatPassword}
                    setShowPassword={setShowPassword}
                    showPassword={showPassword}
                  />
                )}
                <Stack gap={4} sx={{ mt: 2 }}>
                  <Button type="submit" fullWidth>
                    {getMessage(
                      isSignIn
                        ? "loginScreen.label.submitButton.signIn"
                        : "loginScreen.label.submitButton.signUp"
                    )}
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" textAlign="center">
              © {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          height: "100%",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: "50vw" },
          transition:
            "background-image var(--Transition-duration), left var(--Transition-duration) !important",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          backgroundColor: "background.level1",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${"/lightModeBackgroundImage.avif"})`,
          [theme.getColorSchemeSelector("dark")]: {
            backgroundImage: `url(${"/darkModeBackgroundImage.avif"})`,
          },
        })}
      />
      <Snackbar
        variant="solid"
        color="danger"
        autoHideDuration={5000}
        open={signInError !== ""}
        onClose={() => {
          setSignInError("");
        }}
      >
        {signInError}
      </Snackbar>
    </CssVarsProvider>
  );
}
