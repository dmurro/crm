import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, useTheme, useMediaQuery } from "@mui/material";
import { clientColumns } from "./clientsColumns";

const ClientsTable = ({ clients, totalCount, page, rowsPerPage, onPageChange, onRowsPerPageChange }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          boxShadow: 2,
        }}
      >
        <TableContainer
          sx={{
            maxHeight: { xs: "60vh", sm: "65vh", md: "70vh" },
            overflowX: "auto",
            "&::-webkit-scrollbar": {
              height: 8,
              width: 8,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "rgba(0,0,0,0.05)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: 4,
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.3)",
              },
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {clientColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{
                      fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
                      whiteSpace: "nowrap",
                      fontWeight: 600,
                      backgroundColor: (theme) => (theme.palette.primary.main),
                      color: (theme) => (theme.palette.primary.contrastText),
                      padding: { xs: "8px 4px", sm: "12px 8px", md: "16px" },
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow
                  key={client.CONTACT_ID}
                  sx={{
                    "&:hover": {
                      backgroundColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)"),
                    },
                    "&:nth-of-type(even)": {
                      backgroundColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)"),
                    },
                  }}
                >
                  {clientColumns.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{
                        fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
                        padding: { xs: "8px 4px", sm: "12px 8px", md: "16px" },
                        maxWidth: { xs: "100px", sm: "150px", md: "200px" },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: isSmallScreen ? "nowrap" : "normal",
                      }}
                      title={client[column.id]}
                    >
                      {column.format ? column.format(client[column.id]) : client[column.id] || "N/A"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        sx={{
          "& .MuiTablePagination-toolbar": {
            flexWrap: "wrap",
            gap: 1,
          },
          "& .MuiTablePagination-selectLabel": {
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
          },
          "& .MuiTablePagination-displayedRows": {
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
          },
        }}
      />
    </>
  );
};

export default ClientsTable;
