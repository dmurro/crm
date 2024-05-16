const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/users");
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Enable CORS
app.use(cors());
app.options("*", cors());

// Custom middleware to set headers
app.use((req, res, next) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS"); // Allow all HTTP methods
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // Allow specific headers

  // Set other custom headers
  res.setHeader("Custom-Header", "Custom Value");

  // Continue to the next middleware
  next();
});

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://dmurroni:Linkinpark93!@cluster0.lmwsi5s.mongodb.net/crm?retryWrites=true&w=majority&appName=Cluster0")
  /* .connect("mongodb+srv://dmurroni:Linkinpark93!@cluster0.lmwsi5s.mongodb.net/") */
  /* .connect("mongodb://localhost:27017/crm") */
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api", require("./routes/api"));

app.get("/", (req, res) => {
  res.json("Hello");
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    // Find user by username in the database
    const user = await User.findOne({ username });
    if (!user) throw new Error("User not found");
    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid password");
    // If the passwords match, send a success response
    res.json({ message: "Login successful" });
  } catch (error) {
    // If there's an error, send an error response
    res.status(401).json({ error: error.message });
  }
});

app.get("/clients", async (req, res) => {
  try {
    const clients = [];
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
