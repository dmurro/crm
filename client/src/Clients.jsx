import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";

function Clients() {
  const [clients, setClients] = useState([]);

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
            {clients.map((client) => (
              <TableRow key={client.CONTACT_ID}>
                {columns.map((column) => (
                  <TableCell key={column.id}>{column.format ? column.format(client[column.id]) : client[column.id]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Clients;
