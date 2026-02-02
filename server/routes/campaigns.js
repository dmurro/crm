const express = require("express");
const { body, validationResult, query } = require("express-validator");
const campaignsRouter = express.Router();
const Campaign = require("../models/campaigns");
const CampaignRecipient = require("../models/campaignRecipients");
const Model = require("../models/models");
const emailService = require("./services/sendMail");
const { authenticateToken } = require("../middleware/auth");
const Client = require("../models/clients");
const { startSendLoopIfNeeded } = require("../jobs/campaignSendJob");

const BATCH_SIZE = 500;


// Validation middleware
const createCampaignValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Campaign name is required")
    .isLength({ max: 200 }).withMessage("Name must be less than 200 characters"),

  body("modelId")
    .isMongoId().withMessage("Invalid modelId format"),

  body("subject")
    .trim()
    .notEmpty().withMessage("Email subject is required")
    .isLength({ max: 500 }).withMessage("Subject must be less than 500 characters"),

  body("recipientSource")
    .optional()
    .isIn(["manual", "clients", "all_clients"])
    .withMessage("recipientSource must be 'manual', 'clients', or 'all_clients'"),

  body("recipients")
    .isArray()
    .custom((recipients, { req }) => {
      if (req.body.recipientSource === "all_clients") {
        // placeholder ok
        return true;
      }
      if (!recipients || recipients.length === 0) {
        throw new Error("Recipients array must not be empty");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const allValid = recipients.every(email => emailRegex.test(email));
      if (!allValid) {
        throw new Error("All recipients must be valid email addresses");
      }
      return true;
    }),
];


const updateCampaignValidation = [
  body("name").optional().trim().isLength({ max: 200 }).withMessage("Name must be less than 200 characters"),
  body("modelId").optional().isMongoId().withMessage("Invalid modelId format"),
  body("subject").optional().trim().isLength({ max: 500 }).withMessage("Subject must be less than 500 characters"),
  body("recipientSource")
  .optional()
  .isIn(["manual", "clients", "all_clients"])
  .withMessage("recipientSource must be 'manual', 'clients', or 'all_clients'"),

  body("recipients")
    .optional()
    .isArray()
    .custom((recipients, { req }) => {
      if (req.body.recipientSource === "all_clients") return true;
      if (!recipients || recipients.length === 0) {
        throw new Error("Recipients array must not be empty");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const allValid = recipients.every(email => emailRegex.test(email));
      if (!allValid) throw new Error("All recipients must be valid email addresses");
      return true;
    })
]

/**
 * GET /campaigns
 * Get all campaigns with optional pagination, search, and status filter
 */
campaignsRouter.get("/", authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const status = req.query.status;

    const query = {};
    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { subject: { $regex: search, $options: "i" } }];
    }
    if (status) {
      query.status = status;
    }

    const campaigns = await Campaign.find(query).populate("modelId").sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Campaign.countDocuments(query);

    res.json({
      success: true,
      campaigns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch campaigns",
    });
  }
});

/**
 * GET /campaigns/:id/recipients
 * Get paginated recipients (per-email status) for a campaign
 */
campaignsRouter.get("/:id/recipients", authenticateToken, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: "Campaign not found",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const skip = (page - 1) * limit;

    const [recipients, total] = await Promise.all([
      CampaignRecipient.find({ campaignId: req.params.id })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CampaignRecipient.countDocuments({ campaignId: req.params.id }),
    ]);

    res.json({
      success: true,
      recipients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching campaign recipients:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch campaign recipients",
    });
  }
});

/**
 * GET /campaigns/:id
 * Get a single campaign by ID
 */
campaignsRouter.get("/:id", authenticateToken, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate("modelId");
    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: "Campaign not found",
      });
    }
    res.json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error("Error fetching campaign:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch campaign",
    });
  }
});

/**
 * POST /campaigns
 * Create a new campaign
 */
campaignsRouter.post("/", authenticateToken, createCampaignValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // Verify model exists
    const model = await Model.findById(req.body.modelId);
    if (!model) {
      return res.status(404).json({
        success: false,
        error: "Model not found",
      });
    }

    // Deduplicate recipients
    let recipients = [];
    let total = 0;

    if (req.body.recipientSource === "all_clients") {
      req.body.recipients = ["__ALL__"];
    }

    if (req.body.recipientSource !== "all_clients") {
      recipients = [...new Set(req.body.recipients)];
      total = recipients.length;
    }

    const campaignData = {
      ...req.body,
      recipients,
      status: "draft",
      stats: {
        total,
        sent: 0,
        failed: 0,
        errors: [],
      },
    };


    const campaign = new Campaign(campaignData);
    await campaign.save();
    await campaign.populate("modelId");

    res.status(201).json({
      success: true,
      campaign,
    });
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create campaign",
    });
  }
});

