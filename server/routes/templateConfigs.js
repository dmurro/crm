const express = require("express");
const { body, validationResult } = require("express-validator");
const templateConfigsRouter = express.Router();
const TemplateConfig = require("../models/templateConfigs");
const { authenticateToken } = require("../middleware/auth");

// Validation middleware
const createConfigValidation = [
  body("name").trim().notEmpty().withMessage("Config name is required").isLength({ max: 200 }).withMessage("Name must be less than 200 characters"),
  body("description").optional().trim().isLength({ max: 1000 }).withMessage("Description must be less than 1000 characters"),
  body("isDefault").optional().isBoolean().withMessage("isDefault must be a boolean"),
];

const updateConfigValidation = [
  body("name").optional().trim().isLength({ max: 200 }).withMessage("Name must be less than 200 characters"),
  body("description").optional().trim().isLength({ max: 1000 }).withMessage("Description must be less than 1000 characters"),
  body("isDefault").optional().isBoolean().withMessage("isDefault must be a boolean"),
];

/**
 * GET /template-configs
 * Get all template configs
 */
templateConfigsRouter.get("/", authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const configs = await TemplateConfig.find().sort({ isDefault: -1, createdAt: -1 }).limit(limit);

    res.json({
      success: true,
      configs,
    });
  } catch (error) {
    console.error("Error fetching template configs:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch template configs",
    });
  }
});

/**
 * GET /template-configs/:id
 * Get a single template config by ID
 */
templateConfigsRouter.get("/:id", authenticateToken, async (req, res) => {
  try {
    const config = await TemplateConfig.findById(req.params.id);
    if (!config) {
      return res.status(404).json({
        success: false,
        error: "Template config not found",
      });
    }
    res.json({
      success: true,
      config,
    });
  } catch (error) {
    console.error("Error fetching template config:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch template config",
    });
  }
});

/**
 * POST /template-configs
 * Create a new template config
 */
templateConfigsRouter.post("/", authenticateToken, createConfigValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // If setting as default, unset other defaults
    if (req.body.isDefault) {
      await TemplateConfig.updateMany({}, { $set: { isDefault: false } });
    }

    const config = new TemplateConfig(req.body);
    await config.save();

    res.status(201).json({
      success: true,
      config,
    });
  } catch (error) {
    console.error("Error creating template config:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create template config",
    });
  }
});

/**
 * PUT /template-configs/:id
 * Update a template config
 */
templateConfigsRouter.put("/:id", authenticateToken, updateConfigValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // If setting as default, unset other defaults
    if (req.body.isDefault) {
      await TemplateConfig.updateMany({ _id: { $ne: req.params.id } }, { $set: { isDefault: false } });
    }

    const config = await TemplateConfig.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!config) {
      return res.status(404).json({
        success: false,
        error: "Template config not found",
      });
    }

    res.json({
      success: true,
      config,
    });
  } catch (error) {
    console.error("Error updating template config:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update template config",
    });
  }
});

/**
 * DELETE /template-configs/:id
 * Delete a template config
 */
templateConfigsRouter.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const config = await TemplateConfig.findByIdAndDelete(req.params.id);
    if (!config) {
      return res.status(404).json({
        success: false,
        error: "Template config not found",
      });
    }

    res.json({
      success: true,
      message: "Template config deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting template config:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete template config",
    });
  }
});

module.exports = templateConfigsRouter;
