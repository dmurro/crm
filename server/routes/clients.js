const express = require("express");
const Client = require("../models/clients");
const { authenticateToken } = require("../middleware/auth");

const clientsRouter = express.Router();

/**
 * @route   GET /clients
 * @desc    Get all clients with pagination and filters
 * @access  Private
 */
clientsRouter.get("/", authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      status,
      source,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build query
    const query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by source
    if (source) {
      query.source = source;
    }

    // Search by name or email
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [clients, total] = await Promise.all([
      Client.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Client.countDocuments(query),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: clients,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: error.message,
    });
  }
});

/**
 * @route   GET /clients/stats
 * @desc    Get client statistics
 * @access  Private
 */
clientsRouter.get("/stats", authenticateToken, async (req, res) => {
  try {
    const [statusStats, sourceStats, totalClients, vipClients, activeClients] =
      await Promise.all([
        Client.aggregate([
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        Client.aggregate([
          { $group: { _id: "$source", count: { $sum: 1 } } },
        ]),
        Client.countDocuments(),
        Client.countDocuments({ status: "vip" }),
        Client.countDocuments({ status: "active" }),
      ]);

    res.json({
      success: true,
      data: {
        total: totalClients,
        vipClients,
        activeClients,
        byStatus: statusStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        bySource: sourceStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    console.error("Error fetching client stats:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: error.message,
    });
  }
});

/**
 * @route   GET /clients/:id
 * @desc    Get single client by ID
 * @access  Private
 */
clientsRouter.get("/:id", authenticateToken, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      });
    }

    res.json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: error.message,
    });
  }
});

/**
 * @route   POST /clients
 * @desc    Create new client
 * @access  Private
 */
clientsRouter.post("/", authenticateToken, async (req, res) => {
  try {
    const clientData = {
      ...req.body,
      source: "manual",
      importedAt: new Date(),
    };

    const client = await Client.create(clientData);

    res.status(201).json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error("Error creating client:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: Object.values(error.errors).map((err) => err.message),
      });
    }

    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "Client with this email already exists",
      });
    }

    res.status(500).json({
      success: false,
      error: "Server error",
      message: error.message,
    });
  }
});

/**
 * @route   PUT /clients/:id
 * @desc    Update client
 * @access  Private
 */
clientsRouter.put("/:id", authenticateToken, async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      });
    }

    res.json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error("Error updating client:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      error: "Server error",
      message: error.message,
    });
  }
});

/**
 * @route   DELETE /clients/:id
 * @desc    Delete client
 * @access  Private
 */
clientsRouter.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      });
    }

    res.json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: error.message,
    });
  }
});

/**
 * @route   GET /clients/search/email
 * @desc    Search client by email
 * @access  Private
 */
clientsRouter.get("/search/email/:email", authenticateToken, async (req, res) => {
  try {
    const client = await Client.findOne({
      email: req.params.email.toLowerCase(),
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      });
    }

    res.json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error("Error searching client:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: error.message,
    });
  }
});

module.exports = clientsRouter;