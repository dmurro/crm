// src/resources/themes.js
import { createTheme } from "@mui/material/styles";

export const themeOptionsLight = {
  palette: {
    mode: "light",
    primary: {
      main: "#ff7043", // Pink
      light: "#ff94c2",
      dark: "#b0006b",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f50057", // Red
      light: "#ff5983",
      dark: "#bb002f",
      contrastText: "#ffffff",
    },
    background: {
      default: "#fdf5e6", // Seashell
      paper: "#ffffff", // White
    },
    text: {
      primary: "#333333", // Dark Gray
      secondary: "#666666", // Medium Gray
    },
    error: {
      main: "#f44336", // Red
    },
    warning: {
      main: "#ff9800", // Orange
    },
    info: {
      main: "#2196f3", // Blue
    },
    success: {
      main: "#4caf50", // Green
    },
  },
  typography: {
    fontFamily: "Prompt, Arial, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 700,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 700,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 700,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 700,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
    },
  },
  spacing: 8, // Default spacing of 8px
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          padding: "8px 16px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ff7043", // Indigo
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: "16px",
          borderRadius: "12px",
        },
      },
    },
  },
};

export const themeOptionsDark = {
  palette: {
    mode: "dark",
    primary: {
      main: "#ff7043", // Pink
      light: "#ff94c2",
      dark: "#b0006b",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f50057", // Red
      light: "#ff5983",
      dark: "#bb002f",
      contrastText: "#ffffff",
    },
    background: {
      default: "#23232d", // Dark
      paper: "#1d1d1d", // Slightly lighter dark
    },
    text: {
      primary: "#ffffff", // White
      secondary: "#bbbbbb", // Light gray
    },
    error: {
      main: "#f44336", // Red
    },
    warning: {
      main: "#ff9800", // Orange
    },
    info: {
      main: "#2196f3", // Blue
    },
    success: {
      main: "#4caf50", // Green
    },
  },
  typography: {
    fontFamily: "Prompt, Arial, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 700,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 700,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 700,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 700,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
    },
  },
  spacing: 8, // Default spacing of 8px
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          padding: "8px 16px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ff7043", // Indigo
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: "16px",
          borderRadius: "12px",
        },
      },
    },
  },
};

// Create the themes
const lightTheme = createTheme(themeOptionsLight);
const darkTheme = createTheme(themeOptionsDark);

export { lightTheme, darkTheme };
