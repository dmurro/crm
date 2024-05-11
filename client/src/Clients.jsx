import { Flex, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

function Clients() {
  const [clients, setClients] = useState([]);
  /* const backendURL = "http://localhost:5000"; */

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await axios.get("https://crm-three-green.vercel.app/api/clients");
        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const clientsData = response.data;
        setClients(clientsData);
      } catch (error) {
        console.error("Error fetching clients from backend:", error);
      }
    }
    fetchClients();
  }, []);

  const columns = [
    {
      title: "Contact ID",
      dataIndex: "CONTACT_ID",
      key: "CONTACT_ID",
    },
    {
      title: "Email",
      dataIndex: "EMAIL",
      key: "EMAIL",
    },
    {
      title: "Last Name",
      dataIndex: "LASTNAME",
      key: "LASTNAME",
    },
    {
      title: "First Name",
      dataIndex: "FIRSTNAME",
      key: "FIRSTNAME",
    },
    {
      title: "SMS",
      dataIndex: "SMS",
      key: "SMS",
    },
    {
      title: "Double Opt-In",
      dataIndex: "DOUBLE_OPT_IN",
      key: "DOUBLE_OPT_IN",
    },
    {
      title: "Opt-In",
      dataIndex: "OPT_IN",
      key: "OPT_IN",
    },
    {
      title: "WhatsApp",
      dataIndex: "WHATSAPP",
      key: "WHATSAPP",
    },
    {
      title: "Landline Number",
      dataIndex: "LANDLINE_NUMBER",
      key: "LANDLINE_NUMBER",
    },
    {
      title: "Added Time",
      dataIndex: "ADDED_TIME",
      key: "ADDED_TIME",
      render: (date) => <span>{new Date(date).toLocaleDateString()}</span>,
    },
    {
      title: "Modified Time",
      dataIndex: "MODIFIED_TIME",
      key: "MODIFIED_TIME",
      render: (date) => <span>{new Date(date).toLocaleDateString()}</span>,
    },
  ];

  return (
    <Flex justify="center" vertical style={{ width: "100%" }}>
      <h1>CLIENTS</h1>
      <Table style={{ width: "100%", maxHeight: "90%" }} columns={columns} dataSource={clients} />
    </Flex>
  );
}
export default Clients;
