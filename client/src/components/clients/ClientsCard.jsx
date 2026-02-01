import { Card, CardContent, Typography, Box, Divider, TablePagination } from "@mui/material";
import { clientColumns, priorityColumns } from "./clientsColumns";

const ClientsCard = ({ clients, totalCount, page, rowsPerPage, onPageChange, onRowsPerPageChange }) => {

  const getColumnLabel = (columnId) => {
    const column = clientColumns.find((col) => col.id === columnId);
    return column ? column.label : columnId;
  };

  const formatValue = (columnId, value) => {
    const column = clientColumns.find((col) => col.id === columnId);
    return column?.format ? column.format(value) : value || "N/A";
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {clients.map((client) => (
          <Card
            key={client?._id}
            sx={{
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
                transform: "translateY(-2px)",
                transition: "all 0.2s ease-in-out",
              },
            }}
          >
            <CardContent>
              {/* Priority fields at the top */}
              <Box sx={{ mb: 2 }}>
                {priorityColumns.map((columnId) => (
                  <Box key={columnId} sx={{ mb: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: "text.secondary",
                        fontSize: "0.7rem",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {getColumnLabel(columnId)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.875rem",
                        wordBreak: "break-word",
                      }}
                    >
                      {formatValue(client, columnId)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 1.5 }} />

              {/* Other fields */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 1.5,
                }}
              >
                {clientColumns
                  .filter((col) => !priorityColumns.includes(col.id))
                  .map((column) => (
                    <Box key={column.id}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: "text.secondary",
                          fontSize: "0.65rem",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          display: "block",
                        }}
                      >
                        {column.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "0.8rem",
                          wordBreak: "break-word",
                        }}
                      >
                        {formatValue(column.id, client[column.id])}
                      </Typography>
                    </Box>
                  ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 25]}
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
            padding: { xs: 1, sm: 2 },
          },
          "& .MuiTablePagination-selectLabel": {
            fontSize: "0.75rem",
          },
          "& .MuiTablePagination-displayedRows": {
            fontSize: "0.75rem",
          },
        }}
      />
    </>
  );
};

export default ClientsCard;
