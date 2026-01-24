const mongoose = require("mongoose");

const templateConfigSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    colors: {
      primary: { type: String, default: "#1976d2" },
      secondary: { type: String, default: "#dc004e" },
      background: { type: String, default: "#ffffff" },
      text: { type: String, default: "#000000" },
    },
    fonts: {
      heading: { type: String, default: "Arial, sans-serif" },
      body: { type: String, default: "Arial, sans-serif" },
    },
    spacing: {
      padding: { type: Number, default: 20 },
      margin: { type: Number, default: 10 },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const TemplateConfig = mongoose.model("TemplateConfig", templateConfigSchema);

module.exports = TemplateConfig;
