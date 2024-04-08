import { ThemeProvider } from "@emotion/react";
import { AuthProvider } from "react-auth-kit";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./Layout";
import { LoginScreen } from "./Authentication/LoginScreen";
import LocalizationProvider from "./messages/LocalizationProvider";
import { getBrowserLocales } from "./messages/tools";
import store from "./Redux/store";
import { customTheme } from "./Theme/theme";
import { ErrorDialogProvider } from "./Provider/ErrorDialogProvider";
import { CssVarsProvider } from "@mui/joy";

export const App: React.FC = () => {
  return (
    <AuthProvider
      authType={"cookie"}
      authName={"_auth"}
      cookieDomain={window.location.hostname}
      cookieSecure={true}
    >
      <CssVarsProvider disableTransitionOnChange>
        <ThemeProvider theme={customTheme}>
          <Provider store={store}>
            <LocalizationProvider
              locale={getBrowserLocales({ languageCodeOnly: true })}
            >
              <ErrorDialogProvider>
                <Router>
                  <Routes>
                    <Route path="/login" element={<LoginScreen />} />
                    <Route path="/" element={<Layout />} />
                  </Routes>
                </Router>
              </ErrorDialogProvider>
            </LocalizationProvider>
          </Provider>
        </ThemeProvider>
      </CssVarsProvider>
    </AuthProvider>
  );
};
