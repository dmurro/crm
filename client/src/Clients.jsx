import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useClients } from "./services/queries";
import { useClientsPagination } from "./components/clients/useClientsPagination";
import ClientsTable from "./components/clients/ClientsTable";
import ClientsCard from "./components/clients/ClientsCard";
import ClientsLoading from "./components/clients/ClientsLoading";
import ClientsError from "./components/clients/ClientsError";

function Clients() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { data: clients = [], isLoading, error } = useClients();
  console.log(clients);

  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, getPaginatedData } = useClientsPagination(8);

  const paginatedClients = getPaginatedData(clients);

  if (isLoading) {
    return <ClientsLoading />;
  }

  if (error) {
    return <ClientsError error={error} />;
  }

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        p: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          mb: { xs: 2, sm: 3 },
          fontWeight: 700,
        }}
      >
        CLIENTS
      </Typography>

      {isMobile ? (
        <ClientsCard clients={paginatedClients} totalCount={clients.length} page={page} rowsPerPage={rowsPerPage} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
      ) : (
        <ClientsTable clients={paginatedClients} totalCount={clients.length} page={page} rowsPerPage={rowsPerPage} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
      )}

      {clients.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            color: "text.secondary",
          }}
        >
          <Typography variant="h6">No clients found</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            There are no clients to display at this time.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default Clients;
