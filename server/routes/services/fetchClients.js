const mongoose = require("mongoose");

// Define MongoDB connection string and database name
const mongoURI = "mongodb+srv://dmurroni:Linkinpark93!@cluster0.lmwsi5s.mongodb.net/crm?retryWrites=true&w=majority&appName=Cluster0";
/* const mongoURI = "mongodb+srv://dmurroni:Linkinpark93!@cluster0.lmwsi5s.mongodb.net/"; */

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define User model
const Client = mongoose.model("Client", {});

// Function to fetch clients from MongoDB
async function fetchClients() {
  try {
    const clients = await Client.find();
    console.log(clients);
    return clients;
  } catch (error) {
    console.error("Error fetching users from MongoDB:", error);
    throw error;
  }
}

module.exports = { fetchClients };
