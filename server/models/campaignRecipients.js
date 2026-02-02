const mongoose = require("mongoose");

const campaignRecipientSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
      index: true,
    },
    error: {
      type: String,
      default: null,
    },
    sentAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

campaignRecipientSchema.index({ campaignId: 1, status: 1 });

const CampaignRecipient = mongoose.model("CampaignRecipient", campaignRecipientSchema);

module.exports = CampaignRecipient;
