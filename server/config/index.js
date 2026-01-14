const path = require("path");

// Load .env file from server directory
const envPath = path.join(__dirname, "..", ".env");
require("dotenv").config({ path: envPath });

const env = process.env.NODE_ENV || "development";

const config = {
  development: {
    mongodbUri: process.env.MONGODB_URI_DEV,
    jwtSecret: process.env.JWT_SECRET_DEV,
    corsOrigin: process.env.CORS_ORIGIN_DEV,
    port: process.env.PORT || 5000,
    email: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 465,
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },
  production: {
    mongodbUri: process.env.MONGODB_URI_PROD,
    jwtSecret: process.env.JWT_SECRET_PROD,
    corsOrigin: process.env.CORS_ORIGIN_PROD || "https://admin.fishplanetlondon.co.uk",
    port: process.env.PORT || 5000,
    email: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 465,
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },
};

const currentConfig = config[env];

if (!currentConfig) {
  throw new Error(`Invalid NODE_ENV: ${env}. Must be 'development' or 'production'`);
}

// Validate required environment variables
const requiredVars = {
  development: ["MONGODB_URI_DEV", "JWT_SECRET_DEV"],
  production: ["MONGODB_URI_PROD", "JWT_SECRET_PROD"],
};

const missingVars = requiredVars[env].filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables for ${env} environment: ${missingVars.join(", ")}`);
}

if (!currentConfig.mongodbUri) {
  throw new Error(`MONGODB_URI_${env === "development" ? "DEV" : "PROD"} is required`);
}

if (!currentConfig.jwtSecret) {
  throw new Error(`JWT_SECRET_${env === "development" ? "DEV" : "PROD"} is required`);
}

module.exports = {
  ...currentConfig,
  env,
  isDevelopment: env === "development",
  isProduction: env === "production",
};
