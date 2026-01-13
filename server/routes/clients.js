const express = require("express");
const clientsRouter = express.Router();
const Client = require("../models/clients");
const { authenticateToken } = require("../middleware/auth");

// Protect clients route with authentication
clientsRouter.get("/", authenticateToken, async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = clientsRouter;
