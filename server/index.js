const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const loginRouter = require("./routes/login");
const clientsRouter = require("./routes/clients");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(bodyParser.json());

app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://dmurroni:Linkinpark93!@cluster0.lmwsi5s.mongodb.net/crm?retryWrites=true&w=majority&appName=Cluster0")
  /* .connect("mongodb://localhost:27017/crm") */
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.get("/", (req, res) => {
  res.json("Hello");
});

// Mount routers
app.use("/login", loginRouter);
app.use("/clients", clientsRouter);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
