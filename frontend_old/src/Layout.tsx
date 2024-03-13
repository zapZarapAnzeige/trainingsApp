import { Box } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";

import { useDispatch } from "react-redux";
import { useIsAuthenticated } from "react-auth-kit";
import { Navigate } from "react-router-dom";
import { ApiErrorInterceptor } from "./Provider/ApiErrorInterceptor";
import { Header } from "./Header/Header";
import { ActiveChat } from "./Chat/ActiveChat";
import { WebSocketProvider } from "./Provider/WebSocketProvider";

export const Layout: React.FC = () => {
  type RequireAuthProps = {
    children: ReactNode;
  };
  const RequireAuth = (props: RequireAuthProps) => {
    const isAuthenticated = useIsAuthenticated();
    const { children } = props;
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }

    return <>{children}</>;
  };

  return (
    <RequireAuth>
      <ApiErrorInterceptor />
      <WebSocketProvider>
        <Box minHeight={"100vh"}>
          <ActiveChat />
        </Box>
      </WebSocketProvider>
    </RequireAuth>
  );
};
