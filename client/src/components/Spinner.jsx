import { Box, CircularProgress, useTheme } from "@mui/material";

/**
 * Spinner component - Modern loading indicator
 * @param {Object} props
 * @param {boolean} props.fullScreen - If true, displays as full-screen overlay
 * @param {string} props.size - Size of spinner: 'small', 'medium', 'large' (default: 'medium')
 * @param {string} props.color - Color variant: 'primary', 'secondary' (default: 'primary')
 * @param {string} props.message - Optional loading message to display below spinner
 */
const Spinner = ({ fullScreen = false, size = "medium", color = "primary", message }) => {
  const theme = useTheme();

  const sizeMap = {
    small: 24,
    medium: 40,
    large: 56,
  };

  const spinnerSize = sizeMap[size] || sizeMap.medium;

  const spinnerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <CircularProgress
        size={spinnerSize}
        thickness={4}
        sx={{
          color: color === "primary" ? theme.palette.primary.main : theme.palette.secondary.main,
          animationDuration: "1.2s",
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
        }}
      />
      {message && (
        <Box
          component="span"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "0.875rem",
            fontWeight: 400,
            textAlign: "center",
          }}
        >
          {message}
        </Box>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.mode === "dark" ? "rgba(35, 35, 45, 0.9)" : "rgba(253, 245, 230, 0.9)",
          zIndex: theme.zIndex.modal,
          backdropFilter: "blur(4px)",
        }}
      >
        {spinnerContent}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
        minHeight: fullScreen ? "100vh" : "auto",
      }}
    >
      {spinnerContent}
    </Box>
  );
};

export default Spinner;
