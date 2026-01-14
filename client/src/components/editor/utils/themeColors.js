/**
 * Theme colors for GrapesJS editor components
 * Integrates with the app's theme system
 */

export const themeColors = {
  primary: "#ff7043",
  primaryLight: "#ff94c2",
  primaryDark: "#b0006b",
  secondary: "#f50057",
  secondaryLight: "#ff5983",
  secondaryDark: "#bb002f",
  background: {
    light: "#fdf5e6",
    dark: "#23232d",
  },
  text: {
    light: {
      primary: "#333333",
      secondary: "#666666",
    },
    dark: {
      primary: "#ffffff",
      secondary: "#bbbbbb",
    },
  },
  // Additional useful colors
  white: "#ffffff",
  black: "#000000",
  gray: {
    light: "#f5f5f5",
    medium: "#cccccc",
    dark: "#666666",
  },
  success: "#4caf50",
  warning: "#ff9800",
  error: "#f44336",
  info: "#2196f3",
};

/**
 * Get default color based on component type
 */
export const getDefaultColor = (type = "primary") => {
  return themeColors[type] || themeColors.primary;
};

/**
 * Get color palette for color picker
 */
export const getColorPalette = () => {
  return [
    themeColors.primary,
    themeColors.secondary,
    themeColors.primaryLight,
    themeColors.secondaryLight,
    themeColors.white,
    themeColors.black,
    themeColors.gray.dark,
    themeColors.success,
    themeColors.warning,
    themeColors.error,
    themeColors.info,
  ];
};
