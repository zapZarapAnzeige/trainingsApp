import { FC } from "react";
import App from "./App";
import { CssVarsProvider } from "@mui/joy";
import { Provider } from "react-redux";

import { store } from "./redux/store";
import LocalizationProvider from "./messages/LocalizationProvider";
import { getBrowserLocales } from "./messages/tools";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { Login } from "./Login/Login";
import { AuthProvider } from "react-auth-kit";

import { CssVarsThemeOptions, extendTheme } from "@mui/joy/styles";
import { ColorSystemOptions } from "@mui/joy/styles/extendTheme";

const primaryPalette: ColorSystemOptions = {
  palette: {
    primary: {
      50: "#E8F5E9",
      100: "#C8E6C9",
      200: "#A5D6A7",
      300: "#81C784",
      400: "#66BB6A",
      500: "#4CAF50",
      600: "#43A047",
      700: "#388E3C",
      800: "#2E7D32",
      900: "#1B5E20",
      solidBg: "#388E3C",
      solidHoverBg: "#66BB6A",
      solidActiveBg: "#2E7D32",
    },
  },
};

export const theme = extendTheme({
  colorSchemes: {
    dark: primaryPalette,
    light: primaryPalette,
  },
});

export const Layout: FC = () => {
  return (
    <AuthProvider
      authType={"cookie"}
      authName={"_auth"}
      cookieDomain={window.location.hostname}
      cookieSecure={window.location.protocol === "https:"}
    >
      <CssVarsProvider disableTransitionOnChange theme={theme}>
        <Provider store={store}>
          <LocalizationProvider
            locale={getBrowserLocales({ languageCodeOnly: true })}
          >
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<App />} />
              </Routes>
            </Router>
          </LocalizationProvider>
        </Provider>
      </CssVarsProvider>
    </AuthProvider>
  );
};
