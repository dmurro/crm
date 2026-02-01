const fs = require("fs");
const csv = require("csv-parser");

/**
 * Import clients from Legacy CRM CSV
 * Format: Semicolon-delimited with columns:
 * CONTACT ID;EMAIL;LASTNAME;FIRSTNAME;WHATSAPP;SMS;DOUBLE_OPT-IN;OPT_IN;LANDLINE_NUMBER;EXT_ID;CONTACT_TIMEZONE;JOB_TITLE;LINKEDIN;ADDED_TIME;MODIFIED_TIME
 */
class LegacyCRMImporter {
  constructor(filePath, ClientModel) {
    this.filePath = filePath;
    this.Client = ClientModel;
    this.results = {
      total: 0,
      imported: 0,
      updated: 0,
      skipped: 0,
      errors: [],
    };
  }

  /**
   * Parse date from DD-MM-YYYY format
   */
  parseDate(dateStr) {
    if (!dateStr || dateStr.trim() === "") return null;
    
    try {
      const [day, month, year] = dateStr.split("-");
      return new Date(year, month - 1, day);
    } catch (error) {
      return null;
    }
  }

  /**
   * Clean and prepare client data
   */
  prepareClientData(row) {
    return {
      contactId: row["CONTACT ID"]?.trim() || null,
      email: row["EMAIL"]?.trim().toLowerCase() || null,
      lastName: row["LASTNAME"]?.trim() || null,
      firstName: row["FIRSTNAME"]?.trim() || null,
      whatsapp: row["WHATSAPP"]?.trim() || null,
      sms: row["SMS"]?.trim() || null,
      doubleOptIn: row["DOUBLE_OPT-IN"]?.trim() || null,
      optIn: row["OPT_IN"]?.trim() || null,
      landlineNumber: row["LANDLINE_NUMBER"]?.trim() || null,
      externalId: row["EXT_ID"]?.trim() || null,
      timezone: row["CONTACT_TIMEZONE"]?.trim() || null,
      jobTitle: row["JOB_TITLE"]?.trim() || null,
      linkedin: row["LINKEDIN"]?.trim() || null,
      memberSince: this.parseDate(row["ADDED_TIME"]),
      updatedAt: this.parseDate(row["MODIFIED_TIME"]),
      source: "legacy_crm",
      importedAt: new Date(),
    };
  }

  /**
   * Import clients from CSV file
   */
  async import() {
    console.log(`🚀 Starting Legacy CRM import from: ${this.filePath}`);

    return new Promise((resolve, reject) => {
      const clients = [];

      fs.createReadStream(this.filePath)
        .pipe(csv({ separator: ";" }))
        .on("data", (row) => {
          this.results.total++;
          
          try {
            const clientData = this.prepareClientData(row);
            
            // Skip if no email
            if (!clientData.email) {
              this.results.skipped++;
              return;
            }
            
            clients.push(clientData);
          } catch (error) {
            this.results.errors.push({
              row: this.results.total,
              error: error.message,
            });
          }
        })
        .on("end", async () => {
          try {
            await this.saveClients(clients);
            console.log("✅ Legacy CRM import completed");
            console.log(this.getReport());
            resolve(this.results);
          } catch (error) {
            reject(error);
          }
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  }

  /**
   * Save clients to database
   */
  async saveClients(clients) {
    for (const clientData of clients) {
      try {
        // Se l'email esiste già, non caricare
        const existing = await this.Client.findOne({ email: clientData.email });
        if (existing) {
          this.results.skipped++;
          continue;
        }
        await this.Client.create(clientData);
        this.results.imported++;
      } catch (error) {
        this.results.errors.push({
          email: clientData.email,
          error: error.message,
        });
      }
    }
  }

  /**
   * Get import report
   */
  getReport() {
    return `
╔════════════════════════════════════════╗
║   LEGACY CRM IMPORT REPORT            ║
╠════════════════════════════════════════╣
║ Total rows:        ${String(this.results.total).padStart(6)} ║
║ Imported:          ${String(this.results.imported).padStart(6)} ║
║ Updated:           ${String(this.results.updated).padStart(6)} ║
║ Skipped:           ${String(this.results.skipped).padStart(6)} ║
║ Errors:            ${String(this.results.errors.length).padStart(6)} ║
╚════════════════════════════════════════╝
    `;
  }
}

module.exports = LegacyCRMImporter;