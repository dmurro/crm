const path = require("path");

const env = process.env.NODE_ENV || "development";

// Load environment-specific .env file from server directory
// Try .env.development or .env.production first, fallback to .env
const envFile = `.env.${env}`;
const envPath = path.join(__dirname, "..", envFile);
const fallbackPath = path.join(__dirname, "..", ".env");

// Try to load environment-specific file first
require("dotenv").config({ path: envPath });
// Then load .env as fallback (won't override existing vars)
require("dotenv").config({ path: fallbackPath });

const config = {
  development: {
    mongodbUri: process.env.MONGODB_URI_DEV,
    jwtSecret: process.env.JWT_SECRET_DEV,
    corsOrigin: process.env.CORS_ORIGIN_DEV,
    port: process.env.PORT || 5000,
    email: {
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: (process.env.EMAIL_PORT || 465) == 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    }    
  },
  production: {
    mongodbUri: process.env.MONGODB_URI_PROD,
    jwtSecret: process.env.JWT_SECRET_PROD,
    corsOrigin: process.env.CORS_ORIGIN_PROD || "https://admin.fishplanetlondon.co.uk",
    port: process.env.PORT || 5000,
    email: {
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: (process.env.EMAIL_PORT || 465) == 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    }    
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
