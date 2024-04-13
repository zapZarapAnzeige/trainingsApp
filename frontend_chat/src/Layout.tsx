import { Box } from "@mui/material";
import { ReactNode, useEffect } from "react";

import { useAuthHeader, useIsAuthenticated } from "react-auth-kit";
import { Navigate } from "react-router-dom";
import { ApiErrorInterceptor } from "./Provider/ApiErrorInterceptor";
import { WebSocketProvider } from "./Provider/WebSocketProvider";
import { getUserData } from "../../frontend/src/api";
import { useDispatch } from "react-redux";
import { setUserData } from "./Redux/actions";
import { Chat } from "./Chat/Chat";

export const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const auth = useAuthHeader();
  useEffect(() => {
    getUserData(auth()).then((res) => {
      dispatch(setUserData({ id: res.data.user_id, name: res.data.user_name }));
    });
  }, []);

  return (
    <RequireAuth>
      <ApiErrorInterceptor />
      <WebSocketProvider>
        <Box minHeight={"100vh"}>
          <Chat />
        </Box>
      </WebSocketProvider>
    </RequireAuth>
  );
};
