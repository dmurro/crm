const mongoose = require("mongoose");
const LegacyCRMImporter = require("../utils/legacyCRMImporter");
const NewCRMImporter = require("../utils/newCRMImporter");

/**
 * Main import script
 * Usage: node importClients.js
 */

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/crm";

// File paths
const LEGACY_CRM_FILE = process.argv[2] || "../utils/legacy.csv";
const NEW_CRM_FILE = process.argv[3] || "../utils/new.csv";

async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
    
    // Load the model AFTER connection
    const Client = require("../models/clients");
    return Client;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

async function importData() {
  console.log("\n╔═══════════════════════════════════════════╗");
  console.log("║   CRM DATA IMPORT UTILITY                ║");
  console.log("╚═══════════════════════════════════════════╝\n");

  try {
    // Connect to database
    const Client = await connectDatabase();

    // Import from Legacy CRM
    console.log("\n📥 Step 1: Importing from Legacy CRM...\n");
    const legacyImporter = new LegacyCRMImporter(LEGACY_CRM_FILE, Client);
    const legacyResults = await legacyImporter.import();

    // Import from New CRM
    console.log("\n📥 Step 2: Importing from New CRM...\n");
    const newImporter = new NewCRMImporter(NEW_CRM_FILE, Client);
    const newResults = await newImporter.import();

    // Final summary
    console.log("\n╔═══════════════════════════════════════════╗");
    console.log("║   IMPORT SUMMARY                         ║");
    console.log("╠═══════════════════════════════════════════╣");
    console.log(`║ Legacy CRM:                              ║`);
    console.log(`║   - Imported: ${String(legacyResults.imported).padStart(6)}                    ║`);
    console.log(`║   - Updated:  ${String(legacyResults.updated).padStart(6)}                    ║`);
    console.log(`║   - Errors:   ${String(legacyResults.errors.length).padStart(6)}                    ║`);
    console.log(`║                                          ║`);
    console.log(`║ New CRM:                                 ║`);
    console.log(`║   - Imported: ${String(newResults.imported).padStart(6)}                    ║`);
    console.log(`║   - Updated:  ${String(newResults.updated).padStart(6)}                    ║`);
    console.log(`║   - Errors:   ${String(newResults.errors.length).padStart(6)}                    ║`);
    console.log("╚═══════════════════════════════════════════╝\n");

    // Show errors if any
    if (legacyResults.errors.length > 0) {
      console.log("\n⚠️  Legacy CRM Errors:");
      legacyResults.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error.email || `Row ${error.row}`}: ${error.error}`);
      });
    }

    if (newResults.errors.length > 0) {
      console.log("\n⚠️  New CRM Errors:");
      newResults.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error.email || `Row ${error.row}`}: ${error.error}`);
      });
    }

    console.log("\n✅ Import process completed successfully!\n");
  } catch (error) {
    console.error("\n❌ Import failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB\n");
  }
}

// Run the import
importData();