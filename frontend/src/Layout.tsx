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

import { extendTheme } from "@mui/joy/styles";
import { ColorSystemOptions } from "@mui/joy/styles/extendTheme";

const primaryPalette: ColorSystemOptions = {
  palette: {
    primary: {
      50: "#ddedc9",
      100: "#ddedc9",
      200: "#ddedc9",
      300: "#438d3f",
      400: "#438d3f",
      500: "#438d3f",
      600: "#438d3f",
      700: "#438d3f",
      800: "#245D23",
      900: "#245D23",
      solidBg: "#388E3C",
      solidHoverBg: "#388E3C",
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
