import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";

import Sidebar from "./Common/Sidebar";
import Header from "./Common/Header";
import HeadingArea from "./Common/HeadingArea";
import { useAppSelector } from "./hooks";
import Calendar from "./Calendar/Calendar";

export default function App() {
  const currentPage = useAppSelector((state) => state.currentPage.value);

  const getPage = (page: string) => {
    switch (page) {
      case "calendar":
        return <Calendar />;
      case "trainingSchedule":
        return <Calendar />;
      case "chats":
        return <Calendar />;
      case "exercises":
        return <Calendar />;
      case "help":
        return <Calendar />;
      case "about":
        return <Calendar />;
      default:
        return <Calendar />;
    }
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Header />
        <Sidebar />
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
          }}
        >
          <HeadingArea />
          {getPage(currentPage)}
        </Box>
      </Box>
    </>
  );
}
