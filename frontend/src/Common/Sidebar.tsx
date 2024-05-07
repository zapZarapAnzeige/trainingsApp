import React from "react";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import BrightnessAutoRoundedIcon from "@mui/icons-material/BrightnessAutoRounded";

// Icons for sidebar
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import SportsMmaIcon from "@mui/icons-material/SportsMma";
import HelpIcon from "@mui/icons-material/Help";
import InfoIcon from "@mui/icons-material/Info";

import { changePage } from "../redux/reducers/currentPageSlice";

import ColorSchemeToggle from "./ColorSchemeToggle";
import { closeSidebar, getPageName } from "../utils";
import { useAppSelector, useAppDispatch } from "../hooks";
import { ProfilePicture } from "./ProfilePicture";
import { useSignOut } from "react-auth-kit";

export default function Sidebar() {
  const currentPage = useAppSelector((state) => state.currentPage.value);
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user.value);
  const logout = useSignOut();

  const isSelected = (page: string) => page === currentPage;
  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: "fixed", md: "sticky" },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "220px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "240px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <IconButton variant="soft" color="primary" size="sm">
          <BrightnessAutoRoundedIcon />
        </IconButton>
        <Typography level="title-lg">Fitness App</Typography>
        <ColorSchemeToggle sx={{ ml: "auto" }} />
      </Box>
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
          }}
        >
          <ListItem>
            <ListItemButton
              onClick={() => dispatch(changePage("calendar"))}
              selected={isSelected("calendar")}
            >
              <HomeRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">
                  {getPageName("calendar")}
                </Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              onClick={() => dispatch(changePage("trainingSchedule"))}
              selected={isSelected("trainingSchedule")}
            >
              <FitnessCenterIcon />
              <ListItemContent>
                <Typography level="title-sm">
                  {getPageName("trainingSchedule")}
                </Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              onClick={() => dispatch(changePage("chats"))}
              selected={isSelected("chats")}
            >
              <QuestionAnswerRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">{getPageName("chats")}</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              onClick={() => dispatch(changePage("exercises"))}
              selected={isSelected("exercises")}
            >
              <SportsMmaIcon />
              <ListItemContent>
                <Typography level="title-sm">
                  {getPageName("exercises")}
                </Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              onClick={() => dispatch(changePage("help"))}
              selected={isSelected("help")}
            >
              <HelpIcon />
              <ListItemContent>
                <Typography level="title-sm">{getPageName("help")}</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              onClick={() => dispatch(changePage("about"))}
              selected={isSelected("about")}
            >
              <InfoIcon />
              <ListItemContent>
                <Typography level="title-sm">{getPageName("about")}</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <IconButton
          onClick={() => {
            dispatch(changePage("user"));
            console.log("here");
          }}
        >
          <ProfilePicture
            base64ProfilePicture={userData.profilePicture}
            partnerName={userData.name}
          />
        </IconButton>
        <Box
          sx={{ minWidth: 0, flex: 1 }}
          onClick={() => dispatch(changePage("profile"))}
        >
          <Typography level="title-sm">{userData.name}</Typography>
          <Typography level="body-xs">{userData.nickname}</Typography>
        </Box>
        <IconButton size="sm" variant="plain" color="neutral" onClick={logout}>
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>
  );
}
