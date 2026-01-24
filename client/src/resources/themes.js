// src/resources/themes.js
import { createTheme } from "@mui/material/styles";

export const themeOptionsLight = {
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb", // Professional deep blue
      light: "#60a5fa",
      dark: "#1e40af",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#8b5cf6", // Modern vibrant purple
      light: "#a78bfa",
      dark: "#6d28d9",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fafc", // Clean soft gray
      paper: "#ffffff", // Pure white
    },
    text: {
      primary: "#1e293b", // Deep slate
      secondary: "#64748b", // Medium slate
    },
    error: {
      main: "#ef4444", // Modern red
      light: "#fca5a5",
      dark: "#dc2626",
    },
    warning: {
      main: "#f59e0b", // Amber
      light: "#fbbf24",
      dark: "#d97706",
    },
    info: {
      main: "#0ea5e9", // Sky blue
      light: "#38bdf8",
      dark: "#0284c7",
    },
    success: {
      main: "#10b981", // Emerald green
      light: "#34d399",
      dark: "#059669",
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
          backgroundColor: "#2563eb", // Deep blue
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#2563eb", // Deep blue
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
      main: "#0ea5e9", // Bright cyan-blue
      light: "#38bdf8",
      dark: "#0284c7",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#a78bfa", // Vibrant purple
      light: "#c4b5fd",
      dark: "#7c3aed",
      contrastText: "#ffffff",
    },
    background: {
      default: "#0f172a", // Deep slate
      paper: "#1e293b", // Lighter slate
    },
    text: {
      primary: "#f1f5f9", // Light slate
      secondary: "#cbd5e1", // Medium slate
    },
    error: {
      main: "#ef4444", // Modern red
      light: "#fca5a5",
      dark: "#dc2626",
    },
    warning: {
      main: "#f59e0b", // Amber
      light: "#fbbf24",
      dark: "#d97706",
    },
    info: {
      main: "#0ea5e9", // Sky blue
      light: "#38bdf8",
      dark: "#0284c7",
    },
    success: {
      main: "#10b981", // Emerald green
      light: "#34d399",
      dark: "#059669",
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
            backgroundColor: "#0ea5e9", // Bright cyan-blue
          },
        },
      },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#0ea5e9", // Bright cyan-blue
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
