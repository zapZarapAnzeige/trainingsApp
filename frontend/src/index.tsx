import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { CssVarsProvider } from "@mui/joy";
import { Provider } from "react-redux";
import AuthProvider from "react-auth-kit";
import { store } from "./redux/store";
import LocalizationProvider from "./messages/LocalizationProvider";
import { getBrowserLocales } from "./messages/tools";
import createStore from "react-auth-kit/createStore";
import { ApiErrorInterceptor } from "./Provider/ApiErrorInterceptor";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider
      store={createStore({
        authType: "cookie",
        authName: "_auth",
        cookieDomain: window.location.hostname,
        cookieSecure: true,
      })}
    >
      <Provider store={store}>
        <CssVarsProvider disableTransitionOnChange>
          <LocalizationProvider
            locale={getBrowserLocales({ languageCodeOnly: true })}
          >
            <App />
          </LocalizationProvider>
        </CssVarsProvider>
      </Provider>
    </AuthProvider>
  </React.StrictMode>
);
