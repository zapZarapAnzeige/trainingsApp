import React, { ReactNode, useEffect } from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";

import Sidebar from "./Common/Sidebar";
import Header from "./Common/Header";
import HeadingArea from "./Common/HeadingArea";
import { useAppDispatch, useAppSelector } from "./hooks";
import Calendar from "./pages/Calendar/Calendar";
import { ApiErrorInterceptor } from "./Provider/ApiErrorInterceptor";
import { useDispatch } from "react-redux";
import { Chat } from "./pages/Chat/Chat";
import { WebSocketProvider } from "./Provider/WebSocketProvider";
import { useAuthHeader, useIsAuthenticated } from "react-auth-kit";
import { Navigate } from "react-router-dom";
import { getUserData } from "./api";
import { changeUser } from "./redux/reducers/userSlice";
import TrainingSchedule from "./pages/TrainingSchedule/TrainingSchedule";
import Exercises from "./pages/Exercises/Exercises";
import { Profile } from "./pages/Profile/Profile";
import Help from "./pages/Help/Help";
import About from "./pages/About/About";

export default function App() {
  const currentPage = useAppSelector((state) => state.currentPage.value);
  const userData = useAppSelector((state) => state.user.value);
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthHeader();
  const dispatch = useAppDispatch();

  type RequireAuthProps = {
    children: ReactNode;
  };
  const RequireAuth = (props: RequireAuthProps) => {
    const { children } = props;
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }

    return <>{children}</>;
  };

  useEffect(() => {
    if (isAuthenticated() && userData.id < 0) {
      getUserData(auth()).then((res) => {
        dispatch(
          changeUser({
            id: res.data.user_id,
            name: res.data.user_name,
            searchingForPartner: res.data.searching_for_partner,
            plz: res.data.plz,
            profilePicture: res.data.profile_picture,
            bio: res.data.bio,
            nickname: res.data.nickname,
          })
        );
      });
    }
  }, []);

  const getPage = (page: string): JSX.Element => {
    switch (page) {
      case "calendar":
        return <Calendar />;
      case "trainingSchedule":
        return <TrainingSchedule />;
      case "chats":
        return (
          <WebSocketProvider>
            <Chat />
          </WebSocketProvider>
        );
      case "exercises":
        return <Exercises />;
      case "tips":
        return <Help />;
      case "about":
        return <About />;
      case "user":
        return <Profile userData={userData} />;
      default:
        return <Calendar />;
    }
  };

  return (
    <RequireAuth>
      <ApiErrorInterceptor />
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Sidebar />
        <Header />
        {currentPage === "chats" ? (
          <>{getPage(currentPage)}</>
        ) : (
          <Box
            component="main"
            className="MainContent"
            sx={{
              px: { xs: 2, md: 6 },
              pt: {
                xs: "calc(12px + var(--Header-height))",
                sm: "calc(12px + var(--Header-height))",
                md: 3,
              },
              pb: { xs: 2, sm: 2, md: 3 },
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              height: "100dvh",
              gap: 1,
              overflow: "auto",
            }}
          >
            {getPage(currentPage)}
          </Box>
        )}
      </Box>
    </RequireAuth>
  );
}
