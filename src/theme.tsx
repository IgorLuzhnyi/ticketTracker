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
  typography: {
    fontFamily: "Poppins, sans-serif",
    h1: { fontSize: 36 },
    h2: { fontSize: 30 },
    h3: { fontSize: 26 },
    h4: { fontSize: 22 },
    h5: { fontSize: 18 },
    h6: { fontSize: 14 },
  },
  components: {
    MuiTouchRipple: {
      styleOverrides: {
        ripple: {
          display: "none",
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#77D4FC",
      light: "#80e5ff",
    },
    secondary: {
      main: "#aaadad",
      light: "#F7F8FC",
      dark: "#3a3a3b",
    },
    info: {
      main: "#F7F8FC",
      light: "#FFFEFE",
    },
    success: {
      main: "#2E7D32",
    },
  },
});
