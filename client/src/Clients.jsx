import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TablePagination } from "@mui/material";
import { useEffect, useState } from "react";

function Clients() {
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await fetch("https://crm-three-green.vercel.app/clients");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const clientsData = await response.json();
        setClients(clientsData);
      } catch (error) {
        console.error("Error fetching clients from backend:", error);
      }
    }
    fetchClients();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const columns = [
    { id: "CONTACT_ID", label: "Contact ID" },
    { id: "EMAIL", label: "Email" },
    { id: "LASTNAME", label: "Last Name" },
    { id: "FIRSTNAME", label: "First Name" },
    { id: "SMS", label: "SMS" },
    { id: "DOUBLE_OPT_IN", label: "Double Opt-In" },
    { id: "OPT_IN", label: "Opt-In" },
    { id: "WHATSAPP", label: "WhatsApp" },
    { id: "LANDLINE_NUMBER", label: "Landline Number" },
    { id: "ADDED_TIME", label: "Added Time", format: (date) => new Date(date).toLocaleDateString() },
    { id: "MODIFIED_TIME", label: "Modified Time", format: (date) => new Date(date).toLocaleDateString() },
  ];

  return (
    <Box p={2}>
      <Typography variant="h3" align="center" gutterBottom>
        CLIENTS
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((client) => (
              <TableRow key={client.CONTACT_ID}>
                {columns.map((column) => (
                  <TableCell key={column.id}>{column.format ? column.format(client[column.id]) : client[column.id]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[15, 25, 50]}
        component="div"
        count={clients.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}

export default Clients;
