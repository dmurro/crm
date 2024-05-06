import { useEffect, useState } from "react";

function App() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    // Function to fetch clients from the backend
    async function fetchClients() {
      try {
        const response = await fetch("http://localhost:5000/api/clients"); // Assuming your backend is running on the same host as your frontend
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const clientsData = await response.json();
        setClients(clientsData);
      } catch (error) {
        console.error("Error fetching clients from backend:", error);
      }
    }

    fetchClients(); // Call the function to fetch clients when the component mounts
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  const sendEmail = async () => {
    try {
      const response = await fetch("https://crm-three-green.vercel.app/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "davi.murroni@gmail.com",
          subject: "Test email",
          html: "<h1>This is a test email</h1>",
        }),
      });

      if (response.ok) {
        alert("Email sent successfully");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send email");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const backendURL = "http://localhost:5000/api";
  /* const backendURL = "https://crm-three-green.vercel.app"; */

  async function fetchClients() {
    try {
      const response = await fetch(`${backendURL}/clients`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log(response);
      const clients = await response.json(); // Parse response body as JSON
      console.log("Clients:", clients); // Log the fetched clients
      setClients(clients); // Set clients state with the fetched data
    } catch (error) {
      console.error("Error fetching clients from backend:", error);
    }
  }

  return (
    <>
      <div className="App">
        <h1>Send Email</h1>
        <button onClick={sendEmail}>Send Email</button>
        <button onClick={fetchClients}>getClients</button>
      </div>
      <div>
        <h2>Clients List</h2>
        <ul>
          {clients.map((client, index) => (
            <li key={index}>
              <strong>
                {client.FIRSTNAME} {client.LASTNAME}
              </strong>{" "}
              - {client.EMAIL}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
