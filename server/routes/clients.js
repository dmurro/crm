const express = require("express");
const clientsRouter = express.Router();
const Client = require("../models/clients");

clientsRouter.get("/", async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = clientsRouter;
