const app = require("..");
const config = require("../config");

// In development, don't start the server here (it's started in index.js)
// In production (Vercel), export the app as serverless function
if (config.isDevelopment) {
  // In development, the server is already running via index.js
  // This file is only used in production (Vercel serverless)
  console.log("API handler loaded (development mode - server runs via index.js)");
} else {
  // Production mode - Vercel serverless function
  console.log("API handler loaded (production mode - Vercel serverless)");
}

module.exports = app;
