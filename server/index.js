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
const usersRouter = require("./routes/users");

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// CORS configuration - Handle preflight requests
const allowedOrigins = config.corsOrigin
  ? config.corsOrigin.split(",").map((o) => o.trim())
  : config.isDevelopment
  ? ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]
  : ["https://admin.fishplanetlondon.co.uk"];

console.log(`CORS allowed origins: ${allowedOrigins.join(", ")}`);
console.log(`Environment: ${config.env}`);

const corsOptions = {
  origin: function (origin, callback) {
    // In development, allow requests with no origin (for testing with Postman, curl, etc.)
    if (config.isDevelopment && !origin) {
      console.log("CORS: Request with no origin, allowing (development mode)");
      return callback(null, true);
    }

    // In production, require origin
    if (!origin) {
      if (config.isProduction) {
        console.log("CORS: Request with no origin rejected (production mode)");
        return callback(new Error("CORS: Origin required in production"));
      }
      return callback(null, true);
    }

    console.log(`CORS: Checking origin: ${origin}`);

    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
      console.log(`CORS: Origin ${origin} allowed`);
      callback(null, true);
    } else {
      console.log(`CORS: Origin ${origin} NOT allowed. Allowed origins: ${allowedOrigins.join(", ")}`);
      callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  exposedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Handle preflight requests explicitly
app.options("*", cors(corsOptions));

// Apply CORS to all routes
app.use(cors(corsOptions));

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
app.use("/users", usersRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  console.error(err.stack);

  // Handle CORS errors
  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({
      message: err.message,
      error: "CORS policy violation",
    });
  }

  res.status(err.status || 500).json({
    message: config.isDevelopment ? err.message : "Internal server error",
  });
});

// Start server only in development (not in Vercel serverless)
if (config.isDevelopment) {
  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (${config.env} environment)`);
  });
} else {
  // In production (Vercel), the server is handled by serverless functions
  console.log("Server configured for Vercel serverless (production mode)");
}

module.exports = app;
