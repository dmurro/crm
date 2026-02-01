const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    modelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Model",
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    recipientSource: {
      type: String,
      enum: ["manual", "clients", "all_clients"],
      default: "manual",
    },
    recipients: {
      type: [String],
      required: true,
    },    
    status: {
      type: String,
      enum: ["draft", "sending", "sent", "failed"],
      default: "draft",
    },
    stats: {
      total: { type: Number, default: 0 },
      sent: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
      errors: { type: [Object], default: [] },
    },
    sentAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;
