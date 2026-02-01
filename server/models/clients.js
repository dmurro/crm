const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    // Identificatori (3 campi)
    contactId: { type: String, unique: true, sparse: true, index: true },
    customerId: { type: String, unique: true, sparse: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },

    // Informazioni personali (5 campi)
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    address: { type: String, trim: true },
    birthday: { type: Date },

    // Contatti (4 campi)
    phone: { type: String, trim: true },
    sms: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    landlineNumber: { type: String, trim: true },

    // Consensi (4 campi)
    consent: { type: Boolean, default: false },
    doubleOptIn: { type: String, trim: true },
    optIn: { type: String, trim: true },
    channel: { type: String, enum: ["email", "sms", "whatsapp", null] },

    // Loyalty Program (6 campi) 🆕
    status: { type: String, enum: ["new", "active", "inactive", "vip", null], default: "active" },
    points: { type: Number, default: 0 },
    creditBalance: { type: String, default: "£0.00" },
    totalAmountSpent: { type: String, default: "£0.00" },
    visits: { type: Number, default: 0 },
    barcode: { type: String, trim: true },

    // Date importanti (4 campi)
    memberSince: { type: Date },
    lastPurchase: { type: Date },
    lastCheckIn: { type: Date },

    // Professionali (4 campi)
    externalId: { type: String, trim: true },
    timezone: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    linkedin: { type: String, trim: true },

    // Pagamenti (2 campi) 🆕
    paymentMethod: { type: String, trim: true },
    paymentMethodToken: { type: String, trim: true },

    // Note (1 campo) 🆕
    comment: { type: String, trim: true },

    // Metadata (3 campi) 🆕
    source: { type: String, enum: ["legacy_crm", "new_crm", "manual"], required: true, index: true },
    importedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // 🆕 Auto-gestisce createdAt e updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 🆕 Indici per performance
clientSchema.index({ email: 1, source: 1 });
clientSchema.index({ status: 1, memberSince: -1 });
clientSchema.index({ createdAt: -1 });

// 🆕 Virtual field
clientSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// 🆕 Metodi
clientSchema.methods.isVip = function () {
  return this.status === "vip";
};

module.exports = mongoose.model("Client", clientSchema);