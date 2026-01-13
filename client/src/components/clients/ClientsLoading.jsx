import { Box, CircularProgress, Typography } from "@mui/material";
import Spinner from "../Spinner";

const ClientsLoading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "400px",
        width: "100%",
      }}
    >
      <Spinner size="large" message="Loading clients..." />
    </Box>
  );
};

export default ClientsLoading;
