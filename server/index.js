// dotenv is loaded in config/index.js with explicit path
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const config = require("./config");
const loginRouter = require("./routes/login");
const clientsRouter = require("./routes/clients");
const emailRouter = require("./routes/email");

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// CORS configuration
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

// Rate limiting for login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Connect to MongoDB
mongoose
  .connect(config.mongodbUri)
  .then(() => console.log(`MongoDB connected (${config.env} environment)`))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.get("/", (req, res) => {
  res.json({ message: "CRM API", environment: config.env });
});

// Mount routers
app.use("/login", loginLimiter, loginRouter);
app.use("/clients", clientsRouter);
app.use("/email", emailRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: config.isDevelopment ? err.message : "Internal server error",
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (${config.env} environment)`);
});

module.exports = app;
