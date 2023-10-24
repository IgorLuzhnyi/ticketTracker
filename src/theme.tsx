import { createTheme } from "@mui/material";

export const theme = createTheme({
  breakpoints: {
    values: {
      xl: 1920,
      lg: 1280,
      md: 960,
      sm: 600,
      xs: 0,
    },
  },
  components: {
    MuiTouchRipple: {
      styleOverrides: {
        ripple: {
          display: "none",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#8f9394", // secondary.light
          },
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#f2f5fa",
      light: "#fafcff",
    },
    secondary: {
      main: "#3a3a3b",
      light: "#8f9394",
    },
    info: {
      main: "#7ccee3",
      light: "#e6eff3",
    },
  },
  typography: {},
});
