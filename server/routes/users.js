const express = require("express");
const { body, validationResult, query } = require("express-validator");
const usersRouter = express.Router();
const User = require("../models/users");
const { authenticateToken } = require("../middleware/auth");
const bcrypt = require("bcryptjs");

// Validation middleware for user creation
const createUserValidation = [
  body("username").trim().notEmpty().withMessage("Username is required").isLength({ min: 3, max: 50 }).withMessage("Username must be between 3 and 50 characters"),
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Please enter a valid email address").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("firstName").optional().trim().isLength({ max: 50 }).withMessage("First name must be less than 50 characters"),
  body("lastName").optional().trim().isLength({ max: 50 }).withMessage("Last name must be less than 50 characters"),
  body("role").optional().isIn(["admin", "user", "manager"]).withMessage("Role must be admin, user, or manager"),
];

// Validation middleware for user update
const updateUserValidation = [
  body("username").optional().trim().isLength({ min: 3, max: 50 }).withMessage("Username must be between 3 and 50 characters"),
  body("email").optional().trim().isEmail().withMessage("Please enter a valid email address").normalizeEmail(),
  body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("firstName").optional().trim().isLength({ max: 50 }).withMessage("First name must be less than 50 characters"),
  body("lastName").optional().trim().isLength({ max: 50 }).withMessage("Last name must be less than 50 characters"),
  body("role").optional().isIn(["admin", "user", "manager"]).withMessage("Role must be admin, user, or manager"),
  body("isActive").optional().isBoolean().withMessage("isActive must be a boolean"),
];

/**
 * GET /users
 * Get all users (with pagination and filtering)
 * Requires authentication
 */
usersRouter.get(
  "/",
  authenticateToken,
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
    query("search").optional().trim(),
    query("role").optional().isIn(["admin", "user", "manager"]).withMessage("Invalid role filter"),
    query("isActive").optional().isBoolean().withMessage("isActive must be a boolean"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Build filter
      const filter = {};
      if (req.query.search) {
        filter.$or = [
          { username: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
          { firstName: { $regex: req.query.search, $options: "i" } },
          { lastName: { $regex: req.query.search, $options: "i" } },
        ];
      }
      if (req.query.role) {
        filter.role = req.query.role;
      }
      if (req.query.isActive !== undefined) {
        filter.isActive = req.query.isActive === "true";
      }

      const users = await User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit);
      const total = await User.countDocuments(filter);

      res.json({
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/**
 * GET /users/:id
 * Get a single user by ID
 * Requires authentication
 */
usersRouter.get("/:id", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /users
 * Create a new user
 * Requires authentication
 */
usersRouter.post("/", authenticateToken, createUserValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, firstName, lastName, role, isActive } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.username === username ? "Username already exists" : "Email already exists",
      });
    }

    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      role: role || "user",
      isActive: isActive !== undefined ? isActive : true,
    });

    await user.save();

    // Return user without password
    const userResponse = user.toJSON();

    res.status(201).json({
      message: "User created successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * PUT /users/:id
 * Update a user
 * Requires authentication
 */
usersRouter.put("/:id", authenticateToken, updateUserValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, firstName, lastName, role, isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if username or email already exists (excluding current user)
    if (username || email) {
      const orConditions = [];
      if (username) orConditions.push({ username });
      if (email) orConditions.push({ email });

      const existingUser = await User.findOne({
        _id: { $ne: req.params.id },
        $or: orConditions,
      });

      if (existingUser) {
        return res.status(400).json({
          message: existingUser.username === username ? "Username already exists" : "Email already exists",
        });
      }
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password; // Will be hashed by pre-save hook
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    // Return user without password
    const userResponse = user.toJSON();

    res.json({
      message: "User updated successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * DELETE /users/:id
 * Delete a user (soft delete by setting isActive to false)
 * Requires authentication
 */
usersRouter.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Soft delete: set isActive to false
    user.isActive = false;
    await user.save();

    res.json({
      message: "User deactivated successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * DELETE /users/:id/hard
 * Permanently delete a user
 * Requires authentication
 */
usersRouter.delete("/:id/hard", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User permanently deleted",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = usersRouter;
