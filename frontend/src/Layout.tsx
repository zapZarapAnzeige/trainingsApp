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

export const Layout: FC = () => {
  const primaryPalette = {
    primary: {
      solidBg: "#438d3f",
      solidHoverBg: "#3b7e37",
      solidActiveBg: "#336f2f",
    },
  };
  const theme = extendTheme({
    colorSchemes: {
      dark: {
        palette: primaryPalette,
      },
      light: {
        palette: primaryPalette,
      },
    },
  });

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