/**
 * PUT /campaigns/:id
 * Update a campaign (only if status is 'draft')
 */
campaignsRouter.put("/:id", authenticateToken, updateCampaignValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: "Campaign not found",
      });
    }

    if (campaign.status !== "draft") {
      return res.status(400).json({
        success: false,
        error: "Can only update campaigns with 'draft' status",
      });
    }

    // Verify model exists if modelId is being updated
    if (req.body.modelId) {
      const model = await Model.findById(req.body.modelId);
      if (!model) {
        return res.status(404).json({
          success: false,
          error: "Model not found",
        });
      }
    }

    // Deduplicate recipients if provided
    if (req.body.recipients) {
      req.body.recipients = [...new Set(req.body.recipients)];
      req.body.stats = {
        total: req.body.recipients.length,
        sent: 0,
        failed: 0,
        errors: [],
      };
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate("modelId");

    res.json({
      success: true,
      campaign: updatedCampaign,
    });
  } catch (error) {
    console.error("Error updating campaign:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update campaign",
    });
  }
});

/**
 * DELETE /campaigns/:id
 * Delete a campaign (only if status is 'draft' or 'failed')
 */
campaignsRouter.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: "Campaign not found",
      });
    }

    if (campaign.status !== "draft" && campaign.status !== "failed") {
      return res.status(400).json({
        success: false,
        error: "Can only delete campaigns with 'draft' or 'failed' status",
      });
    }

    await Promise.all([
      CampaignRecipient.deleteMany({ campaignId: req.params.id }),
      Campaign.findByIdAndDelete(req.params.id),
    ]);

    res.json({
      success: true,
      message: "Campaign deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete campaign",
    });
  }
});

/**
 * POST /campaigns/:id/send
 * Enqueue a campaign for sending (async; cron job sends emails at 380/h max)
 */
campaignsRouter.post("/:id/send", authenticateToken, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate("modelId");
    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: "Campaign not found",
      });
    }

    if (campaign.status === "sending" || campaign.status === "sent") {
      return res.status(400).json({
        success: false,
        error: "Campaign has already been sent or is currently being sent",
      });
    }

    const model = campaign.modelId;
    if (!model) {
      return res.status(400).json({
        success: false,
        error: "Model not found",
      });
    }

    if (!model.htmlContent) {
      return res.status(400).json({
        success: false,
        error: "Model HTML content not found. Please save the model again to generate HTML content.",
      });
    }

    const campaignId = campaign._id;
    let totalEnqueued = 0;

    if (campaign.recipientSource === "all_clients") {
      // Stream clients with cursor; insert CampaignRecipient in batches (no full fetch)
      const cursor = Client.find(
        { email: { $exists: true, $ne: "" } }
      )
        .select({ email: 1 })
        .lean()
        .cursor();

      let batch = [];
      for await (const doc of cursor) {
        if (doc.email) {
          batch.push({
            campaignId,
            email: doc.email,
            status: "pending",
          });
        }
        if (batch.length >= BATCH_SIZE) {
          await CampaignRecipient.insertMany(batch);
          totalEnqueued += batch.length;
          batch = [];
        }
      }
      if (batch.length) {
        await CampaignRecipient.insertMany(batch);
        totalEnqueued += batch.length;
      }
    } else {
      // manual or clients: use campaign.recipients, dedupe, insert in batches
      const emails = [...new Set(campaign.recipients.filter((e) => e && e !== "__ALL__"))];
      if (!emails.length) {
        return res.status(400).json({
          success: false,
          error: "No recipients found for this campaign",
        });
      }
      for (let i = 0; i < emails.length; i += BATCH_SIZE) {
        const chunk = emails.slice(i, i + BATCH_SIZE).map((email) => ({
          campaignId,
          email,
          status: "pending",
        }));
        await CampaignRecipient.insertMany(chunk);
        totalEnqueued += chunk.length;
      }
    }

    if (totalEnqueued === 0) {
      return res.status(400).json({
        success: false,
        error: "No recipients found for this campaign",
      });
    }

    campaign.status = "sending";
    campaign.stats = {
      total: totalEnqueued,
      sent: 0,
      failed: 0,
      errors: [],
    };
    await campaign.save();

    startSendLoopIfNeeded();

    res.status(202).json({
      success: true,
      campaign,
      message: "Campaign enqueued for sending. Emails will be sent gradually (max 380/hour).",
    });
  } catch (error) {
    console.error("Error enqueueing campaign:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to enqueue campaign",
    });
  }
});

module.exports = campaignsRouter;
