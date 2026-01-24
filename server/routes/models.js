const express = require("express");
const { body, validationResult, query } = require("express-validator");
const mongoose = require("mongoose");
const modelsRouter = express.Router();
const Model = require("../models/models");
const { authenticateToken } = require("../middleware/auth");

// Validation middleware
const createModelValidation = [
  body("name").trim().notEmpty().withMessage("Model name is required").isLength({ max: 200 }).withMessage("Name must be less than 200 characters"),
  body("subject").trim().notEmpty().withMessage("Email subject is required").isLength({ max: 500 }).withMessage("Subject must be less than 500 characters"),
  body("content").notEmpty().withMessage("Content is required"),
  body("configId")
    .optional()
    .custom((value) => {
      if (!value || value === null || value === "") {
        return true; // Allow null, empty string, or undefined
      }
      return mongoose.Types.ObjectId.isValid(value);
    })
    .withMessage("Invalid configId format"),
];

const updateModelValidation = [
  body("name").optional().trim().isLength({ max: 200 }).withMessage("Name must be less than 200 characters"),
  body("subject").optional().trim().isLength({ max: 500 }).withMessage("Subject must be less than 500 characters"),
  body("content").optional(),
  body("configId")
    .optional()
    .custom((value) => {
      if (!value || value === null || value === "") {
        return true; // Allow null, empty string, or undefined
      }
      return mongoose.Types.ObjectId.isValid(value);
    })
    .withMessage("Invalid configId format"),
];

/**
 * GET /models
 * Get all models with optional pagination and search
 */
modelsRouter.get("/", authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = {};
    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { subject: { $regex: search, $options: "i" } }];
    }

    const models = await Model.find(query).populate("configId").sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Model.countDocuments(query);

    res.json({
      success: true,
      models,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching models:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch models",
    });
  }
});

/**
 * GET /models/:id
 * Get a single model by ID
 */
modelsRouter.get("/:id", authenticateToken, async (req, res) => {
  try {
    const model = await Model.findById(req.params.id).populate("configId");
    if (!model) {
      return res.status(404).json({
        success: false,
        error: "Model not found",
      });
    }
    res.json({
      success: true,
      model,
    });
  } catch (error) {
    console.error("Error fetching model:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch model",
    });
  }
});

/**
 * POST /models
 * Create a new model
 */
modelsRouter.post("/", authenticateToken, createModelValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const model = new Model(req.body);
    await model.save();
    await model.populate("configId");

    res.status(201).json({
      success: true,
      model,
    });
  } catch (error) {
    console.error("Error creating model:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create model",
    });
  }
});

/**
 * PUT /models/:id
 * Update a model
 */
modelsRouter.put("/:id", authenticateToken, updateModelValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const model = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate("configId");
    if (!model) {
      return res.status(404).json({
        success: false,
        error: "Model not found",
      });
    }

    res.json({
      success: true,
      model,
    });
  } catch (error) {
    console.error("Error updating model:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update model",
    });
  }
});

/**
 * DELETE /models/:id
 * Delete a model
 */
modelsRouter.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const model = await Model.findByIdAndDelete(req.params.id);
    if (!model) {
      return res.status(404).json({
        success: false,
        error: "Model not found",
      });
    }

    res.json({
      success: true,
      message: "Model deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting model:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete model",
    });
  }
});

module.exports = modelsRouter;
