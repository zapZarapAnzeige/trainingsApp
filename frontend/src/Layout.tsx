import { FC } from "react";
import App from "./App";
import { CssVarsProvider } from "@mui/joy";
import { Provider } from "react-redux";

import { store } from "./redux/store";
import LocalizationProvider from "./messages/LocalizationProvider";
import { getBrowserLocales } from "./messages/tools";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Login from "./Login/Login";
import { AuthProvider } from "react-auth-kit";
import { ErrorDialogProvider } from "./Provider/ErrorDialogProvider";

export const Layout: FC = () => {
  return (
    <AuthProvider
      authType={"cookie"}
      authName={"_auth"}
      cookieDomain={window.location.hostname}
      cookieSecure={window.location.protocol === "https:"}
    >
      <CssVarsProvider disableTransitionOnChange>
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
