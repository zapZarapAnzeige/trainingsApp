import { createTheme } from "@mui/material/styles";

export const customTheme = createTheme({
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          backgroundColor: theme.palette.primary.main,
          zIndex: theme.zIndex.drawer + 1,
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          zIndex: theme.zIndex.drawer + 2,
        }),
      },
    },
  },

  typography: {
    allVariants: {
      color: "#fff",
    },
  },

  palette: {
    mode: "dark",
    error: { main: "#f44336", light: "#EE2E4A" },
    primary: {
      main: "#172026",
      light: "#5FCDD9",
    },
    secondary: {
      main: "#7cc0d8",
      light: "#04BFAD",
      "100": "#04BF9D",
    },
    common: {
      white: "#fff",
    },
    grey: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
      A100: "#f5f5f5",
      A200: "#eeeeee",
      A400: "#bdbdbd",
      A700: "#616161",
    },
  },
});
