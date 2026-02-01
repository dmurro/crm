const fs = require("fs");
const csv = require("csv-parser");

/**
 * Import clients from New CRM CSV
 * Format: Comma-delimited with columns:
 * Customer ID,First name,Last name,Email,Phone,Address,Birthday,Comment,Last purchase,Points,Credit balance,Barcode,Consent,Channel,Last check-in,Status,Member since,Payment method,Payment method token,Total amount spent,Visits
 */
class NewCRMImporter {
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
   * Parse date from YYYY-MM-DD HH:mm:ss format
   */
  parseDate(dateStr) {
    if (!dateStr || dateStr.trim() === "") return null;
    
    try {
      return new Date(dateStr);
    } catch (error) {
      return null;
    }
  }

  /**
   * Parse boolean from string
   */
  parseBoolean(value) {
    if (!value) return false;
    const normalized = value.toString().toLowerCase().trim();
    return normalized === "true" || normalized === "1";
  }

  /**
   * Parse number with fallback
   */
  parseNumber(value, defaultValue = 0) {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * Normalize channel value
   */
  normalizeChannel(channel) {
    if (!channel) return null;
    const normalized = channel.toLowerCase().trim();
    if (["email", "sms", "whatsapp"].includes(normalized)) {
      return normalized;
    }
    return null;
  }

  /**
   * Normalize status value
   */
  normalizeStatus(status) {
    if (!status) return "active";
    const normalized = status.toLowerCase().trim();
    if (["new", "active", "inactive", "vip"].includes(normalized)) {
      return normalized;
    }
    return "active";
  }

  /**
   * Clean and prepare client data
   */
  prepareClientData(row) {
    return {
      customerId: row["Customer ID"]?.trim() || null,
      email: row["Email"]?.trim().toLowerCase() || null,
      firstName: row["First name"]?.trim() || null,
      lastName: row["Last name"]?.trim() || null,
      phone: row["Phone"]?.trim() || null,
      address: row["Address"]?.trim() || null,
      birthday: this.parseDate(row["Birthday"]),
      comment: row["Comment"]?.trim() || null,
      lastPurchase: this.parseDate(row["Last purchase"]),
      points: this.parseNumber(row["Points"]),
      creditBalance: row["Credit balance"]?.trim() || "£0.00",
      barcode: row["Barcode"]?.trim() || null,
      consent: this.parseBoolean(row["Consent"]),
      channel: this.normalizeChannel(row["Channel"]),
      lastCheckIn: this.parseDate(row["Last check-in"]),
      status: this.normalizeStatus(row["Status"]),
      memberSince: this.parseDate(row["Member since"]),
      paymentMethod: row["Payment method"]?.trim() || null,
      paymentMethodToken: row["Payment method token"]?.trim() || null,
      totalAmountSpent: row["Total amount spent"]?.trim() || "£0.00",
      visits: this.parseNumber(row["Visits"]),
      source: "new_crm",
      importedAt: new Date(),
    };
  }

  /**
   * Import clients from CSV file
   */
  async import() {
    console.log(`🚀 Starting New CRM import from: ${this.filePath}`);

    return new Promise((resolve, reject) => {
      const clients = [];

      fs.createReadStream(this.filePath)
        .pipe(csv())
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
            console.log("✅ New CRM import completed");
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
   * Merge existing and new client data intelligently
   */
  mergeClientData(existing, newData) {
    const merged = { ...existing };

    // Prefer new CRM data for customer-specific fields
    if (newData.customerId) merged.customerId = newData.customerId;
    if (newData.phone) merged.phone = newData.phone;
    if (newData.address) merged.address = newData.address;
    if (newData.birthday) merged.birthday = newData.birthday;
    if (newData.points > 0) merged.points = newData.points;
    if (newData.creditBalance) merged.creditBalance = newData.creditBalance;
    if (newData.barcode) merged.barcode = newData.barcode;
    if (newData.lastPurchase) merged.lastPurchase = newData.lastPurchase;
    if (newData.lastCheckIn) merged.lastCheckIn = newData.lastCheckIn;
    if (newData.totalAmountSpent) merged.totalAmountSpent = newData.totalAmountSpent;
    if (newData.visits > 0) merged.visits = newData.visits;
    if (newData.paymentMethod) merged.paymentMethod = newData.paymentMethod;
    if (newData.comment) merged.comment = newData.comment;

    // Keep firstName and lastName if not empty
    if (newData.firstName) merged.firstName = newData.firstName;
    if (newData.lastName) merged.lastName = newData.lastName;

    // Update status and channel
    if (newData.status) merged.status = newData.status;
    if (newData.channel) merged.channel = newData.channel;

    // Update consent
    merged.consent = newData.consent;

    // Update source to indicate it's been enriched
    merged.source = "new_crm";
    merged.importedAt = new Date();

    return merged;
  }

  /**
   * Get import report
   */
  getReport() {
    return `
╔════════════════════════════════════════╗
║   NEW CRM IMPORT REPORT               ║
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

module.exports = NewCRMImporter;