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

// Enable CORS
const corsOptions = {
  origin: "*", // or specific origin
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options("/*", (_, res) => {
  res.sendStatus(200);
});

// Custom middleware to set headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Custom-Header", "Custom Value");
  next();
});

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/crm")
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
