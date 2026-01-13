import { Box, Alert, AlertTitle } from "@mui/material";

const ClientsError = ({ error }) => {
  return (
    <Box
      p={{ xs: 1, sm: 2 }}
      sx={{
        width: "100%",
      }}
    >
      <Alert severity="error">
        <AlertTitle>Error Loading Clients</AlertTitle>
        {error?.response?.data?.error || error?.message || "Failed to load clients. Please try again later."}
      </Alert>
    </Box>
  );
};

export default ClientsError;
